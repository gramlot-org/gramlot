"""A page's server-side Bag and declarative, synchronous reactive recipe.

Transport and database access belong to integrations and application methods.
This experimental executor accepts setters, named controllers and named formulas.
"""
from collections import deque
from inspect import iscoroutinefunction
import re

from genro_bag import Bag
from genro_tytx import from_tytx, to_tytx
from .builder import GramlotBuilder

_PATH = re.compile(r"^[^.?#\[\]!:]+(?:\.[^.?#\[\]!:]+)*$")


def store_path(path, *, relative=False):
    """Check a literal label path; empty is the root only in change messages."""
    if not isinstance(path, str) or not (relative and path == "" or _PATH.fullmatch(path)):
        raise ValueError("A store path must contain dot-separated literal labels")
    return path


def _intersects(left, right):
    return left == right or left.startswith(right + ".") or right.startswith(left + ".")


class PageStore:
    """One live Bag per page ID. Subclasses declare their recipe in main(root)."""

    def __init__(self):
        self.builder = GramlotBuilder()
        self.data = self.builder.data
        self._subscribers = {}
        self._changes = deque()
        self._dispatching = False
        self._closed = False
        self._started = False
        self._publish_to_page = None

    def main(self, root):
        """Declare server dataSetter, dataController and dataFormula nodes."""

    def start(self):
        """Build once and automatically activate the builder's server recipe."""
        self._require_open()
        if self._started:
            raise RuntimeError("PageStore is already started")
        if iscoroutinefunction(self.main):
            raise TypeError("The PageStore PoC requires a synchronous main")
        self._started = True
        try:
            self.main(self.builder.source)
            # Queue the original delta before controllers can emit derived changes.
            self.data.subscribe("page-store", any=self._on_change)
            self.builder._start_reactivity(self)
        except BaseException:
            self.close()
            raise

    def subscribe(self, binder_id, path, send):
        """Register and synchronously enqueue a snapshot before any later changes."""
        self._require_open()
        store_path(path)
        if binder_id in self._subscribers:
            raise ValueError("Binder is already registered")
        self._subscribers[binder_id] = (path, send)
        try:
            send(to_tytx(self._snapshot(binder_id, path)))
        except BaseException:
            self._subscribers.pop(binder_id, None)
            raise

    def publish(self, topic, payload=None, *, metadata=None, page_id=None):
        """Publish locally, or to a same-owner browser page when page_id is given."""
        self._require_open()
        if page_id is not None:
            if metadata is not None:
                raise ValueError("Browser publication does not accept server subscription metadata")
            if self._publish_to_page is None:
                raise RuntimeError("PageStore is not attached to a server")
            return self._publish_to_page(topic, {} if payload is None else payload, page_id)
        if self.builder._binding_runtime is None:
            raise RuntimeError("PageStore recipe is not active")
        self.builder._binding_runtime.publish(topic, {} if payload is None else payload, metadata=metadata)

    def unsubscribe(self, binder_id):
        self._subscribers.pop(binder_id, None)

    def _snapshot(self, binder_id, path):
        node = self.data.get_node(path)
        return dict(op="snapshot", binderId=binder_id, path="",
                    value=node.value if node else None, attr=dict(node.attr) if node else {},
                    exists=node is not None)

    def change(self, binder_id, message):
        """Apply a change only within the registered server branch."""
        self._require_open()
        base, _ = self._subscribers[binder_id]
        relative = store_path(message["path"], relative=True)
        path = base + "." + relative if relative else base
        evt = message["evt"]
        if message.get("fired"):
            raise ValueError("Fired events are outside the first PageStore PoC")
        if evt == "del":
            self.data.pop_node(path, _reason=binder_id)
        elif evt in ("ins", "upd_value", "upd_attrs", "upd"):
            if not isinstance(message["attr"], dict):
                raise ValueError("Change attributes must be a mapping")
            # Attribute-only events must not replace the current value with a stale copy.
            if evt == "upd_attrs":
                node = self.data.get_node(path)
                if node is None:
                    raise ValueError("Attribute target does not exist")
                node.set_attr(message["attr"], trigger=binder_id, _updattr=False,
                              _remove_null_attributes=False)
            else:
                self.data.set_item(path, message["value"], _attributes=message["attr"],
                                   node_position=message.get("index"), _reason=binder_id,
                                   _remove_null_attributes=False)
        else:
            raise ValueError("Unsupported datachange event")

    def _on_change(self, node, pathlist, evt, reason=None, **kwargs):
        if reason == "autocreate":
            return
        # Bag deletion events use None for the subscribed Bag's own root.
        pathlist = [] if pathlist is None else pathlist
        nodes = node if isinstance(node, list) else [node]
        for item in nodes:
            path = ".".join([*pathlist, item.label] if evt in ("ins", "del") else pathlist)
            # Freeze the value now: later controller writes must not change an earlier message.
            frozen = from_tytx(to_tytx(dict(value=item.value, attr=dict(item.attr))))
            self._changes.append((path, evt, reason, frozen, kwargs.get("ind")))
        if self._dispatching:
            return
        self._dispatching = True
        try:
            while self._changes:
                path, evt, origin, frozen, index = self._changes.popleft()
                for binder_id, (base, send) in list(self._subscribers.items()):
                    if binder_id == origin or not _intersects(path, base):
                        continue
                    if path == base or path.startswith(base + "."):
                        message = dict(op="change", binderId=binder_id,
                                       path=path[len(base) + 1:] if path != base else "",
                                       evt=evt, origin=origin if origin in self._subscribers else None,
                                       index=index, **frozen)
                    else:
                        if evt == "upd_attrs":
                            continue
                        # Derive the branch change from this event's frozen value,
                        # not from a later state produced by another controller write.
                        value = frozen["value"]
                        child = value.get_node(base[len(path) + 1:]) if evt != "del" and isinstance(value, Bag) else None
                        message = dict(op="change", binderId=binder_id, path="",
                                       evt="upd_value" if child is not None else "del",
                                       value=child.value if child is not None else None,
                                       attr=dict(child.attr) if child is not None else {},
                                       origin=origin if origin in self._subscribers else None,
                                       index=None)
                    send(to_tytx(message))
        finally:
            self._dispatching = False

    def _require_open(self):
        if self._closed:
            raise RuntimeError("PageStore is closed")

    def close(self):
        if self._closed:
            return
        self._closed = True
        self._publish_to_page = None
        self.builder._stop_reactivity()
        self.data.unsubscribe("page-store", any=True)
        self._subscribers.clear()
        self._changes.clear()


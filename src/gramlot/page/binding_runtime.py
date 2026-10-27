"""Synchronous execution of a PageStore's reactive Gramlot Source recipe."""
from collections import deque
from dataclasses import dataclass, replace
from inspect import Parameter, isawaitable, iscoroutine, iscoroutinefunction, signature

from genro_tytx import from_tytx, to_tytx


@dataclass(frozen=True)
class DataRegistration:
    """One Source parameter's absolute Data dependency."""

    source_node: object
    parameter: str
    path: str
    attr: str | None


@dataclass(frozen=True)
class DataChange:
    """Bag mutation context; level is relative to the receiving registration."""

    node: object
    path: str
    evt: str
    reason: object
    fired: bool
    oldvalue: object
    attrs_diff: object
    value: object
    attr: dict
    index: int | None
    level: str | None = None
    registration: DataRegistration | None = None


def trigger_level(watched, changed):
    """Compare complete path segments, as the browser DataRouter does."""
    if watched == changed:
        return "node"
    if watched.startswith(changed + "."):
        return "container"
    if changed.startswith(watched + "."):
        return "child"
    return None


def accepts(registration, change, level):
    """Keep value/attribute and ancestor/descendant semantics aligned with JS."""
    if registration.attr is None:
        return change.evt != "upd_attrs" and not (level == "child" and change.fired)
    if level == "child":
        return False
    if level == "container":
        return change.evt != "upd_attrs"
    return change.evt in ("ins", "del") or registration.attr in (change.attrs_diff or {})


class BindingRuntime:
    """Observe Data and execute named Python providers; no transport or rendering."""

    def __init__(self, builder, logic):
        self.builder = builder
        self.logic = logic
        self.providers = []
        self.topics = {}
        self.changes = deque()
        self.dispatching = False
        self.closed = False
        self.subscriber_id = f"gramlot-binding-{id(self)}"

    def start(self):
        setters = []
        for node in self.builder.source.nodes:
            tag = node.node_tag
            if tag == "dataSetter":
                setters.append(node)
                continue
            if tag not in ("dataController", "dataFormula"):
                raise ValueError(f"Unsupported PageStore recipe element: {tag}")
            name = node.attr.get("func")
            if not isinstance(name, str) or not name or name.startswith("_") or "." in name:
                raise ValueError("PageStore controllers and formulas require a named func")
            function = getattr(self.logic, name)
            if not callable(function) or iscoroutinefunction(function):
                raise TypeError("PageStore providers require synchronous named methods")
            if node.attr.get("script") is not None or node.attr.get("formula") is not None:
                raise ValueError("PageStore executes Python methods, not inline browser code")
            for key in node.attr:
                if key.startswith("_") and key not in ("_meta", "_onStart", "_userChanges"):
                    raise ValueError(f"Unsupported PageStore provider control: {key}")
                if key.startswith("selfsubscribe_"):
                    raise ValueError("PageStore Source self-topics are not implemented")
            for key in ("_onStart", "_userChanges"):
                if key in node.attr and not isinstance(node.attr[key], bool):
                    raise ValueError(f"PageStore {key} requires a literal boolean")
            parameters = signature(function).parameters
            reserved = {"_node", "_reason", "_triggerpars", "_subscription_kwargs", "_subscription_metadata"}
            if any(p.kind == Parameter.POSITIONAL_ONLY and key in reserved for key, p in parameters.items()):
                raise TypeError("PageStore trigger parameters must accept keyword arguments")
            context_names = reserved if any(p.kind == Parameter.VAR_KEYWORD for p in parameters.values()) else reserved & parameters.keys()
            registrations = []
            for parameter, pointer in node.pointers():
                if parameter == "datapath":
                    continue
                absolute = node.abs_datapath(pointer)
                if not isinstance(absolute, str) or not absolute:
                    raise ValueError("PageStore dependencies require a resolved Data path")
                path, separator, attr = absolute.partition("?")
                registrations.append(DataRegistration(node, parameter, path, attr if separator else None))
            provider = (node, function, context_names, registrations)
            self.providers.append(provider)
            for key in node.attr:
                if key.startswith("subscribe_"):
                    topic = key[len("subscribe_"):]
                    if not topic:
                        raise ValueError("A subscription topic must be nonempty")
                    # Like browser providers, declarations subscribe by presence.
                    self.topics.setdefault(topic, []).append(provider)
        # Seed the complete Data before enabling the recipe's subscriptions.
        for node in setters:
            self.builder.data.set_item(node.abs_datapath(node.attr["destination_path"]), node.attr["value"])
        self.builder.data.subscribe(self.subscriber_id, any=self.receive)
        for provider in self.providers:
            if provider[0].attr.get("_onStart") is True:
                self.execute(provider)

    def publish(self, topic, payload, *, metadata=None):
        """Deliver one page-local topic synchronously, without retention or replies."""
        if self.closed:
            raise RuntimeError("The server recipe is closed")
        if not isinstance(topic, str) or not topic:
            raise ValueError("A topic must be a nonempty string")
        if not isinstance(payload, dict) or any(not isinstance(key, str) for key in payload):
            raise TypeError("Publication payload must be a mapping of named data")
        for provider in tuple(self.topics.get(topic, ())):
            if provider[0].attr.get("_userChanges") and topic != "node":
                continue
            self.execute(provider, topic=topic, payload=payload, metadata=metadata)

    def execute(self, provider, change=None, *, topic=None, payload=None, metadata=None):
        if self.closed:
            return
        node, function, context_names, _ = provider
        _, values = self.builder.runtime_values(node)
        declared = {name: value for name, value in values.items()
                      if name not in ("func", "result_path", "formula", "script", "datapath")
                      and not name.startswith(("_", "subscribe_", "selfsubscribe_"))}
        parameters = {**(payload if topic is not None else {}), **declared}
        reason = change.level if change is not None else topic if topic is not None else "start"
        context = {"_node": change.node if change is not None else None,
                   "_reason": reason, "_triggerpars": {"kw": change, "trigger_reason": reason}}
        if topic is not None:
            context["_subscription_kwargs"] = payload
            context["_subscription_metadata"] = {} if metadata is None else dict(metadata)
        parameters.update((name, context[name]) for name in context_names if name in context)
        result = function(node, **parameters) if node.node_tag == "dataController" else function(**parameters)
        if isawaitable(result):
            if iscoroutine(result):
                result.close()
            raise TypeError("Asynchronous PageStore execution is outside this PoC")
        if node.node_tag == "dataFormula" and not self.closed:
            self.builder.data.set_item(node.abs_datapath(node.attr["result_path"]), result)

    def receive(self, node, pathlist, evt, reason=None, oldvalue=None, attrs_diff=None, fired=False, ind=None, **kwargs):
        if self.closed or reason == "autocreate":
            return
        pathlist = [] if pathlist is None else pathlist
        for item in node if isinstance(node, list) else [node]:
            path = ".".join([*pathlist, item.label] if evt in ("ins", "del") else pathlist)
            frozen = from_tytx(to_tytx(dict(oldvalue=oldvalue, attrs_diff=attrs_diff,
                                          value=item.value, attr=dict(item.attr))))
            self.changes.append(DataChange(item, path, evt, reason, fired, index=ind, **frozen))
        if self.dispatching:
            return
        self.dispatching = True
        try:
            while self.changes and not self.closed:
                change = self.changes.popleft()
                for provider in tuple(self.providers):
                    for registration in provider[3]:
                        level = trigger_level(registration.path, change.path)
                        if level is None or not accepts(registration, change, level):
                            continue
                        if provider[0].attr.get("_userChanges") and level != "node":
                            continue
                        self.execute(provider, replace(change, level=level, registration=registration))
        except BaseException:
            self.changes.clear()
            raise
        finally:
            self.dispatching = False

    def close(self):
        if self.closed:
            return
        self.closed = True
        self.builder.data.unsubscribe(self.subscriber_id, any=True)
        self.providers.clear()
        self.topics.clear()
        self.changes.clear()

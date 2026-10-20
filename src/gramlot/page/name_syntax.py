"""The syntax of a method name, declared by the server; symmetric with ``js/src/builder/name-syntax.js``."""

import re
from dataclasses import dataclass

from genro_builders import CustomTypes
from genro_builders.builder import Regex


@dataclass(frozen=True)
class NameSyntax(Regex):
    """The syntax of a method name of ``remote``, ``dataRpc``, ``dataRemote`` and ``remoteSource``, declared by
    the server (``GramlotServer.name_syntax``) and carried to the browser by the bootstrap (GC-230 §010).

    A genro-builders ``Regex`` matched whole. It is loaded as genro-builders loads the regex of a grammar
    (``CustomTypes.from_dict``): a construct that Python and JavaScript do not read the same way (``\\w``,
    ``(?P<…>)``, an inline flag such as ``(?i)``, the flag ``IGNORECASE``…) raises ``ValueError``. The
    JavaScript counterpart is ``NameSyntax`` of ``js/src/builder/name-syntax.js``.
    """

    def __post_init__(self):
        CustomTypes.from_dict({"name_syntax": {"kind": "annotated",
                                               "base": {"kind": "type", "module": "builtins", "name": "str"},
                                               "metadata": [self.to_dict()]}})

    @classmethod
    def from_dict(cls, descriptor):
        """The syntax of the descriptor ``{"kind": "regex", "pattern", "flags"}``; another descriptor raises
        ``ValueError``."""
        if not isinstance(descriptor, dict) or set(descriptor) != {"kind", "pattern", "flags"} \
                or descriptor["kind"] != "regex":
            raise ValueError(f"A name syntax is {{'kind': 'regex', 'pattern', 'flags'}}, not {descriptor!r}")
        return cls(descriptor["pattern"], descriptor["flags"])

    def to_dict(self):
        """The descriptor ``{"kind": "regex", "pattern", "flags"}`` of genro-builders (``Regex`` exported in a
        grammar), as the bootstrap carries it."""
        return {"kind": "regex", "pattern": self.pattern, "flags": int(self.flags)}

    def matches(self, name):
        """Whether ``name`` is a string the syntax matches whole."""
        return isinstance(name, str) and re.fullmatch(self.pattern, name, self.flags) is not None


# The core default syntax: the method of the page, or a path of public attributes from the page ending in the
# method, ``a.b.c.method``. Each segment is an ASCII letter followed by ASCII letters, digits and ``_``.
NAME_SYNTAX = NameSyntax(r"[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*")

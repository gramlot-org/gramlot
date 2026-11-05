from gramlot import GramlotCollection
from gramlot.collections.inputs import mygramlot as _dependency_0

mygramlot = GramlotCollection(
    name="grid",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(_dependency_0,),
    build_id="sha256:518ee2f456abd7db76a94accf4764079371504d6809336e3ef3cf62d8aa895d2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

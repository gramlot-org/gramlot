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
    build_id="sha256:d10c0e2d1231c2ff3069b996016cc43b6046694a16e8eb9ab0f1001c569f4669",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

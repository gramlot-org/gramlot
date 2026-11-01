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
    build_id="sha256:90a27e8f8ed57887566ec10f684c5f5098dd151f7104e4c0659da6596b4ef297",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

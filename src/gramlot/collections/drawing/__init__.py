from gramlot import GramlotCollection
from gramlot.collections.inputs import mygramlot as _dependency_0
from gramlot.collections.layout import mygramlot as _dependency_1

mygramlot = GramlotCollection(
    name="drawing",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(_dependency_0, _dependency_1,),
    build_id="sha256:5627060ca357155f444bc93bbd1a07ca8889567382ef9660140f5854b9b53f4d",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

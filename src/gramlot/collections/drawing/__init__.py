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
    build_id="sha256:1fd322e086a667642e1e417fc980105a4c7a5e9eb6d37ef04e29ffa2195a6457",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

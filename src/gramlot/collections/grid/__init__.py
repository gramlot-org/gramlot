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
    build_id="sha256:3de0ddab1f62451b2c2624520ef8f406e3f58fa613751397b29d1d8467ff4dd2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

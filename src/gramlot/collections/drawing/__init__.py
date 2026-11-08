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
    build_id="sha256:332308615520a6281f52b29a167299a44b0b4a7bf9761fa75713f46817b27c06",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

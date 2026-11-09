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
    build_id="sha256:b414da83eec9e508cebf5e1c7348b953aec39e8130b99cc30388fa2cb9892896",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

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
    build_id="sha256:cd7e1c52ccfcea4c70cc878ff3eda2d25c88c95fdc940e681733730e6a92aea1",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

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
    build_id="sha256:dff281ba3d044b3fcb3c7e8510208734eb1943ffe2c1fb93d027b753b889bed2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

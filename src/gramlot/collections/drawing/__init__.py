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
    build_id="sha256:2b4f81df2746f039781d7d13f7ba157ccb50c803eabcc97ce1ffafad227b2af9",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

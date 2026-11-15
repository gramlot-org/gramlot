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
    build_id="sha256:bb27a112e5896ee045c1d78ad78638d5c03a63e56a6722742ec81481e875d9a8",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

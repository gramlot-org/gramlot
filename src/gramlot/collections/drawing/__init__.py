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
    build_id="sha256:a470a94a8b9135cfef130d1d911dc65418b93be0891292f9602fd9033e3e6fc2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

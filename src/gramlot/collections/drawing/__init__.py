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
    build_id="sha256:0cec926fc95ed6c725e0a7e567f58862c08ad8b65a56db947c1c26f769a08a57",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

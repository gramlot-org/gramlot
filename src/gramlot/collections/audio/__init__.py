from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="audio",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:5f56d42ec370d10c857bdaa7745be4d72e84187630bff5e2a07299055ab5e5cc",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

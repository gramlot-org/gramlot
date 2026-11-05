from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="audio",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:e8ccb6686763b2d3b172b66cbeede57b88a00bdf45f302511cc54f20b942fd79",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

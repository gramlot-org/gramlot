from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:7384bad6651a5b08ed3a6401fecc201dd99f641d0fafc0400179b62edd913fe6",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

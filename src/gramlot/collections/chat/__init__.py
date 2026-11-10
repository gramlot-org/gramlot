from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:4b6d67de76fe837ceee961f8817b18c7c0545b6c8d5b74986c1d8664c691f593",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="audio",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:8908acc8ecf0842588c6cbc560f029b3f952022abd1eb8be53cfef6ce6f44133",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

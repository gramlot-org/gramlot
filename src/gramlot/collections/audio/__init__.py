from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="audio",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:03b7892d80ffd33cbb7a3eaeedbefc06851a78f09e5b1b9dbca0dd05f3762885",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

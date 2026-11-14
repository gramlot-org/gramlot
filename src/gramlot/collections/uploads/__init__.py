from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:d9ecfc773d75894fca984dc8c0308769f7063a33f2225c88624b55d9d8300076",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

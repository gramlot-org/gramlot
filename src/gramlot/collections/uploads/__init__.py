from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:2fbdcfd35f255ab8a50c3c829e1f20a9ca108b044dcf5da6536faeaddc507412",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

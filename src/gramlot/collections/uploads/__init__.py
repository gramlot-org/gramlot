from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:713c837016d47c74e514f8121ddc5727939530dbbf644c4f26e73f14e25d5001",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

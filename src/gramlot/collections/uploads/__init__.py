from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:d8e543705cb592764e05e179474b0b3a7bd409c20d5728a06409723447fc6ab3",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

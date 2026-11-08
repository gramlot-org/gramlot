from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:4edb3905f4f845ddf2ce12a27bdade2eb088e1f119920010f8e86911a562c8b2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:0c2fbe80692f0b6327c89fc4cda2eaa55edfebbb5d810ec821ecb30b8885b1e5",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

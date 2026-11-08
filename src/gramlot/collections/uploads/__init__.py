from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:733e6b60ba678a2d079468b29514ea1719bc129f490aebffe9a65b31bbb5e9d2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

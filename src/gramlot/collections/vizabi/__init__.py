from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:3d479c8826dcaa60c4293e4ca5c6c7251cd91051a2e665cc9537f2c605a77a4d",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:2aa77955b4ceca3b47c2bea3a14c229c48d3ee16c07de369c60cdf3885262634",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

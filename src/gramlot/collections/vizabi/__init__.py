from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:cce3cdc1945dcd2713fef6ee20799c04abac18abed2217680d3fe821cc620d8e",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:981775460d1201f63f9a484cf3f1e35b5013023e942b7860eb87a200bf209f69",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

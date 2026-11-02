from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:11baa38f7458e4fe7afc0d299fd32c77ba0080007c843f08517d1a2635a1e050",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

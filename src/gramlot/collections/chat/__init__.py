from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:93e59d51e85c752c97262ad9444871d1a6c8efe77ef60b15e454d04e51fa24b2",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

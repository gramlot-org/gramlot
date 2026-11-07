from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:ded35a18fb7aa8eb0322bbbc7e28fcf789c11a3e5148fc1d3f8dc1a6f32c6d0b",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

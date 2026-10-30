from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="grid",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:7824f0f443adc9404967659de7aa6241f720a099d674d8f7d586912dddfe48b0",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

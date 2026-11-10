from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:8818b54b5762dcd91a115e31ce7b34c3745450f32974590a9c31506f69ec1768",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

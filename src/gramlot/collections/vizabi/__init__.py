from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="vizabi",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:f58b08f79cbd299caaefaf01f1a75ad7207c703a90f62aa11510c8612f32559d",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

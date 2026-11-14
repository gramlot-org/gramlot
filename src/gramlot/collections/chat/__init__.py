from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:ea80b65f9d0c15019a9362e4dabc1aba54e10ce2271716d5fc95839ed142d1e0",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

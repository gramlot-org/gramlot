from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:5e0b1291248f1696acf7eabcf1bd9c3689ce266f300b872b31940291ce841a9b",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

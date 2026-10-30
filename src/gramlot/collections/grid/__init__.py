from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="grid",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:25a92f7949a37998d1438bff44bba8164a8c36554f388a521f2e1043c6938da3",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

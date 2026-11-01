from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:72cabfa17ed3ef64a29380770fabde1fd23b6736f1bdd9be5d5f1781779e9641",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

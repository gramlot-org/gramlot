from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="chat",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:9a6a60684b36c8c2a310711043c6df4331890fd73f83bc32d9db4057516ce168",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

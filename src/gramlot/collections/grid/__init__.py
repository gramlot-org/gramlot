from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="grid",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:d8e8029b54af9809b398635cff89c97ea09ec2dd4b2b346d7a7cd97db48201f0",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

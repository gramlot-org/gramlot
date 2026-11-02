from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:4eaaa83312ae3d906f36abdedba211197bea33d1f18d9e98405daabef13ad21d",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

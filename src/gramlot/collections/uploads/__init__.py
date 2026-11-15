from gramlot import GramlotCollection

mygramlot = GramlotCollection(
    name="uploads",
    package=__package__,
    grammar="grammar.json",
    commands="commands.json",
    module="assets/index.js",
    css=(),
    dependencies=(),
    build_id="sha256:0adc07087b0ce4fbff9b072214a47a964fec7755c893d779cea37ad02828ce25",
    files=("assets/collection.js", "assets/index.js", "commands.json", "grammar.json",),
)

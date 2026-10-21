"""Authoring specimen for the experimental GC-197 tree rowActions contract.

This is a qualification input for the planned tree port, not a runnable page.
The public tree/rowActions collection and row command context are not implemented.
The caller will supply a Gramlot pane and a Data Bag at ``.nodes``.
Controller methods editTreeItem/duplicateTreeItem will receive item/path/event.
"""


def declare_tree_row_actions(pane):
    tree = pane.tree(storepath=".nodes")
    actions = tree.rowActions(position="end")

    actions.button(
        icon="✎", title="Edit"
    ).dataController(func="editTreeItem")

    actions.button(
        icon="↗",
        title="Open",
        action="this.publish('openItem', {item, path})",
    )

    menu = actions.dropDownButton(
        icon="⋯", title="More actions"
    ).menu()
    menu.menuline(
        "Duplicate", code="duplicate"
    ).dataController(func="duplicateTreeItem")

    return tree

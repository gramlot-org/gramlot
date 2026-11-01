"""Source composition for a lazily loaded hierarchical store."""

from genro_bag import Bag


def tree_store(parent, *, datapath, method, params=None, tree_attributes=None, **attributes):
    """Mount a tree backed by one endpoint; the page Logic supplies TreeStoreLogic."""
    pane = parent.div(datapath=datapath, **attributes)
    pane.dataSetter('.store', Bag())
    pane.dataController(func='treeStoreMount', storeMethod=method,
                        storeParams={} if params is None else params, _onBuilt=True)
    pane.tree(storepath='.store', **({'hideValues': True} | (tree_attributes or {})))
    return pane

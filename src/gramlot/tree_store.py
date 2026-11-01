"""Transport descriptions for lazy branches of a generic tree store."""

from genro_bag.resolver import BagResolver


class TreeStoreResolver(BagResolver):
    """Describe a branch; its owning browser store supplies the loader."""

    class_kwargs = {**BagResolver.class_kwargs, "cache_time": -1}

    def load(self):
        raise RuntimeError("TreeStoreResolver must be bound to a browser TreeStore")

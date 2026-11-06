"""Shipped resources for loopback-only core qualification hosts."""
from gramlot.collection import standard_collections

_COLLECTIONS = standard_collections()


def fixture_collection_resource(path):
    for collection in _COLLECTIONS:
        prefix = f"/gramlot/collections/{collection.name}/{collection.build_id[7:]}/"
        if path.startswith(prefix):
            relative = path[len(prefix):]
            if relative.startswith("assets/") and relative in collection.files:
                return collection.resource(relative).read_bytes()
    return None

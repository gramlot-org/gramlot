"""Backend-independent selector endpoint."""

from gramlot.page.base import endpoint


class DatabaseSelectors:
    """Compose with Page and configure ``database`` with a selector provider."""

    @endpoint
    def dbSelect(self, **parameters):
        if "where" in parameters:
            raise ValueError("SQL predicates belong in a dedicated server endpoint")
        return self.database.select(**parameters)

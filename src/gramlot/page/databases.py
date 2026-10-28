"""Backend-neutral access to the databases supplied by the hosting adapter."""


class _PageDatabases:
    _database_access = None

    def db(self, name=None):
        """The host database for this synchronous operation, optionally by name."""
        if self._database_access is None:
            raise RuntimeError("This page host does not provide database access")
        return self._database_access.db(name)

    def async_db(self, name=None):
        """The host's async view of the database for this operation."""
        if self._database_access is None:
            raise RuntimeError("This page host does not provide database access")
        return self._database_access.async_db(name)

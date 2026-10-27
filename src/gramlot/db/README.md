# Database contracts

`DatabaseSelectors` is a Page mixin exposing the default `dbSelect` data endpoint.
Set `database` to an explicitly configured provider with `select(**parameters)`.
The core neither imports a SQL library nor owns a connection or a database model.

The request/result and widget contracts are documented in GC-315 section 050.
Dedicated Page endpoints use `method` and return the same result shape. SQLAlchemy
and the SQLite gallery belong to gramlot-py-server, not this package.

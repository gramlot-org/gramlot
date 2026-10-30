# 396 · Database-managed permissions: discussion basis

Document ID: **GC-396**. Date: **2026-10-30**.

[Concise counterpart](../../docs_llm/future/396-database-managed-permissions.md).
[Related query-definition discussion: GC-395](395-data-selection-and-db-query.md).

**Status: exploration, not an adopted architecture.** The owner asks to examine
“strada 3”: creating database users with their permissions and executing queries
as the actual user instead of one unrestricted application account. This document
does not authorize role creation, migrations, dependency changes or deployment.
PostgreSQL 18 is the concrete reference, not a promise of database portability.

<a id="gc-396-005"></a>
## 005 · Problem and intended benefit

A TableHandler-style grid lets users add model fields, follow relations and
change queries. Fixing every projection to the initial page declaration would
remove that capability. Conversely, browser-supplied table and field names cannot
be treated as proof of authorization.

The hypothesis is to enforce data access in the database itself. The application
still authenticates the user, supplies a controlled query interface and manages
resources; database privileges constrain the query's actual execution identity.
This can complement the protected PageStore query definitions discussed in
GC-395. It is not a replacement for their ownership and mutation rules.

The target scenario is an employee choosing additional customer columns while
being unable to read restricted financial fields or another tenant's customers.
The configurator should explain what is available instead of relying on repeated
permission-error responses as its normal user experience.

<a id="gc-396-010"></a>
## 010 · What the database can express

PostgreSQL grants can restrict operations on tables and individual columns.
A role with broad table-level SELECT is not restricted merely by withholding a
column-specific grant. Group roles can organize shared permissions; role
membership has distinct inheritance and role-switching options.
[Privileges](https://www.postgresql.org/docs/18/ddl-priv.html),
[role membership](https://www.postgresql.org/docs/18/role-membership.html).

Row-Level Security (RLS) constrains visible or writable rows. It must be enabled;
with RLS enabled and no applicable policy, access to rows is denied. Superusers
and BYPASSRLS roles bypass these checks; table owners normally do too, unless
FORCE ROW LEVEL SECURITY applies. Multiple policies can combine permissively or
restrictively, so adding a policy does not necessarily narrow access.
[Row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html).

Views and functions require separate review. In particular, view access does not
automatically mean underlying tables are checked as the caller: PostgreSQL's
security_invoker view option requests caller-based privilege checks. Definer
functions can deliberately cross privilege boundaries and must be treated as
explicit capabilities, not ordinary unrestricted query helpers.
[Views and their security behavior](https://www.postgresql.org/docs/18/sql-createview.html).

<a id="gc-396-015"></a>
## 015 · Two execution-identity alternatives

| Aspect | A: authenticate the connection as the user | B: service connection assumes a user role |
| --- | --- | --- |
| Connection identity | Individual database login | Shared service login |
| Query identity | User's database role | Explicitly selected role |
| Application trust | Correct login association and credential handling | Correct association plus permission to switch roles |
| Connection reuse | Partitioned by authenticated database identity | Shared pool, with disciplined transaction scope |
| Main operational cost | Identity provisioning, authentication and connection distribution | Role-switch lifecycle and protection of the privileged service identity |

Alternative A does not require a new connection for every request. It requires
that reuse preserves authenticated identity; a connection authenticated for one
user must not silently serve another. The authentication/credential mechanism is
an open design choice. Database credentials never belong in browser Source/Data.

Alternative B can use transaction-scoped role selection:

```sql
-- Illustration only: no connection setup or grants are implied.
BEGIN;
SET LOCAL ROLE application_user_role;
-- Execute the controlled selection here.
COMMIT;
```

PostgreSQL checks subsequent commands with the selected role's privileges;
the login must be permitted to assume that role. LOCAL scope ends with the
transaction, including rollback. Role selection must come from authenticated
server context, never a client-provided role name.
[SET ROLE](https://www.postgresql.org/docs/18/sql-set-role.html),
[transaction-local settings](https://www.postgresql.org/docs/18/sql-set.html).

**B is not equivalent to A's isolation.** The service login retains its ability
to assume other granted roles. Arbitrary SQL execution under that connection
could undo or change a role selection. A constrained query interface and secure
server implementation remain essential; SET LOCAL is a lifecycle mechanism,
not protection against arbitrary command execution by the service account.

<a id="gc-396-020"></a>
## 020 · Users, groups and tenant identity

Decide separately whether database principals represent individual people,
application roles, tenants, or a combination. One role for all sales staff does
not by itself identify which salesperson owns a row.

Individual principals can inherit shared grants; this avoids maintaining every
permission independently for every person. Provisioning, suspension, deletion,
role changes and application-login association still need an owner and lifecycle.

An alternative is RLS driven by server-established transaction context. That
remains a separate hypothesis: a tenant/user value that the same execution role
can freely forge is not an independent security boundary. Its trust model must
be documented before adopting it.

Keep migration/ownership accounts separate from ordinary query identities.
Also consider scheduled jobs and administrative actions: they need explicit
identities rather than accidental reuse of an interactive user's connection.

<a id="gc-396-025"></a>
## 025 · Connection to dbQuery and dataSelection

Proposed execution chain, not a new approved API:

1. Authenticate the application request and locate its page-owned query.
2. Resolve the server-owned database execution identity.
3. Acquire the correct connection and establish its transaction context.
4. Translate the accepted query definition and bind permitted runtime values.
5. Execute under database permissions; return typed rows and metadata.
6. End the transaction and safely release the connection on success or failure.

Query-definition controls and database checks have different lifetimes.
GC-395 proposes validating structural changes only when dbQuery changes; the
database still enforces its own permissions when SQL is executed. An approved
definition cannot grant a privilege the execution identity lacks.

For configurable grids, the framework should expose permitted model metadata,
including relevant relation paths. This catalog is guidance for authoring, not
a substitute for execution enforcement. A metadata cache needs an invalidation
policy when permissions change.

This design could be supplied by the application framework and database adapter.
It must not put users, grants or PostgreSQL-specific policy code into Gramlot's
GUI core. The generic `dataSelection(method=...)` path remains usable.

<a id="gc-396-030"></a>
## 030 · Cached selections and permission changes

Database enforcement protects the query that reads the original tables. It does
not automatically protect copies returned later from an application Bag, cached
selection, generated file or materialized cache table.

Before combining this approach with cachedFetch, decide:

- Cache ownership: user, tenant, page and applicable authorization context.
- How reads of cached windows, sorting, totals and exports enforce that ownership.
- Whether a permission change invalidates cached results, triggers re-query, or
  follows an explicitly bounded expiration policy.
- How disconnects, crashes and page closure release cached resources.

Filtering a previously privileged result in the browser is not authorization.
Revocation also cannot retract data already delivered to a browser; its promised
effect must concern future reads and retained server-side copies.

<a id="gc-396-035"></a>
## 035 · Benefits, costs and limits

| Benefit | Cost or boundary to verify |
| --- | --- |
| Enforcement close to stored data | Policies must be maintained with schema changes |
| Dynamic field selection within grants | Model metadata and computed/relation fields need permission-aware handling |
| Reusable policy across application entry points | Every entry point must use the intended execution identity |
| Clear role for database administrators | Provisioning and application identity synchronization become product features |
| Defense against missing application row filters | Owners, elevated roles, views and functions can alter the effective boundary |

Read authorization does not bound query cost or make every executable function
appropriate for a read endpoint. Limits, cancellation and the supported query
language remain service concerns. Performance effects of RLS, connection reuse
and configurable joins require measurements on the actual workload.

<a id="gc-396-040"></a>
## 040 · A bounded experiment, if approved

Use a disposable database, two users and two tenant populations, with one public
customer field and one restricted field. Compare alternatives A and B using the
same resident selection; add a cached selection only after direct reads work.

Required observations:

| Test | Expected property |
| --- | --- |
| Add an authorized field through configuration | Query succeeds without a page-specific endpoint |
| Request a forbidden field, including through sorting/filtering | No forbidden data or predicate access |
| Remove the UI tenant filter | Database policy still prevents cross-tenant rows |
| Traverse a relation or access a view | Intended identity and restrictions remain effective |
| Alternate users on reused connections, including errors/cancellation | No role or context leakage |
| Read another page/user's cached selection | Access rejected |
| Revoke permission after query definition/cache creation | Behavior matches an explicit revocation policy |

Record execution identity as well as application identity for diagnosis; avoid
logging credentials or unnecessary row contents. No production rollout or claim
of security completeness follows from passing this small experiment.

<a id="gc-396-045"></a>
## 045 · Discussion order and current decision state

All choices below are open:

1. Intended deployment: controlled business application or public multi-tenant service?
2. Identity granularity: individual user, group, tenant, or combined roles?
3. Execution: real database login (A) or trusted service role switching (B)?
4. Policy owner: database migrations, application framework, administrator tooling?
5. Configurator metadata, permission changes and cached-selection lifetime?
6. Required adapter/Asqueel capabilities, then a separately approved experiment?

The document preserves an option, not a decision to replace application-layer
authorization. Continue comparing it with GC-395 before implementation.

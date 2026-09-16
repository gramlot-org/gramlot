# Port protocol

A port is the smallest reviewable transfer from the living
[`gramlot-poc`](https://github.com/gramlot-org/gramlot-poc) laboratory into the
authoritative Gramlot product. In sibling local checkouts, evidence may be referenced
through `../gramlot-poc`; committed records should also include stable repository
paths and revisions.

## 1. Identifier and record

Use `PORT-NNNN-short-name`. Keep one record under `ports/<port-id>/README.md`, based
on [the template](TEMPLATE.md). Use the same ID for PoC preparation, destination
review, revisions and acceptance.

## 2. PoC preparation

The proposed port records evidence and exact revisions, bounded scope, proposed
contract and ownership, files offered, meaningful tests, known differences,
omissions, provisional dependencies and open questions. Working behavior in the PoC
does not establish destination acceptance.

## 3. Destination review

The Gramlot reviewer checks the port against the
[constitution](../docs/00-constitution.md), current architecture, behavior and test
evidence. Record one result: `revision-requested`, `accepted` or `rejected`, with
concrete reasons. Acceptance covers only the stated scope.

Review feedback remains in the port record. Mark lessons that should change later
PoC preparations so the two contexts improve together.

## 4. Constitutional conflicts

A port cannot amend the constitution automatically. When it conflicts, cite the
principle and set the port to `blocked-owner-decision`. Resume only after the owner
adapts the scope or records an explicit amendment in both constitution documents.

## 5. Completion

An accepted port has aligned contract, code, meaningful tests and paired human/LLM
documentation. The destination records the accepted revision and remaining omissions.
Publication, release and consumer migration are separate actions.

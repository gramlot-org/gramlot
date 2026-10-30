"""Local selection-transfer experiment; not a public RPC wire contract."""
from dataclasses import dataclass
from collections.abc import Iterable
from time import perf_counter

from genro_tytx import to_tytx_iter, json_dumps
from .gramlot_server import _parse_request, InvalidRequest


@dataclass
class SelectionTrialRows:
    records: Iterable[dict]
    requested: int
    query_ms: float


async def prepare_selection_trial(server, text, *, owner, identity):
    """Use the ordinary endpoint dispatch/ownership checks before opening a stream."""
    request = _parse_request(text)
    if request['contentType'] != 'data':
        raise InvalidRequest('Selection trials require a data endpoint')
    result = await server._run(request, owner, identity)
    if not isinstance(result, SelectionTrialRows):
        raise InvalidRequest('Endpoint did not return SelectionTrialRows')
    return request['id'], result


def selection_trial_lines(request_id, result):
    """One typed record per JSON line, followed by a mandatory completion receipt."""
    count = 0
    encode_ms = 0.0
    yield json_dumps({'kind': 'start', 'id': request_id}) + b'\n'
    try:
        iterator = iter(to_tytx_iter(result.records))
        while True:
            started = perf_counter()
            try:
                record = next(iterator)
            except StopIteration:
                break
            line = json_dumps({'kind': 'row', 'record': record}) + b'\n'
            encode_ms += (perf_counter() - started) * 1000
            count += 1
            yield line
        yield json_dumps({'kind': 'end', 'id': request_id, 'count': count,
                          'requested': result.requested, 'query_ms': result.query_ms,
                          'encode_ms': encode_ms}) + b'\n'
    except Exception:
        # A partial selection never becomes successful; no implementation details on the wire.
        yield json_dumps({'kind': 'error', 'id': request_id,
                          'message': 'Selection stream failed'}) + b'\n'

/**
 * The random id of the browser runtime.
 *
 * @module
 */

/**
 * 16 random bytes as 32 lowercase hex characters, the format of the Python `uuid4().hex` ids of the server.
 * `getRandomValues`, unlike `randomUUID`, exists outside secure contexts too.
 */
export function randomId() {
    return Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),
        byte => byte.toString(16).padStart(2, '0')).join('');
}

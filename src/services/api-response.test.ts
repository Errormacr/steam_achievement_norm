import assert from 'node:assert/strict';
import {
  extractErrorMessage,
  parseResponseBody,
  parseSuccessResponse
} from './api-response';

async function run() {
  const jsonResponse = new Response(JSON.stringify({ ok: true, value: 42 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  const textResponse = new Response('updated', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
  const emptyResponse = new Response(null, { status: 204 });

  assert.deepEqual(await parseResponseBody(jsonResponse.clone()), { ok: true, value: 42 });
  assert.equal(await parseResponseBody(textResponse.clone()), 'updated');
  assert.equal(await parseSuccessResponse<null>(emptyResponse), null);
  assert.equal(await parseSuccessResponse<string>(textResponse.clone()), 'updated');
  assert.equal(
    extractErrorMessage({ message: ['first', 'second'] }, new Response(null, { status: 400 })),
    'first, second'
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

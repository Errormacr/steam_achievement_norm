export async function parseResponseBody(response: Pick<Response, 'text'>) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

export function extractErrorMessage(
  body: unknown,
  response: Pick<Response, 'status' | 'statusText'>
) {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = body.message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }

  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

export async function parseSuccessResponse<T>(
  response: Pick<Response, 'text' | 'status'>
): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  return await parseResponseBody(response) as T;
}

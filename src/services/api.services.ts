import { toast } from 'react-toastify';
import { logger } from '../utils/logger';

const API_URL = 'http://localhost:8888/api';

async function parseResponseBody (response: Response) {
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

function extractErrorMessage (body: unknown, response: Response) {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = body.message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }

  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

async function handleErrorResponse (response: Response): Promise<never> {
  const body = await parseResponseBody(response);
  const message = extractErrorMessage(body, response);

  toast.error(message);
  logger.error(`API request failed: ${response.status} ${response.statusText}`, body);
  throw new Error(`API Error: ${response.status} - ${message}`);
}

export class ApiService {
  static async get<T> (endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json() as T;
      }
      return await handleErrorResponse(response);
    } catch (error) {
      logger.error('Error fetching data from API', error);
      throw error;
    }
  }

  static async post<T> (endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        return await response.json() as T;
      }
      return await handleErrorResponse(response);
    } catch (error) {
      logger.error('Error posting data to API', error);
      throw error;
    }
  }

  static async put<T> (endpoint: string, data: unknown = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return await response.json() as T;
      }
      return await handleErrorResponse(response);
    } catch (error) {
      logger.error('Error updating data in API', error);
      throw error;
    }
  }

  // DELETE request
  static async delete<T> (endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json() as T;
      }
      return await handleErrorResponse(response);
    } catch (error) {
      logger.error('Error deleting data from API', error);
      throw error;
    }
  }
}

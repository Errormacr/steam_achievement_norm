import { toast } from 'react-toastify';
import { logger } from '../utils/logger';
import {
  extractErrorMessage,
  parseResponseBody,
  parseSuccessResponse
} from './api-response';

const API_URL = 'http://localhost:8888/api';

async function handleErrorResponse (response: Response): Promise<never> {
  const body = await parseResponseBody(response);
  const message = extractErrorMessage(body, response);

  toast.error(message);
  logger.error(`API request failed: ${response.status} ${response.statusText}`, body);
  throw new Error(`API Error: ${response.status} - ${message}`);
}

type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  data?: unknown;
  method: HttpMethod;
}

async function request<T> (endpoint: string, options: RequestOptions): Promise<T> {
  const { data, method } = options;

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data === undefined ? undefined : JSON.stringify(data)
    });

    if (response.ok) {
      return await parseSuccessResponse<T>(response);
    }

    return await handleErrorResponse(response);
  } catch (error) {
    logger.error(`Error during ${method} request to API`, error);
    throw error;
  }
}

export class ApiService {
  static async get<T> (endpoint: string): Promise<T> {
    return await request<T>(endpoint, { method: 'GET' });
  }

  static async post<T> (endpoint: string, data: unknown): Promise<T> {
    return await request<T>(endpoint, { method: 'POST', data });
  }

  static async put<T> (endpoint: string, data: unknown = {}): Promise<T> {
    return await request<T>(endpoint, { method: 'PUT', data });
  }

  // DELETE request
  static async delete<T> (endpoint: string): Promise<T> {
    return await request<T>(endpoint, { method: 'DELETE' });
  }
}

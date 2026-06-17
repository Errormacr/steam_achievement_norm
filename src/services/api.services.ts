import { toast } from 'react-toastify';
import { logger } from '../utils/logger';
import { CACHE_TTL_MS } from '../utils/constants';
import {
  extractErrorMessage,
  parseResponseBody,
  parseSuccessResponse
} from './api-response';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

const responseCache = new Map<string, { data: unknown; timestamp: number }>();

type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  data?: unknown;
  method: HttpMethod;
}

async function handleErrorResponse<T>(endpoint: string, error: unknown, method: HttpMethod): Promise<T> {
  const cached = responseCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logger.warn(`API ${method} ${endpoint} failed, returning cached data`);
    toast.info('Показаны кэшированные данные (ошибка сети)');
    return cached.data as T;
  }

  logger.error(`Error during ${method} request to ${endpoint}`, error);
  toast.error('Ошибка соединения с сервером. Попробуйте позже.');
  throw error;
}

async function request<T> (endpoint: string, options: RequestOptions): Promise<T> {
  const { data, method } = options;
  const cacheKey = `${method}:${endpoint}`;

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data === undefined ? undefined : JSON.stringify(data)
    });

    if (response.ok) {
      const result = await parseSuccessResponse<T>(response);
      responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }

    const body = await parseResponseBody(response);
    const message = extractErrorMessage(body, response);
    logger.error(`API request failed: ${response.status} ${response.statusText}`, body);
    toast.error(message);
    throw new Error(`API Error: ${response.status} - ${message}`);
  } catch (error) {
    return handleErrorResponse<T>(cacheKey, error, method);
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

  static async delete<T> (endpoint: string): Promise<T> {
    return await request<T>(endpoint, { method: 'DELETE' });
  }
}

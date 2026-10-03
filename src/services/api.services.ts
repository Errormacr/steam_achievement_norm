import { toast } from 'react-toastify';
import { logger } from '../utils/logger';
import { CACHE_TTL_MS } from '../utils/constants';
import {
  extractErrorMessage,
  parseResponseBody,
  parseSuccessResponse
} from './api-response';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();

type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  data?: unknown;
  method: HttpMethod;
}

/**
 * Raised for non-2xx responses. Distinguished from network failures so an HTTP
 * 4xx/5xx is never silently replaced with stale cached data.
 */
class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function readCache<T>(cacheKey: string): T | undefined {
  const cached = responseCache.get(cacheKey);
  if (!cached) return undefined;

  if (Date.now() - cached.timestamp >= CACHE_TTL_MS) {
    responseCache.delete(cacheKey);
    return undefined;
  }

  return cached.data as T;
}

/**
 * Drop cached GET responses whose endpoint shares the mutated resource prefix,
 * so the next read reflects the write that just succeeded.
 */
function invalidateCache(endpoint: string) {
  const segments = endpoint.split('?')[0].split('/').filter(Boolean);
  if (segments.length === 0) return;

  // e.g. user/123/game/456/add-not-shown -> user/123/game/456
  const resourcePrefix = segments.slice(0, Math.max(segments.length - 1, 1)).join('/');

  for (const key of responseCache.keys()) {
    const [method, cachedEndpoint] = key.split(':');
    if (method !== 'GET') continue;

    const cachedPath = cachedEndpoint.split('?')[0];
    if (cachedPath === resourcePrefix || cachedPath.startsWith(`${resourcePrefix}/`)) {
      responseCache.delete(key);
    }
  }
}

function isCacheable(method: HttpMethod): boolean {
  return method === 'GET';
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

    if (!response.ok) {
      const body = await parseResponseBody(response);
      const message = extractErrorMessage(body, response);
      logger.error(`API request failed: ${response.status} ${response.statusText}`, body);
      // Surface the server error once and let it propagate untouched; falling
      // back to cache here would mask a real failure as stale-but-valid data.
      toast.error(message);
      throw new ApiError(message, response.status);
    }

    const result = await parseSuccessResponse<T>(response);

    if (isCacheable(method)) {
      responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
    } else {
      invalidateCache(endpoint);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Genuine transport failure (server down, DNS, abort).
    const cached = isCacheable(method) ? readCache<T>(cacheKey) : undefined;
    if (cached !== undefined) {
      logger.warn(`API ${method} ${endpoint} failed, returning cached data`);
      toast.info('Показаны кэшированные данные (ошибка сети)');
      return cached;
    }

    logger.error(`Network error during ${method} request to ${endpoint}`, error);
    toast.error('Ошибка соединения с сервером. Попробуйте позже.');
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

  static async delete<T> (endpoint: string): Promise<T> {
    return await request<T>(endpoint, { method: 'DELETE' });
  }
}

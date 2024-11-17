import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8888/api';

export class ApiService {
  static async get<T> (endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data: T = await response.json();
      if (!response.ok) {
        toast.error(`${data.message}`);
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching data from API:', error);
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
      const result: T = await response.json();
      if (!response.ok) {
        toast.error(`${result.message}`);
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      return result;
    } catch (error) {
      console.error('Error posting data to API:', error);
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

      const result: T = await response.json();
      if (!response.ok) {
        toast.error(`${result.message}`);
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      return result;
    } catch (error) {
      console.error('Error updating data in API:', error);
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
      const result: T = await response.json();
      if (!response.ok) {
        toast.error(`${result.message}`);
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      return result;
    } catch (error) {
      console.error('Error deleting data from API:', error);
      throw error;
    }
  }
}

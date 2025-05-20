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
      if (response.ok) {
        return await response.json();
      }
      const data = await response.json();
      toast.error(`${data.message}`);
      console.error(`Error fetching data from API: Failed to update: ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${data.message}`);
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
      if (response.ok) {
        return await response.json();
      }
      const result = await response.json();
      toast.error(`${result.message}`);
      console.error(`Error fetching data from API: Failed to update: ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${result.message}`);
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

      if (response.ok) {
        return await response.json();
      }
      const result = await response.json();
      toast.error(`${result.message}`);
      console.error(`Error fetching data from API: Failed to update: ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${result.message}`);
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
      if (response.ok) {
        return await response.json();
      }
      const result = await response.json();
      toast.error(`${result.message}`);
      console.error(`Error fetching data from API: Failed to update: ${response.statusText}`);
      throw new Error(`API Error: ${response.status} - ${result.message}`);
    } catch (error) {
      console.error('Error deleting data from API:', error);
      throw error;
    }
  }
}

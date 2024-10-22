
const API_URL = 'http://localhost:8888/api';

export class ApiService {
  // GET request
  static async get<T> (endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
  }

  // POST request
  static async post<T> (endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to post: ${response.statusText}`);
      }
      const result: T = await response.json();
      return result;
    } catch (error) {
      console.error('Error posting data to API:', error);
      throw error;
    }
  }

  // PUT request
  static async put<T> (endpoint: string, data: any = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }
      const result: T = await response.json();
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
      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }
      const result: T = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting data from API:', error);
      throw error;
    }
  }
}

export interface Bill {
  id: string;
  description: string;
  value: number;
  category: string;
  date: string;
}

const API_BASE_URL = '/api';

export const api = {
  async getBills(): Promise<Bill[]> {
    const response = await fetch(`${API_BASE_URL}/bills`);
    if (!response.ok) throw new Error('Failed to fetch bills');
    return response.json();
  },

  async importCSV(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/bills/import`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to import CSV');
    }
  }
};

export interface Tag {
  id: string;
  name: string;
}

export interface Bill {
  id: string;
  description: string;
  value: number;
  category: string;
  date: string;
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Rule {
  id?: string;
  name: string;
  field: 'description' | 'value';
  operator: 'contains' | 'equals' | 'gt' | 'lt';
  value: string;
  target_category?: string;
  target_tag_ids?: string[];
}

const API_BASE_URL = '/api';

export const api = {
  async getBills(): Promise<Bill[]> {
    const response = await fetch(`${API_BASE_URL}/bills`);
    if (!response.ok) throw new Error('Failed to fetch bills');
    return response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async createCategory(name: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  async createTag(name: string): Promise<Tag> {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create tag');
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
  },

  async updateBill(id: string, data: { category?: string; tags?: string[] }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bills/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update bill');
    }
  },

  async getRules(): Promise<Rule[]> {
    const response = await fetch(`${API_BASE_URL}/rules`);
    if (!response.ok) throw new Error('Failed to fetch rules');
    return response.json();
  },

  async createRule(rule: Rule): Promise<Rule> {
    const response = await fetch(`${API_BASE_URL}/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!response.ok) throw new Error('Failed to create rule');
    return response.json();
  },

  async updateRule(id: string, rule: Rule): Promise<Rule> {
    const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rule),
    });
    if (!response.ok) throw new Error('Failed to update rule');
    return response.json();
  },

  async deleteRule(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rule');
  },

  async applyRules(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/rules/apply`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to apply rules');
  }
};

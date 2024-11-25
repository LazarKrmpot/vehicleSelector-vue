import axios from 'axios';

const api = axios.create({
  baseURL: 'https://new.api.nexusautotransport.com/api/vehicles',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const getYears = async (): Promise<number[]> => {
  try {
    const response = await api.get('/years');
    const years = response.data?.data || [];
    return years.sort((a: number, b: number) => b - a);
  } catch (error) {
    console.error('Error fetching years:', error);
    throw new Error('Failed to fetch years');
  }
};

export const getMakes = async (year: number): Promise<string[]> => {
  try {
    const response = await api.get(`/makes`, {
      params: { year: year.toString() }
    });
    // Extract make names from the response data
    const makes = (response.data?.data || []).map((make: { id: number, name: string }) => make.name);
    return makes.sort();
  } catch (error) {
    console.error('Error fetching makes:', error);
    throw new Error('Failed to fetch makes');
  }
};

export const getModels = async (year: number, make: string): Promise<string[]> => {
  try {
    const response = await api.get(`/models`, {
      params: { 
        year: year.toString(),
        make: make
      }
    });
    // Extract model names from the response data
    const models = (response.data?.data || []).map((model: { model: string }) => model.model);
    return models.sort();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('Failed to fetch models');
  }
};
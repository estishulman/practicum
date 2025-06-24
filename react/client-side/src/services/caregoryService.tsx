// src/services/categoryService.ts
import api from './Api'

export interface Category {
  id: number;
  name: string;
}

export interface CategoryCreate {
  name: string;
}

export interface CategoryUpdate {
  name: string;
}

class CategoryService {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/Category');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get(`/Category/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  // Create new category
  async createCategory(categoryData: CategoryCreate): Promise<Category> {
    try {
      const response = await api.post('/Category', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update existing category
  async updateCategory(id: number, categoryData: CategoryUpdate): Promise<void> {
    try {
      await api.put(`/Category/${id}`, categoryData);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/Category/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }

  // Search categories by name
  async searchCategories(searchTerm: string): Promise<Category[]> {
    try {
      const categories = await this.getAllCategories();
      return categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;
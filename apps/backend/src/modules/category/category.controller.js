import * as categoryService from './category.service.js';

// 1. List Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

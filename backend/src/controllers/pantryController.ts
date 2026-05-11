import { Request, Response } from 'express';
import { query } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const scanPantry = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const pantryImage = req.files.image;
    // In a real app, we would send this to an AI vision API
    // Mocking the AI vision result
    const mockedIngredients = [
      'Chicken Breast', 'Broccoli', 'Brown Rice', 'Olive Oil', 'Garlic', 
      'Onion', 'Lemon', 'Greek Yogurt', 'Eggs', 'Spinach'
    ];

    const userId = req.body.userId || 'default-user';
    
    const addedItems = [];
    for (const item of mockedIngredients) {
      const id = uuidv4();
      await query(`
        INSERT INTO pantry (id, user_id, item_name, quantity)
        VALUES ('${id}', '${userId}', '${item}', '1 unit')
      `);
      addedItems.push({ id, item_name: item, quantity: '1 unit' });
    }

    res.status(201).json({
      message: 'Pantry scanned and items added successfully',
      items: addedItems
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPantryItems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await query(`SELECT * FROM pantry WHERE user_id = '${userId}'`);
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePantryItem = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;
    await query(`DELETE FROM pantry WHERE id = '${itemId}' AND user_id = '${userId}'`);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

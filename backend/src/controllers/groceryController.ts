import { Request, Response } from 'express';
import { query } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const generateGroceryList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // 1. Get current meal plan
    const meals = await query(`SELECT ingredients FROM meals WHERE user_id = '${userId}'`);
    if (meals.length === 0) {
      return res.status(400).json({ message: 'No meal plan found. Please generate a meal plan first.' });
    }

    // 2. Get current pantry
    const pantryItems = await query(`SELECT item_name FROM pantry WHERE user_id = '${userId}'`);
    const pantrySet = new Set(pantryItems.map(item => item.item_name.toLowerCase()));

    // 3. Consolidate ingredients
    const consolidated: any = {};
    meals.forEach((meal: any) => {
      const ingredients = JSON.parse(meal.ingredients || '[]');
      ingredients.forEach((ing: any) => {
        const key = ing.name.toLowerCase();
        if (consolidated[key]) {
          consolidated[key].quantity += `, ${ing.quantity}`;
        } else {
          consolidated[key] = { 
            name: ing.name, 
            category: ing.category, 
            quantity: ing.quantity,
            inPantry: pantrySet.has(key)
          };
        }
      });
    });

    // 4. Clear existing grocery list
    await query(`DELETE FROM grocery_lists WHERE user_id = '${userId}'`);

    // 5. Save to database (only items not in pantry)
    const listToSave = Object.values(consolidated).filter((item: any) => !item.inPantry);
    const savedItems = [];

    for (const item of listToSave as any[]) {
      const id = uuidv4();
      await query(`
        INSERT INTO grocery_lists (id, user_id, item_name, category, bought)
        VALUES ('${id}', '${userId}', '${item.name}', '${item.category}', 0)
      `);
      savedItems.push({ id, item_name: item.name, category: item.category, bought: false });
    }

    res.status(201).json({
      message: 'Grocery list generated successfully',
      items: savedItems,
      pantryMatches: Object.values(consolidated).filter((item: any) => item.inPantry)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroceryList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const items = await query(`SELECT * FROM grocery_lists WHERE user_id = '${userId}'`);
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBought = async (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;
    const { bought } = req.body;
    await query(`UPDATE grocery_lists SET bought = ${bought ? 1 : 0} WHERE id = '${itemId}' AND user_id = '${userId}'`);
    res.status(200).json({ message: 'Item status updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

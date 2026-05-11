import { Request, Response } from 'express';
import { query } from '../utils/db';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await query(`SELECT * FROM users WHERE id = '${userId}'`);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, preferences } = req.body;
    
    await query(`
      UPDATE users 
      SET name = '${name}', email = '${email}', preferences = '${preferences}'
      WHERE id = '${userId}'
    `);
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // 1. Get today's meals
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todayMeals = await query(`SELECT * FROM meals WHERE user_id = '${userId}' AND day = '${today}'`);
    
    // 2. Get budget status
    const user = await query(`SELECT weekly_budget FROM users WHERE id = '${userId}'`);
    const groceryItems = await query(`SELECT item_name FROM grocery_lists WHERE user_id = '${userId}'`);
    
    // Mock prices for summary
    const mockPrices: { [key: string]: number } = {
      'Chicken Breast': 8.50, 'Mixed Greens': 4.00, 'Cucumber': 1.20,
      'Balsamic Vinaigrette': 3.50, 'Salmon Fillet': 12.00, 'Asparagus': 4.50,
      'Lemon': 0.80, 'Olive Oil': 9.00, 'Oats': 3.00, 'Blueberries': 4.50,
      'Almond Milk': 3.50
    };

    let totalEstimate = 0;
    groceryItems.forEach((item: any) => {
      totalEstimate += mockPrices[item.item_name] || 5.00;
    });

    // 3. Get pantry status
    const pantryCount = await query(`SELECT COUNT(*) as count FROM pantry WHERE user_id = '${userId}'`);

    res.status(200).json({
      todayMeals,
      budget: {
        limit: user[0]?.weekly_budget || 100,
        current: totalEstimate
      },
      pantry: {
        totalItems: pantryCount[0]?.count || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

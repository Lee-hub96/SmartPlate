import { Request, Response } from 'express';
import { query } from '../utils/db';

export const getBudget = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await query(`SELECT weekly_budget FROM users WHERE id = '${userId}'`);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get total cost of current grocery list
    const items = await query(`SELECT * FROM grocery_lists WHERE user_id = '${userId}'`);
    
    // Mock prices for items
    const mockPrices: { [key: string]: number } = {
      'Chicken Breast': 8.50,
      'Mixed Greens': 4.00,
      'Cucumber': 1.20,
      'Balsamic Vinaigrette': 3.50,
      'Salmon Fillet': 12.00,
      'Asparagus': 4.50,
      'Lemon': 0.80,
      'Olive Oil': 9.00,
      'Oats': 3.00,
      'Blueberries': 4.50,
      'Almond Milk': 3.50
    };

    let totalEstimate = 0;
    items.forEach((item: any) => {
      totalEstimate += mockPrices[item.item_name] || 5.00; // Default price if not in mock
    });

    res.status(200).json({
      weekly_budget: user[0].weekly_budget,
      total_estimate: totalEstimate,
      items_with_prices: items.map((item: any) => ({
        ...item,
        price: mockPrices[item.item_name] || 5.00
      }))
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { weeklyBudget } = req.body;
    
    await query(`
      UPDATE users 
      SET weekly_budget = ${weeklyBudget} 
      WHERE id = '${userId}'
    `);
    
    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

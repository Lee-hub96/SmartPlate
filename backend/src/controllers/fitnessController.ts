import { Request, Response } from 'express';
import { query } from '../utils/db';

export const getFitnessProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let user = await query(`SELECT * FROM users WHERE id = '${userId}'`);
    
    if (user.length === 0) {
      // Create a default user if not exists for demo purposes
      await query(`
        INSERT INTO users (id, email, name, fitness_goal, budget_level, preferences)
        VALUES ('${userId}', '${userId}@example.com', 'John Doe', 'weight_loss', 'medium', '[]')
      `);
      user = await query(`SELECT * FROM users WHERE id = '${userId}'`);
    }
    
    res.status(200).json(user[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFitnessGoal = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fitnessGoal } = req.body;
    
    await query(`
      UPDATE users 
      SET fitness_goal = '${fitnessGoal}' 
      WHERE id = '${userId}'
    `);
    
    res.status(200).json({ message: 'Fitness goal updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

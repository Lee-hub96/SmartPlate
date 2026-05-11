import { Request, Response } from 'express';
import { query } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const generateMealPlan = async (req: Request, res: Response) => {
  try {
    const { userId, fitnessGoal, budgetLevel, preferences } = req.body;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    // Mock meal suggestions based on fitness goal
    const mealDatabase: any = {
      weight_loss: {
        breakfast: { 
          title: 'Oatmeal with Berries', 
          calories: 350, protein: 12, carbs: 45, fat: 8,
          ingredients: JSON.stringify([
            { name: 'Oats', quantity: '1/2 cup', category: 'Pantry' },
            { name: 'Blueberries', quantity: '1/4 cup', category: 'Produce' },
            { name: 'Almond Milk', quantity: '1 cup', category: 'Dairy' }
          ])
        },
        lunch: { 
          title: 'Grilled Chicken Salad', 
          calories: 450, protein: 40, carbs: 15, fat: 20,
          ingredients: JSON.stringify([
            { name: 'Chicken Breast', quantity: '200g', category: 'Meat' },
            { name: 'Mixed Greens', quantity: '2 cups', category: 'Produce' },
            { name: 'Cucumber', quantity: '1/2', category: 'Produce' },
            { name: 'Balsamic Vinaigrette', quantity: '2 tbsp', category: 'Pantry' }
          ])
        },
        dinner: { 
          title: 'Baked Salmon with Asparagus', 
          calories: 500, protein: 35, carbs: 10, fat: 25,
          ingredients: JSON.stringify([
            { name: 'Salmon Fillet', quantity: '150g', category: 'Meat' },
            { name: 'Asparagus', quantity: '1 bunch', category: 'Produce' },
            { name: 'Lemon', quantity: '1', category: 'Produce' },
            { name: 'Olive Oil', quantity: '1 tbsp', category: 'Pantry' }
          ])
        }
      },
      bulking: {
        breakfast: { title: 'Protein Pancakes with Peanut Butter', calories: 700, protein: 40, carbs: 80, fat: 25 },
        lunch: { title: 'Beef and Rice Bowl', calories: 850, protein: 50, carbs: 100, fat: 30 },
        dinner: { title: 'Large Pepperoni Pizza (Half)', calories: 900, protein: 40, carbs: 110, fat: 35 }
      },
      high_protein: {
        breakfast: { title: 'Egg White Omelette with Spinach', calories: 300, protein: 35, carbs: 5, fat: 12 },
        lunch: { title: 'Turkey Wrap with Greek Yogurt Sauce', calories: 400, protein: 45, carbs: 30, fat: 10 },
        dinner: { title: 'Lean Steak with Roasted Vegetables', calories: 550, protein: 55, carbs: 15, fat: 20 }
      },
      keto: {
        breakfast: { title: 'Bacon and Avocado Salad', calories: 600, protein: 20, carbs: 8, fat: 55 },
        lunch: { title: 'Keto Bunless Burger', calories: 700, protein: 35, carbs: 5, fat: 60 },
        dinner: { title: 'Zucchini Noodles with Pesto and Shrimp', calories: 500, protein: 25, carbs: 12, fat: 40 }
      },
      vegan: {
        breakfast: { title: 'Tofu Scramble with Toast', calories: 400, protein: 25, carbs: 35, fat: 15 },
        lunch: { title: 'Chickpea Curry with Quinoa', calories: 600, protein: 20, carbs: 85, fat: 12 },
        dinner: { title: 'Lentil Stew with Kale', calories: 500, protein: 25, carbs: 70, fat: 10 }
      }
    };

    const goal = fitnessGoal || 'weight_loss';
    const suggestions = mealDatabase[goal] || mealDatabase['weight_loss'];

    // Clear existing meal plan for the user
    await query(`DELETE FROM meals WHERE user_id = '${userId}'`);

    const generatedMeals = [];

    for (const day of days) {
      for (const mealType of mealTypes) {
        const id = uuidv4();
        const suggestion = suggestions[mealType];
        
        await query(`
          INSERT INTO meals (id, user_id, day, meal_type, title, recipe, calories, protein, carbs, fat, ingredients)
          VALUES (
            '${id}', 
            '${userId}', 
            '${day}', 
            '${mealType}', 
            '${suggestion.title}', 
            'Placeholder recipe for ${suggestion.title}', 
            ${suggestion.calories}, 
            ${suggestion.protein}, 
            ${suggestion.carbs}, 
            ${suggestion.fat}, 
            '${suggestion.ingredients || '[]'}'
          )
        `);
        
        generatedMeals.push({
          id,
          day,
          meal_type: mealType,
          ...suggestion
        });
      }
    }

    res.status(201).json({
      message: 'Meal plan generated successfully',
      plan: generatedMeals
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMealPlan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const meals = await query(`SELECT * FROM meals WHERE user_id = '${userId}'`);
    res.status(200).json(meals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

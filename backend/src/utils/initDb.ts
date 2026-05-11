import { query } from './db';

export async function initDb() {
  console.log('Initializing database tables...');

  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        fitness_goal TEXT, -- weight_loss, bulking, high_protein, keto, vegan
        budget_level TEXT, -- low, medium, high
        preferences TEXT, -- JSON string of dietary restrictions/preferences
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Meals table
    await query(`
      CREATE TABLE IF NOT EXISTS meals (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        day TEXT, -- Monday, Tuesday, etc.
        meal_type TEXT, -- breakfast, lunch, dinner, snack
        title TEXT,
        recipe TEXT,
        calories INTEGER,
        protein INTEGER,
        carbs INTEGER,
        fat INTEGER,
        ingredients TEXT, -- JSON string
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Pantry table
    await query(`
      CREATE TABLE IF NOT EXISTS pantry (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        item_name TEXT,
        quantity TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Grocery lists table
    await query(`
      CREATE TABLE IF NOT EXISTS grocery_lists (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        item_name TEXT,
        category TEXT,
        bought BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

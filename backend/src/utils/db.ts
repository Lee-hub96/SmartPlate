import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function query<T = any>(sql: string): Promise<T[]> {
  try {
    // In dash, single quotes are literal inside double-quoted strings.
    // team-db receives the SQL as-is, so no shell escaping needed.
    const command = `team-db "${sql}"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stdout) {
      console.error('team-db stderr:', stderr);
      throw new Error(stderr);
    }

    try {
      return JSON.parse(stdout);
    } catch (parseError) {
      // If it's not JSON, it might be a success message or an error
      if (stdout.includes('success') || stdout.trim() === '') {
        return [] as T[];
      }
      console.error('Failed to parse team-db output:', stdout);
      return [] as T[];
    }
  } catch (error: any) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

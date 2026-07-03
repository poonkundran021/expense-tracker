import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('expenses.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      category TEXT PRIMARY KEY,
      limit_amount REAL NOT NULL
    );
  `);

  console.log('Database initialized ✅');
}

export async function addTransaction(
  amount: number,
  category: string,
  note: string,
  date: string
) {
  await db.runAsync(
    'INSERT INTO transactions (amount, category, note, date) VALUES (?, ?, ?, ?)',
    [amount, category, note, date]
  );
}

export async function getAllTransactions() {
  const rows = await db.getAllAsync('SELECT * FROM transactions ORDER BY date DESC');
  return rows;
}

export async function deleteTransaction(id: number) {
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function setBudget(category: string, limitAmount: number) {
  await db.runAsync(
    'INSERT OR REPLACE INTO budgets (category, limit_amount) VALUES (?, ?)',
    [category, limitAmount]
  );
}

export async function getAllBudgets() {
  const rows = await db.getAllAsync('SELECT * FROM budgets');
  return rows;
}
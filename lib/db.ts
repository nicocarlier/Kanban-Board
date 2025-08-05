import Database from 'better-sqlite3';

// Specify the path to your database file.
// If the file doesn't exist, better-sqlite3 will create it.
// For an in-memory database, use ':memory:'
const db = new Database('./kanban.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards (id)
  );

  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    column_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_deleted INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards (id),
    FOREIGN KEY (column_id) REFERENCES columns (id)
  );
`);

// Insert default board if it doesn't exist
const defaultBoardId = 'default-board';
const boardExists = db.prepare('SELECT id FROM boards WHERE id = ?').get(defaultBoardId);
if (!boardExists) {
  db.prepare('INSERT INTO boards (id, name) VALUES (?, ?)').run(defaultBoardId, 'My Kanban Board');
  
  // Insert default columns
  const defaultColumns = [
    { id: 'todo', name: 'To Do', order: 0 },
    { id: 'in-progress', name: 'In Progress', order: 1 },
    { id: 'done', name: 'Done', order: 2 }
  ];
  
  const insertColumn = db.prepare('INSERT INTO columns (id, board_id, name, order_index) VALUES (?, ?, ?, ?)');
  defaultColumns.forEach(column => {
    insertColumn.run(column.id, defaultBoardId, column.name, column.order);
  });
}

// You can now interact with the database using the 'db' object.
// For example, to run a simple query:
try {
    const result = db.prepare('SELECT 1 + 1 AS solution').get() as { solution: number };
    console.log('Database connected and query executed:', result.solution);
} catch (error) {
    console.error('Error connecting to or querying the database:', error);
}

export default db;
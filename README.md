# Kanban Board - TaskFlow Solutions

A full-stack Kanban board application built for managing tasks across different project stages. This project demonstrates a robust single-user experience with persistent data storage and real-time state management.

## 🎯 Project Overview

This Kanban board allows users to:
- **View tasks** organized across customizable columns (To Do, In Progress, Done)
- **Add new cards** to any column with titles and descriptions
- **Drag and drop** cards between columns to update task status
- **Edit card details** including titles and descriptions
- **Delete cards** when tasks are no longer needed
- **Persistent storage** - all changes are saved to the database and restored on page refresh

## 🏗️ Technical Architecture

### Framework Choice: Next.js 15
**Why Next.js?**
- **Type Safety**: Strong TypeScript integration ensures type contracts between frontend and API
- **API Routes**: Built-in API routes eliminate need for separate backend server
- **Full-Stack**: Single codebase for both frontend and backend logic
- **Performance**: Server-side rendering and optimized builds
- **Developer Experience**: Hot reloading, excellent debugging tools

### Database Choice: SQLite with better-sqlite3
**Why SQLite for a Kanban board?**
- **Relational Schema**: Perfect fit for consistent board/column/card relationships
- **ACID Compliance**: Ensures data integrity for task operations
- **Zero Configuration**: No separate database server needed
- **File-based**: Database file can be easily backed up or version controlled
- **Performance**: Excellent for single-user applications with fast read/write operations

### Schema Design
```sql
-- Boards table for project organization
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Columns table for task stages
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards (id)
);

-- Cards table for individual tasks
CREATE TABLE cards (
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
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kanban-Board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

### Database Setup
The application automatically:
- Creates the SQLite database file (`kanban.db`) on first run
- Initializes the default board with three columns (To Do, In Progress, Done)
- Sets up all necessary tables and relationships

## 📡 API Endpoints

### Core Endpoints
- `GET /api/boards/:boardId` - Retrieve board with all columns and cards
- `POST /api/boards/:boardId/cards` - Add a new card to a column
- `PUT /api/boards/:boardId/cards/:cardId` - Update card details
- `PUT /api/boards/:boardId/cards/:cardId/move` - Move card between columns
- `DELETE /api/boards/:boardId/cards/:cardId` - Delete a card

### Example Usage
```javascript
// Fetch board data
const board = await fetch('/api/boards/default-board').then(r => r.json());

// Add a new card
await fetch('/api/boards/default-board/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    columnId: 'todo'
  })
});
```

## 🎨 Features

### Current Implementation
- ✅ **Database Integration**: Full SQLite integration with automatic schema creation
- ✅ **Board Display**: View tasks organized across columns
- ✅ **Data Persistence**: All changes saved to database
- ✅ **Error Handling**: Graceful error handling and loading states
- ✅ **Type Safety**: Full TypeScript implementation

### Planned Features
- 🔄 **Card Management**: Add, edit, delete cards
- 🎯 **Drag & Drop**: Move cards between columns
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔄 **Real-time Updates**: WebSocket integration for multi-user support

## 🛠️ Development

### Project Structure
```
├── app/
│   ├── api/                    # API routes
│   │   └── boards/
│   │       └── [boardId]/
│   │           ├── route.ts    # GET board
│   │           └── cards/      # Card operations
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main board page
├── components/
│   └── column.tsx              # Column component
├── lib/
│   ├── api.ts                  # API client functions
│   ├── db.ts                   # Database setup
│   └── models/                 # TypeScript models
└── public/                     # Static assets
```

### Key Technologies
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **API**: Next.js API Routes
- **Development**: ESLint, PostCSS

## 🧪 Testing

### Manual Testing Checklist
- [ ] Board loads with default columns
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Error states display properly
- [ ] Page refresh restores state

## 📝 Development Notes

### Design Decisions
1. **Single Board Focus**: Simplified to one hardcoded board for MVP
2. **File-based Database**: SQLite provides persistence without infrastructure complexity
3. **TypeScript First**: Ensures type safety across the entire stack
4. **API-First Design**: Clean separation between frontend and data layer

### Future Enhancements
- Multi-board support
- User authentication
- Real-time collaboration
- Advanced filtering and search
- Card attachments and comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ by TaskFlow Solutions**
# Kanban Board - TaskFlow Solutions

A full-stack Kanban board application built for managing tasks across different project stages. This project demonstrates a robust single-user experience with persistent data storage.

## 🎯 Project Overview

This Kanban board allows users to:
- **View tasks** organized across columns (To Do, In Progress, Done)
- **Add new cards** to any column with titles and descriptions
- **Drag and drop** cards between columns to update task status
- **Edit card details** including titles and descriptions
- **Delete cards** when tasks are no longer needed
- **Persistent storage** - all changes are saved to the database and restored on page refresh

## 🏗️ Technical Architecture

### Framework: Next.js 15
- **Type Safety**: Strong TypeScript integration
- **API Routes**: Built-in API routes for backend functionality
- **Full-Stack**: Single codebase for frontend and backend
- **Performance**: Optimized builds and server-side rendering

### Database: SQLite with better-sqlite3
- **Relational Schema**: Perfect for board/column/card relationships
- **ACID Compliance**: Ensures data integrity
- **Zero Configuration**: No separate database server needed
- **File-based**: Easy backup and version control

### Schema Design
```sql
-- Boards table
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Columns table
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards (id)
);

-- Cards table
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
   Navigate to [http://localhost:3000](http://localhost:3000)


## 📡 API Endpoints

### Core Endpoints
- `GET /api/boards/:boardId` - Retrieve board with all columns and cards
- `POST /api/boards/:boardId/cards` - Add a new card to a column
- `PUT /api/boards/:boardId/cards/:cardId` - Update card details
- `PUT /api/boards/:boardId/cards/:cardId/move` - Move card between columns
- `DELETE /api/boards/:boardId/cards/:cardId` - Delete a card


## 🎨 Features

### ✅ Implemented Features
- **Database Integration**: Full SQLite integration with automatic schema creation
- **Board Display**: View tasks organized across columns
- **Card Management**: Add, edit, delete cards with modal interface
- **Drag & Drop**: Move cards between columns with visual feedback
- **Data Persistence**: All changes saved to database
- **Error Handling**: Graceful error handling and loading states
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-friendly interface

### 🔄 Future Enhancements
- Multi-board support
- User authentication
- Real-time collaboration
- Advanced filtering and search
- Card attachments and comments

## 🛠️ Development


### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, HeroUI
- **Database**: SQLite with better-sqlite3
- **API**: Next.js API Routes
- **Drag & Drop**: dnd-kit
- **Icons**: FluentUI React Icons



## 📝 Development Notes

### Design Decisions
1. **Single Board Focus**: Simplified to one hardcoded board for MVP
2. **File-based Database**: SQLite provides persistence without infrastructure complexity
3. **TypeScript First**: Ensures type safety across the entire stack
4. **API-First Design**: Clean separation between frontend and data layer
5. **Soft Deletes**: Cards are marked as deleted rather than hard deleted

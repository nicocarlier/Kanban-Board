
Instructions
Story Context: You’re a lead engineer at “TaskFlow Solutions,” a startup building collaboration tools. Your current task is to build the core architecture for a functional Kanban board. The initial requirement is to allow users to manage tasks across different stages (columns) on a project board, with all changes persisting to a database. While real-time updates are a future feature, for now, focus on a robust single-user experience where changes are saved and loaded correctly.

Problem Statement: Design and implement a full-stack Kanban board application. The application should allow a user to manage tasks across different stages (columns) in a project (board). All changes (adding tasks, moving tasks, deleting tasks, editing tasks) must be persisted in a database.

Technical Requirements:

Frontend:

Display a single Kanban board with multiple customizable columns (e.g., “To Do”, “In Progress”, “Done”).
Each column should contain multiple draggable task “cards”.
Users must be able to:
Add new cards to a column (e.g., via an input field/button).
Drag and drop cards between columns.
Edit card titles/descriptions.
Delete cards.
Changes made by the user must be persisted to the backend/database. When the page is refreshed, the board should load its last saved state.
Backend:

Implement a RESTful API for managing boards, columns, and cards.
The backend must persist board, column, and card data in a database (e.g., MongoDB, PostgreSQL, SQLite).
API Endpoints (minimum):

GET /boards/:boardId - Retrieve a specific board’s data, including its columns and their respective cards.

POST /boards/:boardId/cards - Add a new card to a specified column on a board.

PUT /boards/:boardId/cards/:cardId/move - Update a card’s column and/or its order within a column.

PUT /boards/:boardId/cards/:cardId - Update card details (e.g., title, description).

DELETE /boards/:boardId/cards/:cardId - Delete a card.
Constraints/Assumptions:

Assume a single hardcoded board ID for simplicity; no need for multi-board selection or user authentication.
Focus on core functionality and data persistence. Real-time synchronization between multiple clients is out of scope for the implementation task but will be discussed later.
Basic error handling is expected (e.g., checking for invalid IDs).
Prioritize a working end-to-end flow over extensive styling.
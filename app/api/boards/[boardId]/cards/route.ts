import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const { title, description, columnId } = await request.json();

    // Validate input
    if (!title || !columnId) {
      return NextResponse.json({ error: 'title and columnId are required' }, { status: 400 });
    }

    // Check if board exists
    const boardExists = db.prepare('SELECT id FROM boards WHERE id = ?').get(boardId);
    if (!boardExists) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Check if column exists
    const columnExists = db.prepare('SELECT id FROM columns WHERE id = ? AND board_id = ?').get(columnId, boardId);
    if (!columnExists) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    // Get the highest order_index for the column
    const maxOrder = db.prepare('SELECT MAX(order_index) as max_order FROM cards WHERE column_id = ? AND is_deleted = 0').get(columnId) as { max_order: number } | undefined;
    const nextOrder = (maxOrder?.max_order || 0) + 1;

    // Generate unique card ID
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert new card
    const insertCard = db.prepare(`
      INSERT INTO cards (id, board_id, column_id, title, description, order_index, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    
    const result = insertCard.run(cardId, boardId, columnId, title, description || '', nextOrder);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }

    // Return the created card
    const newCard = db.prepare(`
      SELECT id, title, description, column_id, order_index, created_at, updated_at
      FROM cards WHERE id = ?
    `).get(cardId);

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
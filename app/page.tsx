"use client";

import { fetchBoard, DEFAULT_BOARD_ID, updateCardPosition, moveCardBetweenColumns, handleEditCard as apiHandleEditCard, handleDeleteCard as apiHandleDeleteCard } from "@/lib/api";
import { useEffect, useState } from "react";
import { Kanban } from "@/types/board.interface";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "@/components/TaskCard";
import { Spinner } from "@heroui/react";
import Column from "@/components/Column";

export default function Home() {
  const [board, setBoard] = useState<Kanban.Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // DnD state
  const [activeCard, setActiveCard] = useState<Kanban.Card | null>(null);

  // Configure sensors for better mobile support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required to start drag
      },
    })
  );

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        const boardData = await fetchBoard(DEFAULT_BOARD_ID);
        setBoard(boardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cardId = active.id as string;
    
    // Find the card being dragged
    const card = board?.columns
      .flatMap(col => col.cards)
      .find(card => card.id === cardId);
    
    setActiveCard(card || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !board) return;

    const activeId = active.id as string;
    const overId = over.id as string;


    // Find source and destination columns
    const activeColumn = board.columns.find(col => 
      col.cards.some(card => card.id === activeId)
    );
    const overColumn = board.columns.find(col => 
      col.id === overId || col.cards.some(card => card.id === overId)
    );

    if (!activeColumn || !overColumn) {
      return;
    }

    // Don't update state here - just log for debugging
    if (activeColumn.id !== overColumn.id) {
    } else {
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || !board) return;

    const activeId = active.id as string;
    const overId = over.id as string;


    // Find the destination column
    const destinationColumn = board.columns.find(col => 
      col.id === overId || col.cards.some(card => card.id === overId)
    );

    if (!destinationColumn) {
      return;
    }


    // Find the source column
    const sourceColumn = board.columns.find(col => 
      col.cards.some(card => card.id === activeId)
    );

    if (!sourceColumn) {
      return;
    }


    // If moving between different columns
    if (sourceColumn.id !== destinationColumn.id) {
      
      // Persist the move to database
      try {
        const response = await moveCardBetweenColumns(activeId, destinationColumn.id, destinationColumn.cards.length);
        if (response.ok) {
          
          // Update frontend state
          setBoard(prev => {
            if (!prev) return prev;
            
            const activeCard = sourceColumn.cards.find(card => card.id === activeId);
            if (!activeCard) return prev;
            
            return {
              ...prev,
              columns: prev.columns.map(col => {
                if (col.id === sourceColumn.id) {
                  // Remove card from source column
                  return {
                    ...col,
                    cards: col.cards.filter(card => card.id !== activeId)
                  };
                }
                if (col.id === destinationColumn.id) {
                  // Add card to destination column
                  return {
                    ...col,
                    cards: [...col.cards, { ...activeCard, column_id: destinationColumn.index }]
                  };
                }
                return col;
              })
            };
          });
        } else {
          console.error('Failed to move card:', response.statusText);
        }
      } catch (error) {
        console.error('Error moving card:', error);
      }
    } else {
      // Same column - check if it's a reorder
      const oldIndex = destinationColumn.cards.findIndex(card => card.id === activeId);
      const newIndex = destinationColumn.cards.findIndex(card => card.id === overId);


      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        // Persist the reorder to database
        try {
          const response = await updateCardPosition(activeId, destinationColumn.id, newIndex);
          if (response.ok) {
            
            // Update frontend state
            setBoard(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                columns: prev.columns.map(col => {
                  if (col.id === destinationColumn.id) {
                    return {
                      ...col,
                      cards: arrayMove(col.cards, oldIndex, newIndex)
                    };
                  }
                  return col;
                })
              };
            });
          } else {
            console.error('Failed to update card position:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating card position:', error);
        }
      }
    }
  };

  const handleEditCard = async (cardId: string, title: string, description: string) => {
    try {
      const response = await apiHandleEditCard(cardId, title, description);
      if (response.ok) {
        setBoard(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            columns: prev.columns.map(column => ({
              ...column,
              cards: column.cards.map(card => 
                card.id === cardId 
                  ? { ...card, title, description }
                  : card
              )
            }))
          };
        });
      } else {
        console.error('Failed to update card');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await apiHandleDeleteCard(cardId);
      if (response.ok) {
        setBoard(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            columns: prev.columns.map(column => ({
              ...column,
              cards: column.cards.filter(card => card.id !== cardId)
            }))
          };
        });
      } else {
        console.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center">
      <Spinner size="lg" color="primary" />
    </div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center">
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full items-center justify-between px-4 pb-4 border-b border-b-gray-400">
        <h1 className="text-2xl font-bold text-gray-700">Kanban Board</h1>
      </div>
      
      {board && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full w-full border border-gray-400">
            {board.columns.map((col: Kanban.Column, i: number) => (
              <div className="h-full flex-1 min-w-0 border-r border-gray-400 last:!border-r-0" key={i}>
                <Column
                  col={col} 
                  setBoard={setBoard}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              </div>
            ))}
          </div>
          
          {/* Drag overlay for visual feedback */}
          <DragOverlay>
            {activeCard ? (
              <div className="opacity-50 rotate-2">
                <TaskCard
                  card={activeCard}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

    </div>
  );
}
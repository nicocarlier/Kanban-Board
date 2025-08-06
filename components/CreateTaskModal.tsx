import { Dismiss20Regular } from "@fluentui/react-icons";
import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@heroui/react";
import { UseDisclosureProps } from "@/types/general.interface";
import { Kanban } from "@/types/board.interface";
import { addCard } from "@/lib/storage";

interface CreateTaskModalProps {
    modalProps: UseDisclosureProps;
    colIndex: number;
    columnName: string;
    board: Kanban.Board;
    setBoard: React.Dispatch<React.SetStateAction<Kanban.Board | null>>;
}

export default function CreateTaskModal({
    modalProps,
    colIndex,
    columnName,
    board,
    setBoard,
} : CreateTaskModalProps) {

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) return;
        
        setIsLoading(true);
        try {
            // Use localStorage instead of API
            const updatedBoard = addCard(board, colIndex, taskTitle.trim(), taskDescription.trim());
            setTaskTitle("");
            setTaskDescription("");
            modalProps.onClose();
            setBoard(updatedBoard);
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal 
            isOpen={modalProps.isOpen} 
            onOpenChange={modalProps.onOpenChange}
            placement="center"
            backdrop="opaque"
            size="lg"
            classNames={{
                wrapper: "",
                base: "max-w-2xl",
                backdrop: "!bg-[rgba(0,0,0,0.5)]"
            }}
            hideCloseButton={true}
        >
            <ModalContent className="z-50 !bg-white rounded-lg p-6 relative">
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">Create New Task</h2>
                                <p className="text-sm text-gray-600 mt-1">Adding to: <span className="font-medium">{columnName}</span></p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 hover:cursor-pointer"
                            >
                                <Dismiss20Regular className="text-gray-800" />
                            </button>
                        </div>
                    </ModalHeader>
                    <ModalBody className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                                <input
                                    type="text"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    placeholder="Enter task title"
                                    className="w-full px-3 py-2 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder="Enter task description"
                                    rows={4}
                                    className="w-full px-3 py-2 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none"
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="pt-6 gap-3">
                        <Button 
                            color="default" 
                            variant="light" 
                            onPress={onClose}
                            radius="md"
                            className="px-6 py-2 text-gray-700 hover:cursor-pointer rounded-md !bg-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="primary" 
                            onPress={handleCreateTask}
                            radius="md"
                            isLoading={isLoading}
                            isDisabled={!taskTitle.trim()}
                            className="px-6 py-2 bg-blue-500 hover:cursor-pointer text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create Task
                        </Button>
                    </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    );
}

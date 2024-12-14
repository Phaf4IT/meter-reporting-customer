import React from "react";
import {Dialog, DialogContent} from "@reach/dialog";
import "@/components/dialog-styles.css";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onConfirm,
                                                                   title,
                                                                   message,
                                                                   confirmText,
                                                                   cancelText,
                                                               }) => {
    return (
        <Dialog
            aria-label={title}
            isOpen={isOpen}
            onDismiss={onClose}
        >
            <DialogContent
                className="bg-cyan-900 text-white p-6 rounded shadow-md max-w-lg mx-auto"
                aria-label={title}
            >
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="my-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;

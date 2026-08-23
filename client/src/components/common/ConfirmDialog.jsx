import { AlertTriangle, X } from "lucide-react";

import "./ConfirmDialog.css";

const ConfirmDialog = ({
    open = false,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) {
        return null;
    }

    return (
        <div
            className="confirm-dialog"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onCancel?.();
                }
            }}
        >
            <div
                className="confirm-dialog__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <button
                    type="button"
                    className="confirm-dialog__close"
                    onClick={onCancel}
                    disabled={loading}
                    aria-label="Close confirmation dialog"
                >
                    <X size={16} strokeWidth={1.8} />
                </button>

                <div className="confirm-dialog__icon">
                    <AlertTriangle
                        size={20}
                        strokeWidth={1.8}
                    />
                </div>

                <div className="confirm-dialog__content">
                    <h2
                        id="confirm-dialog-title"
                        className="confirm-dialog__title"
                    >
                        {title}
                    </h2>

                    <p className="confirm-dialog__message">
                        {message}
                    </p>
                </div>

                <div className="confirm-dialog__actions">
                    <button
                        type="button"
                        className="confirm-dialog__cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="confirm-dialog__confirm"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
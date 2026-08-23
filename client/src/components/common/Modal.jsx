import { X } from "lucide-react";

import "./Modal.css";

const Modal = ({
    open = false,
    title,
    children,
    onClose,
    size = "medium",
}) => {
    if (!open) {
        return null;
    }

    return (
        <div
            className="owner-modal"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose?.();
                }
            }}
        >
            <div
                className={`owner-modal__panel owner-modal__panel--${size}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="owner-modal__header">
                    <h2 className="owner-modal__title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="owner-modal__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                <div className="owner-modal__body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
import { useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

import "./ProductImageUpload.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const ProductImageUpload = ({
    productId,
    images = [],
    onUpload,
    onRemove,
    loading = false,
}) => {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const getImageUrl = (image) => {
        const imageUrl = image.image_url || image.url;

        if (!imageUrl) {
            return "";
        }

        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        return `${API_BASE_URL}${imageUrl}`;
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            return;
        }

        // Clean up previous preview URL
        if (preview?.url) {
            URL.revokeObjectURL(preview.url);
        }

        const objectUrl = URL.createObjectURL(file);

        setPreview({
            file,
            url: objectUrl,
        });
    };

    const clearPreview = () => {
        if (preview?.url) {
            URL.revokeObjectURL(preview.url);
        }

        setPreview(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!preview || !onUpload || loading) {
            return;
        }

        try {
            await onUpload({
                productId,
                file: preview.file,
            });

            // Only clear the selected image after
            // the upload has completed successfully.
            clearPreview();
        } catch (error) {
            console.error(
                "Failed to upload image:",
                error
            );
        }
    };

    return (
        <section className="product-image-upload">
            <div className="product-image-upload__header">
                <div>
                    <p className="product-image-upload__eyebrow">
                        Media
                    </p>

                    <h3 className="product-image-upload__title">
                        Product Images
                    </h3>
                </div>
            </div>

            <div className="product-image-upload__content">

                {/* Saved product images */}
                {images.length > 0 && (
                    <div className="product-image-upload__grid">
                        {images.map((image) => (
                            <div
                                className="product-image-upload__image"
                                key={image.id}
                            >
                                <img
                                    src={getImageUrl(image)}
                                    alt="Product"
                                />

                                {onRemove && (
                                    <button
                                        type="button"
                                        className="product-image-upload__remove"
                                        onClick={() =>
                                            onRemove(image.id)
                                        }
                                        aria-label="Remove image"
                                    >
                                        <X
                                            size={13}
                                            strokeWidth={2}
                                        />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Selected image preview */}
                {preview && (
                    <div className="product-image-upload__preview">
                        <img
                            src={preview.url}
                            alt="Selected product"
                        />

                        <div className="product-image-upload__preview-info">
                            <span>
                                {preview.file.name}
                            </span>

                            <small>
                                {(
                                    preview.file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)}{" "}
                                MB
                            </small>
                        </div>

                        <button
                            type="button"
                            className="product-image-upload__clear"
                            onClick={clearPreview}
                            disabled={loading}
                            aria-label="Remove selected image"
                        >
                            <X
                                size={14}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                )}

                {/* Hidden file input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="product-image-upload__input"
                    onChange={handleFileChange}
                />

                {/* Choose image */}
                <button
                    type="button"
                    className="product-image-upload__dropzone"
                    onClick={() =>
                        inputRef.current?.click()
                    }
                    disabled={loading}
                >
                    <div className="product-image-upload__upload-icon">
                        {preview ? (
                            <Upload
                                size={19}
                                strokeWidth={1.8}
                            />
                        ) : (
                            <ImagePlus
                                size={19}
                                strokeWidth={1.8}
                            />
                        )}
                    </div>

                    <span className="product-image-upload__upload-title">
                        {preview
                            ? "Choose another image"
                            : "Upload product image"}
                    </span>

                    <span className="product-image-upload__upload-text">
                        PNG, JPG, JPEG or WEBP
                    </span>
                </button>

                {/* Upload selected image */}
                {preview && (
                    <button
                        type="button"
                        className="product-image-upload__submit"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload Image"}
                    </button>
                )}
            </div>
        </section>
    );
};

export default ProductImageUpload;
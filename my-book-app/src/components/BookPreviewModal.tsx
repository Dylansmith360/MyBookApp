import React, { useEffect } from "react";

// Props for the BookPreviewModal component
interface BookPreviewModalProps {
  previewUrl: string;
  onClose: () => void;
}

// Component to display a book preview in a modal
const BookPreviewModal: React.FC<BookPreviewModalProps> = ({ previewUrl, onClose }) => {
  const isGoogleBooks = previewUrl.includes("books.google.com");

  useEffect(() => {
    // Handle the Escape key to close the modal
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Book Preview">
      <div className="bg-gray-900 rounded-lg p-4 max-w-4xl w-full max-h-full overflow-hidden relative">
        <button onClick={onClose} aria-label="Close preview" className="absolute top-2 right-2 text-gray-200 hover:text-white">✕</button>
        {isGoogleBooks ? (
          <div className="w-full h-[80vh] flex flex-col items-center justify-center text-gray-200">
            <p className="mb-4 text-center">
              Preview cannot be embedded in this browser due to security restrictions.
            </p>
            <button
              onClick={() => window.open(previewUrl, "_blank")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Open Preview in New Tab
            </button>
          </div>
        ) : (
          <iframe 
            src={previewUrl} 
            title="Book Preview" 
            className="w-full h-[80vh] border-none rounded"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default BookPreviewModal;

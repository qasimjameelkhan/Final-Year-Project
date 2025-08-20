import React from "react";

const DialogBox = ({ open, onClose, textMessage, setTextMessage, onSend }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 animate-fade-in">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Send a Message
          </h2>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write your message..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={onSend}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;

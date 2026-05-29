import React, { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

const SubmissionModal = ({ submission, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: submission.name,
    score: submission.score,
    notes: submission.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sửa Bản Ghi</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Preview */}
          {submission.file && (
            <div className="mb-4">
              {submission.file.fileType && submission.file.fileType.startsWith('image/') ? (
                <img
                  src={submission.file.url}
                  alt="Submission"
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-gray-600">File: {submission.file.fileType || 'Không xác định'}</p>
                </div>
              )}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Game</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm</label>
            <input
              type="number"
              name="score"
              min="0"
              max="500"
              value={formData.score}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <FiSave /> Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;

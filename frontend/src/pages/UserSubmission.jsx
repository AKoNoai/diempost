import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiSend, FiList, FiCalendar } from 'react-icons/fi';
import { submissionsAPI } from '../services/api';

const UserSubmission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    score: '',
    file: null
  });
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setFileType(file.type);
        setFormData({ ...formData, file: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.score || !formData.file) {
      toast.error('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    setLoading(true);
    try {
      await submissionsAPI.create({
        name: formData.name,
        score: parseInt(formData.score),
        file: formData.file,
        fileType: fileType
      });

      toast.success('Gửi thành công! Cảm ơn bạn đã tham gia.');
      setFormData({
        name: '',
        score: '',
        file: null
      });
      setFilePreview(null);
      setFileType(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi gửi dữ liệu');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Gửi Điểm</h2>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => navigate('/pokemon')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition text-sm sm:text-base"
              >
                <FiCalendar /> Lịch x10 Poke
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition text-sm sm:text-base"
              >
                <FiList /> Bảng Xếp Hạng
              </button>
            </div>
          </div>
        </nav>

        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Gửi Điểm</h1>
              <p className="text-gray-600">Hiển bằng tên, điểm của user</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-center">
                  {filePreview ? (
                    <div className="w-full p-4 border-2 border-purple-200 rounded-lg cursor-pointer hover:opacity-90 transition bg-purple-50">
                      {fileType && fileType.startsWith('image/') ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                      ) : (
                        <div className="text-4xl mb-2">📄</div>
                      )}
                      <p className="text-sm text-gray-700 font-medium truncate">{formData.file ? 'File được chọn' : 'Không xác định'}</p>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-3 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition bg-purple-50">
                      <FiUpload className="text-4xl text-purple-400 mb-2" />
                      <p className="text-gray-600 font-medium">Gửi ảnh, Word, Excel...</p>
                      <p className="text-xs text-gray-400">JPG, PNG, PDF, DOC, XLS, etc.</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Điểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điểm</label>
                <div className="relative">
                  <input
                    type="number"
                    name="score"
                    min="0"
                    max="500"
                    value={formData.score}
                    onChange={handleInputChange}
                    placeholder="Nhập điểm (0-500)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tên Game */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Game</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiSend />
                {loading ? 'Đang gửi...' : 'Gửi cho Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSubmission;

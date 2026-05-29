import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { adminAPI } from '../services/api';

const PublicLeaderboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSubmissions('', '', '', 20, currentPage);
      setSubmissions(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Lỗi tải dữ liệu');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return '✅ Đã duyệt';
      case 'pending': return '⏳ Chờ xử lý';
      case 'rejected': return '❌ Từ chối';
      default: return status;
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Bảng Xếp Hạng</h1>
            <p className="text-gray-600">Danh sách những người đã gửi điểm</p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FiSearch /> Tìm
              </button>
              <button
                type="button"
                onClick={fetchSubmissions}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FiRefreshCw /> Làm mới
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <FiRefreshCw className="text-2xl text-gray-400 animate-spin inline-block" />
                <p className="text-gray-600 mt-2">Đang tải...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có bản ghi nào</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">🥇 STT</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">📊 Điểm</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">📧 Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">📅 Ngày gửi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {submissions.map((sub, idx) => (
                        <tr key={sub._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{(currentPage - 1) * 20 + idx + 1}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{sub.name}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="text-lg font-bold text-blue-600">{sub.score}</span>
                            <span className="text-xs text-gray-500">/100</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sub.email || '-'}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                              {getStatusText(sub.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  {submissions.map((sub, idx) => (
                    <div key={sub._id} className="border-b p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-lg text-gray-800">#{(currentPage - 1) * 20 + idx + 1}</p>
                          <p className="text-sm font-semibold text-gray-700">{sub.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                          {getStatusText(sub.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <p className="text-gray-500">Điểm</p>
                          <p className="text-lg font-bold text-blue-600">{sub.score}/100</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="truncate">{sub.email || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-500">Ngày gửi</p>
                          <p>{new Date(sub.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition text-sm ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              📊 Tổng cộng: <span className="font-bold text-blue-600">{submissions.length}</span> bản ghi trang này
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicLeaderboard;

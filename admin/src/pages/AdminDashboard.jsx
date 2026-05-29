import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FiLogOut, FiEdit2, FiTrash2, FiImage, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { adminAPI } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, approved: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  useEffect(() => {
    console.log('AdminDashboard mounted, token:', token);
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
    fetchStats();
  }, [currentPage, statusFilter]);

  const fetchSubmissions = async () => {
    if (!token) {
      console.log('No token, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching submissions with token:', token);
      const response = await adminAPI.getSubmissions(
        token,
        statusFilter,
        searchTerm,
        20,
        currentPage
      );
      console.log('Fetch success:', response.data);
      setSubmissions(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Lỗi tải dữ liệu');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const response = await adminAPI.getStats(token);
      setStats(response.data.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSubmissions();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await adminAPI.deleteSubmission(token, id);
        toast.success('Xóa thành công');
        fetchSubmissions();
        fetchStats();
      } catch (error) {
        toast.error('Lỗi xóa dữ liệu');
      }
    }
  };

  const handleEdit = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleSaveSubmission = async (updatedData) => {
    try {
      await adminAPI.updateSubmission(token, selectedSubmission._id, updatedData);
      toast.success('Cập nhật thành công');
      setShowModal(false);
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      toast.error('Lỗi cập nhật dữ liệu');
    }
  };

  const handleAdminImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleAdminImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setLoading(true);
        await adminAPI.createSubmission({
          name: 'Post từ Admin',
          score: 0,
          file: reader.result,
          fileType: file.type,
          isAdminPost: true,
        });
        toast.success('Gửi hình ảnh thành công');
        fetchSubmissions();
        fetchStats();
      } catch (error) {
        console.error('Upload image error:', error);
        toast.error('Lỗi gửi hình ảnh');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm sm:text-base">Welcome, {admin.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Tổng cộng</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Chấp nhận</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
                >
                  <FiSearch /> Tìm
                </button>
              </form>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAdminImageChange}
              />

              {/* Image Upload Button */}
              <button
                type="button"
                onClick={handleAdminImageClick}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
              >
                <FiImage /> Hình ảnh
              </button>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                  statusFilter === ''
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setStatusFilter('approved');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                  statusFilter === 'approved'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <FiRefreshCw className="text-2xl text-gray-400 animate-spin" />
                </div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Tên Game</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Điểm</th>

                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Ngày</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-800">{submission.name}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-800">{submission.score}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                          {new Date(submission.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex gap-1">
                          <button
                            onClick={() => handleEdit(submission)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 transition text-xs"
                          >
                            <FiEdit2 /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(submission._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 transition text-xs"
                          >
                            <FiTrash2 /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setShowModal(false)}
          onSave={handleSaveSubmission}
        />
      )}
    </>
  );
};

export default AdminDashboard;

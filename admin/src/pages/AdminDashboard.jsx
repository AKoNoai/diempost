import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiSearch,
  FiRefreshCw,
  FiUpload,
  FiGrid,
  FiFileText,
} from 'react-icons/fi';
import { adminAPI, pokemonAPI } from '../services/api';
import SubmissionModal from '../components/SubmissionModal';

const WEEK_LABELS = Array.from({ length: 10 }, (_, index) => index + 1);

const FALLBACK_POKEMON_WEEKS = {
  1: ['Diancie', 'Deoxys', 'Hooh', 'Terrakion', 'Xukitree', 'Poipole', "Jessie's Arbok"],
  2: ['Genesct', 'Lõi Zygarde', 'Groudon', 'Cobalion', "Rocket's Wobbuffet", "Jame's Mareanie", "Agatha's Gengar"],
  3: ['Jirachi', 'Tapukoko', 'Greninja Bond', 'Zeraora', 'tapulele', 'Metagross', 'ASH Sonolax'],
  4: ['Latios', 'Tapufini', 'Keldeo', 'Creslia', 'Tapubulu', "Misty's Psyduck", "Lance's Dragonite"],
  5: ['Latias', 'Sakatakata', 'Thần Gió', 'Buzzwole', 'Heatran', "Jessie's Mimikyu", 'Regigiges'],
  6: ['Pailkia', 'Mashadow', 'Raikou', 'Megeana', 'Meloetta', "Rocket's Mewth"],
  7: ['Zorua', 'Solgalion', 'Blacephanlon', 'Celesteela', 'ASh Haqlucha', "Jame's Weezing", 'Suicun'],
  8: ['Celibi', 'Yveltal', 'Thần Điện', 'Nilihego', 'Thần Đất', 'ASH Thằn lằn cỏ', 'Azelf'],
  9: ['Silvaly', 'Dianlga', 'Xemeas', 'Uxie', 'Kartana', 'Mepist', "Misty's Starnie"],
  10: ['vitini', 'Lunala', 'Vocalion', 'Drakrai', 'Thánh Kiếm cỏ', "Brock's Steelix"],
};

const normalizeName = (name) => String(name || '').trim().toLowerCase();

const getPokemonNamePool = (weeks) => Object.values(weeks || {}).flat();

const isPokemonSubmissionName = (submissionName, weeks) => {
  const target = normalizeName(submissionName);
  if (!target) return false;

  return getPokemonNamePool(weeks).some((pokemonName) => normalizeName(pokemonName) === target);
};

const normalizePokemonResponse = (payload) => {
  const entries = Array.isArray(payload)
    ? payload
    : Object.values(payload || {}).filter((value) => value && typeof value === 'object' && 'name' in value);

  return entries.map((item) => item?.name?.trim()).filter(Boolean);
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, approved: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState([]);
  const [pokemonWeek, setPokemonWeek] = useState(4);
  const [pokemonLoading, setPokemonLoading] = useState(false);
  const [pokemonError, setPokemonError] = useState('');
  const [pokemonWeeks, setPokemonWeeks] = useState(FALLBACK_POKEMON_WEEKS);
  const [pokemonPosts, setPokemonPosts] = useState([]);
  const imageInputRef = useRef(null);
  const pokemonImageInputRef = useRef(null);
  const pokemonUploadTargetRef = useRef('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const admin = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchSubmissions();
    fetchStats();
    fetchPokemonPosts();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (activeTab === 'pokemon') {
      loadPokemonWeek(pokemonWeek);
      fetchPokemonPosts();
    }
  }, [activeTab, pokemonWeek]);

  const fetchSubmissions = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await adminAPI.getSubmissions(token, statusFilter, searchTerm, 20, currentPage);
      setSubmissions(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Lỗi tải dữ liệu');
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

  const fetchPokemonPosts = async () => {
    try {
      const response = await adminAPI.getAdminPosts(200);
      setPokemonPosts(response.data.data || []);
    } catch (error) {
      console.error('Pokemon posts error:', error);
    }
  };

  const loadPokemonWeek = async (week) => {
    setPokemonLoading(true);
    setPokemonError('');

    try {
      const response = await pokemonAPI.getWeek(week);
      const names = normalizePokemonResponse(response.data);

      if (names.length > 0) {
        setPokemonWeeks((current) => ({ ...current, [week]: names }));
      } else {
        setPokemonError('Không có dữ liệu tuần này từ nguồn live, đang dùng dữ liệu dự phòng.');
      }
    } catch (error) {
      console.error('Load pokemon week error:', error);
      setPokemonError('Không tải được dữ liệu live, đang dùng dữ liệu dự phòng.');
    } finally {
      setPokemonLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchSubmissions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;

    try {
      await adminAPI.deleteSubmission(token, id);
      toast.success('Xóa thành công');
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      toast.error('Lỗi xóa dữ liệu');
    }
  };

  const handleToggleSubmission = (submissionId) => {
    setSelectedSubmissionIds((current) =>
      current.includes(submissionId)
        ? current.filter((id) => id !== submissionId)
        : [...current, submissionId]
    );
  };

  const handleSelectAllVisible = (submissionList) => {
    const visibleIds = submissionList.map((submission) => submission._id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSubmissionIds.includes(id));

    setSelectedSubmissionIds(allSelected ? [] : visibleIds);
  };

  const handleBulkDelete = async () => {
    if (selectedSubmissionIds.length === 0) return;
    if (!window.confirm(`Bạn chắc chắn muốn xóa ${selectedSubmissionIds.length} mục đã chọn?`)) return;

    try {
      await Promise.allSettled(selectedSubmissionIds.map((id) => adminAPI.deleteSubmission(token, id)));
      toast.success('Đã xóa các mục đã chọn');
      setSelectedSubmissionIds([]);
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Lỗi xóa dữ liệu');
    }
  };

  const handleDeletePokemonImage = async (postId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hình Pokemon này?')) return;

    try {
      await adminAPI.deleteSubmission(token, postId);
      toast.success('Đã xóa hình Pokemon');
      fetchPokemonPosts();
      fetchSubmissions();
    } catch (error) {
      console.error('Delete pokemon image error:', error);
      toast.error('Lỗi xóa hình Pokemon');
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
          name: 'Poster từ Admin',
          score: 0,
          file: reader.result,
          fileType: file.type,
          isAdminPost: true,
        });
        toast.success('Gửi hình ảnh thành công');
        fetchSubmissions();
        fetchStats();
        fetchPokemonPosts();
      } catch (error) {
        console.error('Upload image error:', error);
        toast.error('Lỗi gửi hình ảnh');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const getPokemonImageByName = (name) => {
    const target = normalizeName(name);
    const found = [...pokemonPosts]
      .filter((post) => normalizeName(post.name) === target && post.file?.url)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    return found?.file?.url || null;
  };

  const handlePokemonImageClick = (pokemonName) => {
    pokemonUploadTargetRef.current = pokemonName;
    pokemonImageInputRef.current?.click();
  };

  const handlePokemonImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    const pokemonName = pokemonUploadTargetRef.current;
    if (!pokemonName) {
      toast.error('Không xác định được Pokemon cần upload');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setPokemonLoading(true);
        await adminAPI.createSubmission({
          name: pokemonName,
          score: 0,
          file: reader.result,
          fileType: file.type,
          isAdminPost: true,
        });
        toast.success('Thêm hình Pokemon thành công');
        fetchPokemonPosts();
      } catch (error) {
        console.error('Upload pokemon image error:', error);
        toast.error('Lỗi gửi hình ảnh');
      } finally {
        setPokemonLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  const visibleSubmissions = submissions.filter((submission) => !isPokemonSubmissionName(submission.name, pokemonWeeks));
  const allVisibleSelected = visibleSubmissions.length > 0
    && visibleSubmissions.every((submission) => selectedSubmissionIds.includes(submission._id));

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
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
          <div className="mb-6 rounded-2xl bg-white shadow p-2 flex gap-2 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('submissions')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'submissions'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <FiFileText /> Submissions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pokemon')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeTab === 'pokemon'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              <FiGrid /> Hình Pokemon
            </button>
          </div>

          {activeTab === 'submissions' ? (
            <>
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

              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
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

                  <button
                    type="button"
                    onClick={handleAdminImageClick}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
                  >
                    <FiImage /> Ảnh poster
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setStatusFilter('');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg transition text-sm sm:text-base ${statusFilter === ''
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
                    className={`px-4 py-2 rounded-lg transition text-sm sm:text-base ${statusFilter === 'approved'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Approved
                  </button>

                  {visibleSubmissions.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectAllVisible(visibleSubmissions)}
                        className={`px-4 py-2 rounded-lg transition text-sm sm:text-base ${allVisibleSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {allVisibleSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkDelete}
                        disabled={selectedSubmissionIds.length === 0}
                        className="px-4 py-2 rounded-lg transition text-sm sm:text-base bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                      >
                        Xóa đã chọn ({selectedSubmissionIds.length})
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <FiRefreshCw className="text-2xl text-gray-400 animate-spin" />
                    </div>
                    <p className="text-gray-600">Đang tải...</p>
                  </div>
                ) : visibleSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Không có dữ liệu</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 w-12">
                            <input
                              type="checkbox"
                              checked={allVisibleSelected}
                              onChange={() => handleSelectAllVisible(visibleSubmissions)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Tên Game</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Điểm</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Ngày</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {visibleSubmissions.map((submission) => (
                          <tr key={submission._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                              <input
                                type="checkbox"
                                checked={selectedSubmissionIds.includes(submission._id)}
                                onChange={() => handleToggleSubmission(submission._id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
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

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition text-sm ${currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <input
                ref={pokemonImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePokemonImageChange}
              />

              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {WEEK_LABELS.map((week) => (
                    <button
                      key={week}
                      type="button"
                      onClick={() => setPokemonWeek(week)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${pokemonWeek === week
                          ? 'bg-red-500 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Tuần {week}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hình Pokemon</h2>
                    <p className="text-sm text-gray-500">Chọn tuần và tải hình cho từng Pokemon</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadPokemonWeek(pokemonWeek)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    <FiRefreshCw className={pokemonLoading ? 'animate-spin' : ''} />
                    Tải lại
                  </button>
                </div>

                {pokemonError ? (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {pokemonError}
                  </div>
                ) : null}

                {pokemonLoading ? (
                  <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(pokemonWeeks[pokemonWeek] || []).map((pokemonName) => {
                      const pokemonPost = [...pokemonPosts]
                        .filter((post) => normalizeName(post.name) === normalizeName(pokemonName) && post.file?.url)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                      const imageUrl = pokemonPost?.file?.url || null;
                      const initials = pokemonName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('');

                      return (
                        <div key={`${pokemonWeek}-${pokemonName}`} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                          <div className="h-48 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                            {imageUrl ? (
                              <img src={imageUrl} alt={pokemonName} className="h-full w-full object-cover" />
                            ) : (
                              <div className="text-center text-gray-400">
                                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-500">
                                  {initials || 'P'}
                                </div>
                                <div className="text-sm font-medium">Chưa có hình</div>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h3 className="text-base font-bold text-gray-800">{pokemonName}</h3>
                            <p className="text-sm text-gray-400 mb-4">Tuần {pokemonWeek}</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handlePokemonImageClick(pokemonName)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
                              >
                                <FiUpload /> {imageUrl ? 'Đổi hình' : 'Thêm hình'}
                              </button>
                              {pokemonPost ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePokemonImage(pokemonPost._id)}
                                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                                >
                                  <FiTrash2 /> Xóa
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {showModal && (
            <SubmissionModal
              submission={selectedSubmission}
              onClose={() => setShowModal(false)}
              onSave={handleSaveSubmission}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShareAlt, FaBookOpen, FaFrown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/Auth'; // Import fungsi pengecekan login

function Article() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inisialisasi navigate

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/article`;
        const response = await axios.get(url);
        setPosts(response.data.data);
      } catch (error) {
        console.error(error);
        setError('Gagal mengambil data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleWriteArticleClick = () => {
    const loggedIn = isAuthenticated();
    if (loggedIn) {
      navigate('/my/author/dashboard');
    } else {
      alert('Anda harus login terlebih dahulu untuk membuat artikel.');
      navigate('/auth/login');
    }
  };

  const handleShare = (title) => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(`${title} - ${shareUrl}`);
    alert('Link artikel berhasil disalin!');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-100">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 mt-3">
        ARTIKEL
      </h1>

      {/* Banner Ajak Menulis */}
      <div className="bg-blue-600 text-white p-4 md:p-6 rounded-lg shadow-lg mb-8 text-center hover:shadow-xl hover:bg-blue-700 transition">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Ingin Berkontribusi? Tulis Artikelmu di Sini!
        </h2>
        <p className="mb-4 text-sm md:text-base">
          Bagikan pengetahuan dan pengalamanmu dengan kami. Klik tombol di bawah ini dan mulai menulis sekarang!
        </p>
        <button
          onClick={handleWriteArticleClick}
          className="bg-white text-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Mulai Menulis
        </button>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 p-14 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-10 pt-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={post.coverImageUrl || 'https://placehold.co/400x300'}
                      alt={post.judul}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mt-3">
                    {post.judul}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {new Date(post.createdAt).toLocaleDateString('id-ID')}{' '}
                    <span className="text-red-500">•</span> 0 Komentar
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="bg-blue-700 text-white px-3 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-500 transition"
                      onClick={() => navigate(`/article/${post._id}`)}
                    >
                      <FaBookOpen />
                      <span>Baca</span>
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-3 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-400 transition"
                      onClick={() => handleShare(post.judul)}
                    >
                      <FaShareAlt />
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyArticleMessage />
            )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 animate-pulse">
      <div className="w-full h-32 sm:h-40 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
    </div>
  );
}

function EmptyArticleMessage() {
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md">
      <FaFrown className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Mohon Maaf, Belum Ada Artikel yang Tersedia
      </h2>
      <p className="text-gray-600 mb-4">
        Kami sedang menunggu kontribusi dari penulis hebat seperti Anda. Yuk, tulis artikel dan bagikan pengalaman Anda!
      </p>
      <Link
        to="/my/author/add-article"
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        Tulis Artikel Pertama
      </Link>
    </div>
  );
}

export default Article;

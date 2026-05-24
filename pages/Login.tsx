import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoadingLogin(true);
    setError('');
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Gagal masuk dengan Google. Silakan coba lagi.');
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-full w-full bg-gradient-to-br from-[#0a192f] via-primary to-[#112240] text-gray-100 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Login <span className="text-accent">SIWITA</span>
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sistem Informasi Widyaiswara Indonesia Terpadu
          </p>
        </div>
        
        <div className="space-y-6">
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoadingLogin}
              className="relative flex justify-center items-center w-full px-4 py-3 text-sm font-medium text-white border border-transparent rounded-md group bg-secondary hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoadingLogin ? 'Memproses...' : 'Masuk dengan Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
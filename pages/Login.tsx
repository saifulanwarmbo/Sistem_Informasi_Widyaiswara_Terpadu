import React, { useState } from 'react';
import logoLan from '../assets/logo-lan.png';
const bgLan = '/lan_building_bg.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';



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
      
      // Arahkan pengguna ke halaman dashboard setelah berhasil login
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error("Login error details:", err);
      
      // Handle explicit Firebase Auth errors
      if (err instanceof FirebaseError || err?.code) {
        switch (err.code) {
          case 'auth/unauthorized-domain':
            setError(`Domain ini (${window.location.hostname}) belum diizinkan. Tambahkan domain ini ke Firebase Console > Authentication > Settings > Authorized domains.`);
            break;
          case 'auth/popup-closed-by-user':
            setError('Login dibatalkan (Popup ditutup). Silakan coba lagi.');
            break;
          case 'auth/popup-blocked':
            setError('Popup diblokir oleh browser. Izinkan popup untuk website ini dan coba lagi.');
            break;
          case 'auth/network-request-failed':
            setError('Koneksi internet bermasalah. Periksa jaringan Anda.');
            break;
          default:
            setError(`Gagal masuk dengan Google (${err.code}). Silakan coba lagi.`);
        }
      } else {
        setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
      }
    } finally {
      setIsLoadingLogin(false);
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${bgLan})` }}
    >
      {/* Improved Dark overlay for a premium professional look */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-800/80"></div>
      
      {/* Subtle modern glowing orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Enhanced Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/50">
        <div className="text-center">
          <div className="flex justify-center mb-8 relative">
            {/* Soft glow behind the logo */}
            <div className="absolute inset-0 bg-white/60 blur-3xl rounded-full scale-[2.0] -z-10"></div>
            <img src={logoLan} onError={(e) => { e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1554355505_Logo-LAN-Baru-Transparan.png/320px-1554355505_Logo-LAN-Baru-Transparan.png"; e.currentTarget.onerror = null; }} alt="Logo LAN RI" fetchPriority="high" loading="eager" className="relative h-28 md:h-32 w-auto object-contain" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Login <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-600">SIWITA</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
            Sistem Informasi Widyaiswara<br/>Indonesia Terpadu
          </p>
        </div>
        
        <div className="space-y-6 pt-2">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoadingLogin}
              className="relative flex justify-center items-center w-full px-4 py-3.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLoadingLogin ? 'Memproses...' : 'Lanjutkan dengan Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
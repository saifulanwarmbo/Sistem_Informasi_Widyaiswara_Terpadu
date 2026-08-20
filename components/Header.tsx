
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompetency } from '../contexts/CompetencyContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { ICONS } from '../constants';
import logoLan from '../assets/logo-lan.png';


interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isLoggedIn, user } = useAuth();
  const { notifications, markNotificationRead } = useCompetency();
  const { profiles, organizations } = useWidyaiswara();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { profiles: [], orgs: [] };
    const query = searchQuery.toLowerCase();
    return {
      profiles: profiles.filter(p => p.name.toLowerCase().includes(query) || p.nip.includes(query)).slice(0, 5),
      orgs: organizations.filter(o => o.name.toLowerCase().includes(query)).slice(0, 3)
    };
  }, [searchQuery, profiles, organizations]);

  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="print:hidden bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-sm h-20 flex items-center justify-between px-6 relative z-20">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-500 hover:text-gray-700 md:hidden focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
            <img src={logoLan} onError={(e) => { e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1554355505_Logo-LAN-Baru-Transparan.png/320px-1554355505_Logo-LAN-Baru-Transparan.png"; e.currentTarget.onerror = null; }} alt="Logo LAN RI" fetchPriority="high" loading="eager" className="h-10 w-auto object-contain md:hidden" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden lg:block whitespace-nowrap overflow-hidden text-ellipsis">Sistem Informasi Widyaiswara Indonesia Terpadu</h2>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block lg:hidden">SIWITA</h2>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
            placeholder="Cari profil, instansi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
        </div>
        
        {showSearchResults && searchQuery.trim() !== '' && (
          <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
            {searchResults.profiles.length === 0 && searchResults.orgs.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">Tidak ada hasil ditemukan</div>
            ) : (
              <div className="py-2">
                {searchResults.profiles.length > 0 && (
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Profil Widyaiswara</h3>
                    <ul className="space-y-1">
                      {searchResults.profiles.map(profile => (
                        <li key={profile.id}>
                          <Link to={`/profiles?search=${encodeURIComponent(profile.name)}`} className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <div className="font-medium">{profile.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{profile.organization}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {searchResults.orgs.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Instansi / Organisasi</h3>
                    <ul className="space-y-1">
                      {searchResults.orgs.map(org => (
                        <li key={org.id}>
                          <Link to={`/organizations?search=${encodeURIComponent(org.name)}`} className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <div className="font-medium">{org.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{org.total} Widyaiswara</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
        {isLoggedIn ? (
          <>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="py-2 px-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">Notifikasi</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-4 text-sm text-gray-500 text-center">Belum ada notifikasi.</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`py-3 px-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            if (!notif.read) markNotificationRead(notif.id);
                          }}
                        >
                          <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={user?.photoURL || "https://picsum.photos/seed/admin/100"}
              alt="User profile"
            />
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-secondary">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
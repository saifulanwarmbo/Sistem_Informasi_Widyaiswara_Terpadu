
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompetency } from '../contexts/CompetencyContext';
import { ICONS } from '../constants';

const Header: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { notifications, markNotificationRead } = useCompetency();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-6 relative z-20">
      <h2 className="text-xl font-semibold text-gray-700">Sistem Informasi Widyaiswara Indonesia Terpadu</h2>
      <div className="flex items-center space-x-4">
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
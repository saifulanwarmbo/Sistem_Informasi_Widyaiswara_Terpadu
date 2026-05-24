import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { path: '/profiles', label: 'Profil Widyaiswara', icon: ICONS.profiles },
  { path: '/job-tiers', label: 'Jenjang Jabatan', icon: ICONS.tiers },
  { path: '/organizations', label: 'Instansi', icon: ICONS.organizations },
  { path: '/development-hub', label: 'Pengembangan Profesi', icon: ICONS.development },
  { path: '/self-registration', label: 'Registrasi Mandiri', icon: ICONS.selfRegister },
  { path: '/competency-test', label: 'Uji Kompetensi', icon: ICONS.document },
];

const adminNavItems = [
    { path: '/input-data', label: 'Input Data', icon: ICONS.inputData },
    { path: '/verify-competency', label: 'Verifikasi Uji Kompetensi', icon: ICONS.document },
];

const Sidebar: React.FC = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/dashboard');
  }

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-secondary hover:text-white transition-colors duration-200 rounded-md";
  const activeLinkClasses = "bg-secondary text-white border-l-4 border-accent rounded-none";

  return (
    <div className="hidden md:flex flex-col w-64 bg-primary text-white">
      <div className="flex items-center justify-center h-20 border-b border-blue-800">
        <h1 className="text-2xl font-bold tracking-wider">SIWITA</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
        {isLoggedIn && isAdmin && (
            <>
                <hr className="my-3 border-blue-700"/>
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Admin Menu</p>
                {adminNavItems.map(item => (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </NavLink>
                ))}
            </>
        )}
      </nav>
       <div className="px-4 py-4 border-t border-blue-800">
          {isLoggedIn && (
             <button onClick={handleLogout} className="w-full text-left flex items-center px-2 py-2 text-gray-300 hover:bg-red-700 hover:text-white rounded-md transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="ml-3">Logout</span>
             </button>
          )}
          <p className="text-xs text-gray-400 mt-4">&copy; 2025. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
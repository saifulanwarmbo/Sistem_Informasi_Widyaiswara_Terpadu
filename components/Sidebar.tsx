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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/dashboard');
      if (window.innerWidth < 768) setIsOpen(false);
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-secondary hover:text-white transition-colors duration-200 rounded-md";
  const activeLinkClasses = "bg-secondary text-white border-l-4 border-accent rounded-none";

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out flex flex-col
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between px-4 h-20 border-b border-blue-800">
        <div className="flex items-center justify-center gap-3 w-full">
          <img src="/logo.svg" alt="SIWITA Logo" className="h-10 w-10 drop-shadow-md" />
          <h1 className="text-2xl font-bold tracking-wider">SIWITA</h1>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-300 hover:text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
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
                        onClick={handleLinkClick}
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
          <div className="text-xs text-gray-400 mt-4">
            <p>Dev by Saiful Anwar</p>
            <p>@ 2026 All Right Reserved</p>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
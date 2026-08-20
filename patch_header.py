import os

with open('components/Header.tsx', 'r') as f:
    content = f.read()

import_target = "import React, { useState } from 'react';"
import_replacement = "import React, { useState, useEffect } from 'react';"
content = content.replace(import_target, import_replacement)

state_target = """  const [showNotifications, setShowNotifications] = useState(false);"""
state_replacement = """  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };"""
content = content.replace(state_target, state_replacement)

button_target = """      <div className="flex items-center space-x-4">"""
button_replacement = """      <div className="flex items-center space-x-4">
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
        </button>"""
content = content.replace(button_target, button_replacement)

header_tag_target = """<header className="print:hidden bg-white shadow-sm h-20 flex items-center justify-between px-6 relative z-20">"""
header_tag_replacement = """<header className="print:hidden bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-sm h-20 flex items-center justify-between px-6 relative z-20">"""
content = content.replace(header_tag_target, header_tag_replacement)

h2_target = """<h2 className="text-xl font-bold text-gray-800 hidden lg:block whitespace-nowrap overflow-hidden text-ellipsis">Sistem Informasi Widyaiswara Indonesia Terpadu</h2>"""
h2_replacement = """<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden lg:block whitespace-nowrap overflow-hidden text-ellipsis">Sistem Informasi Widyaiswara Indonesia Terpadu</h2>"""
content = content.replace(h2_target, h2_replacement)

h2_mobile_target = """<h2 className="text-xl font-bold text-gray-800 hidden sm:block lg:hidden">SIWITA</h2>"""
h2_mobile_replacement = """<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block lg:hidden">SIWITA</h2>"""
content = content.replace(h2_mobile_target, h2_mobile_replacement)

with open('components/Header.tsx', 'w') as f:
    f.write(content)

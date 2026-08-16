const fs = require('fs');

// Patch Sidebar
let sidebar = fs.readFileSync('components/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace('<aside className={`', '<aside className={`print:hidden ');
fs.writeFileSync('components/Sidebar.tsx', sidebar);

// Patch Header
let header = fs.readFileSync('components/Header.tsx', 'utf8');
header = header.replace('<header className="', '<header className="print:hidden ');
fs.writeFileSync('components/Header.tsx', header);


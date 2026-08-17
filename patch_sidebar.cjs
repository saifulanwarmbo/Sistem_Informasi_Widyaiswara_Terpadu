const fs = require('fs');
let file = fs.readFileSync('components/Sidebar.tsx', 'utf8');
const target = "{ path: '/development-hub', label: 'Pengembangan Profesi', icon: ICONS.development },";
const replacement = "{ path: '/development-hub', label: 'Pengembangan Profesi', icon: ICONS.development },\n  { path: '/community-of-practices', label: 'Community of Practices', icon: ICONS.users },";
file = file.replace(target, replacement);
fs.writeFileSync('components/Sidebar.tsx', file);

const fs = require('fs');

const filesToPatch = [
  { path: 'components/Header.tsx', importPath: '../assets/logo-lan.png' },
  { path: 'components/Sidebar.tsx', importPath: '../assets/logo-lan.png' },
  { path: 'pages/Login.tsx', importPath: '../assets/logo-lan.png' }
];

filesToPatch.forEach(file => {
  let content = fs.readFileSync(file.path, 'utf8');
  // Replace const logoLan = '/logo-lan.png'; with import logoLan from 'importPath';
  content = content.replace(/const logoLan = '\/logo-lan\.png';/g, \`import logoLan from '\${file.importPath}';\`);
  
  // Add robust onerror fallback to the img tag
  const fallbackUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1554355505_Logo-LAN-Baru-Transparan.png/320px-1554355505_Logo-LAN-Baru-Transparan.png';
  content = content.replace(/<img src={logoLan} alt="Logo LAN RI"/g, \`<img src={logoLan} onError={(e) => { e.currentTarget.src = '\${fallbackUrl}'; e.currentTarget.onerror = null; }} alt="Logo LAN RI"\`);
  
  fs.writeFileSync(file.path, content);
});

// Update index.html to have a robust favicon approach (cache busting)
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/href="\/logo-lan.png"/g, 'href="/logo-lan.png?v=5"');
html = html.replace(/href="\/favicon.ico"/g, 'href="/favicon.ico?v=5"');
html = html.replace(/href="\/favicon.png"/g, 'href="/favicon.png?v=5"');
fs.writeFileSync('index.html', html);


import os

files = [
    ('components/Header.tsx', '../assets/logo-lan.png'),
    ('components/Sidebar.tsx', '../assets/logo-lan.png'),
    ('pages/Login.tsx', '../assets/logo-lan.png')
]

fallback_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1554355505_Logo-LAN-Baru-Transparan.png/320px-1554355505_Logo-LAN-Baru-Transparan.png'
fallback_str = f'<img src={{logoLan}} onError={{(e) => {{ e.currentTarget.src = "{fallback_url}"; e.currentTarget.onerror = null; }}}} alt="Logo LAN RI"'

for filepath, import_path in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("const logoLan = '/logo-lan.png';", f"import logoLan from '{import_path}';")
    content = content.replace('<img src={logoLan} alt="Logo LAN RI"', fallback_str)
    
    with open(filepath, 'w') as f:
        f.write(content)

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace('href="/logo-lan.png"', 'href="/logo-lan.png?v=5"')
html = html.replace('href="/favicon.ico"', 'href="/favicon.ico?v=5"')
html = html.replace('href="/favicon.png"', 'href="/favicon.png?v=5"')

with open('index.html', 'w') as f:
    f.write(html)

import os

with open('server.ts', 'r') as f:
    content = f.read()

target = """    app.use(express.static(distPath));
    app.get('*all', (req, res) => {"""

replacement = """    // Serve static files with caching, EXCEPT for index.html
    app.use(express.static(distPath, {
      setHeaders: (res, path) => {
        if (path.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));
    
    app.get('*all', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');"""

content = content.replace(target, replacement)

with open('server.ts', 'w') as f:
    f.write(content)

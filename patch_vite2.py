import re

with open('vite.config.ts', 'r') as f:
    content = f.read()

# remove optimizeDeps
content = re.sub(r",\s*optimizeDeps: \{\s*include: \[[^\]]+\]\s*\}", "", content)

with open('vite.config.ts', 'w') as f:
    f.write(content)

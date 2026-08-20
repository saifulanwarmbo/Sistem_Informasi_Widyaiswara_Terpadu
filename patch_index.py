import os

with open('index.tsx', 'r') as f:
    content = f.read()

content = content.replace("const rootElement = document.getElementById('root');", "console.log('INDEX.TSX EXECUTED');\nconst rootElement = document.getElementById('root');")

with open('index.tsx', 'w') as f:
    f.write(content)

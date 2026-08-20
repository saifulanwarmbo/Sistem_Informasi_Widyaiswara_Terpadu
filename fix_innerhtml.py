import os

with open('components/ErrorBoundary.tsx', 'r') as f:
    content = f.read()

content = content.replace("d.innerHTML = 'CRASH: ' + error.message;", "d.textContent = 'CRASH: ' + error.message;")

with open('components/ErrorBoundary.tsx', 'w') as f:
    f.write(content)

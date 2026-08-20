import os

with open('index.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ToastProvider } from './contexts/ToastContext';", "import { ToastProvider } from './contexts/ToastContext';\nimport { ThemeProvider } from './contexts/ThemeContext';")

content = content.replace("<ToastProvider>", "<ThemeProvider>\n      <ToastProvider>")
content = content.replace("</ToastProvider>", "</ToastProvider>\n      </ThemeProvider>")

with open('index.tsx', 'w') as f:
    f.write(content)

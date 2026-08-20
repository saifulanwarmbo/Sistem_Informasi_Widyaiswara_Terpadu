import os

with open('components/ErrorBoundary.tsx', 'r') as f:
    content = f.read()

target = """  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }"""

replacement = """  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Force write error to document so it's visible even if React crashes completely
    const d = document.createElement('div');
    d.style.position = 'fixed';
    d.style.top = '0';
    d.style.left = '0';
    d.style.zIndex = '99999';
    d.style.background = 'red';
    d.style.color = 'white';
    d.style.padding = '20px';
    d.innerHTML = 'CRASH: ' + error.message;
    document.body.appendChild(d);
  }"""

content = content.replace(target, replacement)

with open('components/ErrorBoundary.tsx', 'w') as f:
    f.write(content)

import os

with open('components/ErrorBoundary.tsx', 'r') as f:
    content = f.read()

content = content.replace("<h1>Something went wrong.</h1>", "<h1>Something went wrong.</h1>\n          <pre style={{whiteSpace: 'pre-wrap', color: 'red'}}>{this.state.error?.message}</pre>\n          <pre style={{whiteSpace: 'pre-wrap', color: 'red'}}>{this.state.errorInfo?.componentStack}</pre>")

with open('components/ErrorBoundary.tsx', 'w') as f:
    f.write(content)

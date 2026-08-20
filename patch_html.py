import os

with open('dist/index.html', 'r') as f:
    content = f.read()

# Add script at the beginning of head
script = """
<script>
  window.onerror = function(message, source, lineno, colno, error) {
    fetch('/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message, source, lineno, colno, stack: error ? error.stack : ''})
    });
  };
  window.onunhandledrejection = function(event) {
    fetch('/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message: 'Unhandled Promise Rejection', reason: event.reason ? event.reason.stack || event.reason.message : 'Unknown'})
    });
  };
  const originalLog = console.log;
  console.log = function(...args) {
    fetch('/log', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({args})
    });
    originalLog.apply(console, args);
  };
</script>
"""

content = content.replace('<head>', '<head>' + script)

with open('dist/index.html', 'w') as f:
    f.write(content)

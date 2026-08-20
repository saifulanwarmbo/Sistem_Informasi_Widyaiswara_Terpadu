import os

with open('index.html', 'r') as f:
    content = f.read()

# Add script at the beginning of head
script = """
<script>
  window.onerror = function(message, source, lineno, colno, error) {
    console.error("GLOBAL ERROR DETECTED:", message, error);
    document.body.innerHTML += '<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:9999;padding:20px;font-family:monospace;white-space:pre-wrap;">' + 
      'CRASH DETECTED: ' + message + '<br/>' + (error ? error.stack : '') + '</div>';
  };
  window.onunhandledrejection = function(event) {
    console.error("GLOBAL PROMISE REJECTION:", event.reason);
    document.body.innerHTML += '<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:9999;padding:20px;font-family:monospace;white-space:pre-wrap;">' + 
      'PROMISE REJECTION: ' + (event.reason ? event.reason.stack || event.reason.message : 'Unknown') + '</div>';
  };
</script>
"""

content = content.replace('<head>', '<head>' + script)

with open('index.html', 'w') as f:
    f.write(content)

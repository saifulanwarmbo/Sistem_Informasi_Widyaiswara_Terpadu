import os

with open('index.html', 'r') as f:
    content = f.read()

tt_script = """
<script>
  if (window.trustedTypes && trustedTypes.createPolicy) {
    try {
      trustedTypes.createPolicy('default', {
        createHTML: (string) => string,
        createScript: (string) => string,
        createScriptURL: (string) => string
      });
    } catch (e) {
      console.warn('TrustedTypes default policy already created', e);
    }
  }
</script>
"""

content = content.replace('<head>', '<head>' + tt_script)

with open('index.html', 'w') as f:
    f.write(content)

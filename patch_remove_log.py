import os

with open('index.html', 'r') as f:
    content = f.read()

# Just remove the custom script block
start_idx = content.find('<script>')
end_idx = content.find('</script>') + 9

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open('index.html', 'w') as f:
    f.write(content)

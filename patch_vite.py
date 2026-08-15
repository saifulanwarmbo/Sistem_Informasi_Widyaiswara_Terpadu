import re

with open('vite.config.ts', 'r') as f:
    content = f.read()

content = content.replace("'motion', 'react-qr-code'", "'motion/react', 'react-qr-code'")

with open('vite.config.ts', 'w') as f:
    f.write(content)

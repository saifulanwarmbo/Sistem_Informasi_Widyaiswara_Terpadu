import os

with open('vite.config.ts', 'r') as f:
    content = f.read()

content = content.replace("JSON.stringify(env.GEMINI_API_KEY)", "JSON.stringify(env.GEMINI_API_KEY || '')")

with open('vite.config.ts', 'w') as f:
    f.write(content)

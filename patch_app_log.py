import os

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("const App: React.FC = () => {", "const App: React.FC = () => {\n  console.log('APP RENDERED');")

with open('App.tsx', 'w') as f:
    f.write(content)

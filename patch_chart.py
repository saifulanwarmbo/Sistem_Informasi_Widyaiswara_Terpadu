import os

with open('pages/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """                        <ResponsiveContainer width="100%" height={300}>"""
replacement = """                        <ResponsiveContainer width="100%" height={300} minWidth={1} minHeight={1}>"""
content = content.replace(target, replacement)

target2 = """                        <ResponsiveContainer width="100%" height="100%">"""
replacement2 = """                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>"""
content = content.replace(target2, replacement2)

with open('pages/Dashboard.tsx', 'w') as f:
    f.write(content)

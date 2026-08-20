import os

with open('components/DashboardCard.tsx', 'r') as f:
    content = f.read()

target1 = """className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between\""""
replacement1 = """className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between transition-colors duration-200\""""
content = content.replace(target1, replacement1)

target2 = """<p className="text-sm font-medium text-medium-text uppercase">{title}</p>"""
replacement2 = """<p className="text-sm font-medium text-medium-text dark:text-gray-400 uppercase">{title}</p>"""
content = content.replace(target2, replacement2)

target3 = """<p className="text-3xl font-bold text-dark-text">{value}</p>"""
replacement3 = """<p className="text-3xl font-bold text-dark-text dark:text-gray-100">{value}</p>"""
content = content.replace(target3, replacement3)

with open('components/DashboardCard.tsx', 'w') as f:
    f.write(content)

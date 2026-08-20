import os

with open('pages/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-white p-6 rounded-lg', 'bg-white dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200')
content = content.replace('text-gray-800', 'text-gray-800 dark:text-gray-100')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-gray-400')
content = content.replace('bg-gray-200 rounded-full', 'bg-gray-200 dark:bg-gray-700 rounded-full')
content = content.replace('text-gray-700', 'text-gray-700 dark:text-gray-300')
content = content.replace('text-gray-400 mr-2', 'text-gray-400 dark:text-gray-500 mr-2')

with open('pages/Dashboard.tsx', 'w') as f:
    f.write(content)

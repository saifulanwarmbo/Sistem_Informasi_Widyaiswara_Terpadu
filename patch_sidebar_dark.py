import os

with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

target1 = "bg-white text-gray-800 border-r border-gray-200"
replacement1 = "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700"
content = content.replace(target1, replacement1)

target2 = "px-4 py-6 border-b border-gray-200"
replacement2 = "px-4 py-6 border-b border-gray-200 dark:border-gray-700"
content = content.replace(target2, replacement2)

target3 = "px-4 py-4 border-t border-gray-200"
replacement3 = "px-4 py-4 border-t border-gray-200 dark:border-gray-700"
content = content.replace(target3, replacement3)

target4 = "my-3 border-gray-200"
replacement4 = "my-3 border-gray-200 dark:border-gray-700"
content = content.replace(target4, replacement4)

target_link = "text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors duration-200 rounded-md"
replacement_link = "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200 rounded-md"
content = content.replace(target_link, replacement_link)

with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)

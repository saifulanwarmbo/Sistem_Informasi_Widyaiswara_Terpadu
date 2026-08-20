import os

with open('App.tsx', 'r') as f:
    content = f.read()

target = """      <div className="flex h-screen bg-light-bg text-dark-text font-sans">"""
replacement = """      <div className="flex h-screen bg-light-bg dark:bg-gray-900 text-dark-text dark:text-gray-100 font-sans transition-colors duration-200">"""
content = content.replace(target, replacement)

target2 = """                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">"""
replacement2 = """                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg dark:bg-gray-900 p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible transition-colors duration-200">"""
content = content.replace(target2, replacement2)

with open('App.tsx', 'w') as f:
    f.write(content)

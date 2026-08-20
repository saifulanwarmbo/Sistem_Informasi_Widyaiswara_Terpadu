import os

with open('contexts/WidyaiswaraContext.tsx', 'r') as f:
    content = f.read()

target = """  const value = useMemo(() => ({
    profiles,
    organizations,"""

replacement = """  const value = useMemo(() => ({
    profiles,
    organizations,
    isLoading,"""

content = content.replace(target, replacement)

with open('contexts/WidyaiswaraContext.tsx', 'w') as f:
    f.write(content)

import os

with open('components/Header.tsx', 'r') as f:
    content = f.read()

# Replace local theme state with useTheme
import_target = "import { useCompetency } from '../contexts/CompetencyContext';"
import_replacement = import_target + "\nimport { useTheme } from '../contexts/ThemeContext';"

content = content.replace(import_target, import_replacement)

state_target = """  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };"""

state_replacement = "  const { theme, toggleTheme } = useTheme();"

content = content.replace(state_target, state_replacement)

with open('components/Header.tsx', 'w') as f:
    f.write(content)

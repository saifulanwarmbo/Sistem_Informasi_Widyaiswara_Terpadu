import os

with open('components/Header.tsx', 'r') as f:
    content = f.read()

import_target = "import { useTheme } from '../contexts/ThemeContext';"
import_replacement = import_target + "\nimport { useWidyaiswara } from '../contexts/WidyaiswaraContext';"
content = content.replace(import_target, import_replacement)

# Search state and logic
state_target = "  const { notifications, markNotificationRead } = useCompetency();"
state_replacement = state_target + """
  const { profiles, organizations } = useWidyaiswara();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { profiles: [], orgs: [] };
    const query = searchQuery.toLowerCase();
    return {
      profiles: profiles.filter(p => p.name.toLowerCase().includes(query) || p.nip.includes(query)).slice(0, 5),
      orgs: organizations.filter(o => o.name.toLowerCase().includes(query)).slice(0, 3)
    };
  }, [searchQuery, profiles, organizations]);
"""
content = content.replace(state_target, state_replacement)

# UI for search
search_ui = """
      <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
            placeholder="Cari profil, instansi..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
        </div>
        
        {showSearchResults && searchQuery.trim() !== '' && (
          <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
            {searchResults.profiles.length === 0 && searchResults.orgs.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">Tidak ada hasil ditemukan</div>
            ) : (
              <div className="py-2">
                {searchResults.profiles.length > 0 && (
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Profil Widyaiswara</h3>
                    <ul className="space-y-1">
                      {searchResults.profiles.map(profile => (
                        <li key={profile.id}>
                          <Link to={`/profiles?search=${encodeURIComponent(profile.name)}`} className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <div className="font-medium">{profile.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{profile.organization}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {searchResults.orgs.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Instansi / Organisasi</h3>
                    <ul className="space-y-1">
                      {searchResults.orgs.map(org => (
                        <li key={org.id}>
                          <Link to={`/organizations?search=${encodeURIComponent(org.name)}`} className="block px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <div className="font-medium">{org.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{org.total} Widyaiswara</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
"""

ui_target = '</div>\n      <div className="flex items-center space-x-4">'
ui_replacement = '</div>\n' + search_ui + '      <div className="flex items-center space-x-4">'

content = content.replace(ui_target, ui_replacement)

with open('components/Header.tsx', 'w') as f:
    f.write(content)

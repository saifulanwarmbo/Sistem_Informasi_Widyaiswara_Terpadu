const fs = require('fs');
let file = fs.readFileSync('pages/Profiles.tsx', 'utf8');

const targetGrid = `      {filteredProfiles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"`;
const replacementGrid = `      {filteredProfiles.length > 0 ? (
        <motion.div 
          className={\`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 \${viewingProfile ? 'print:hidden' : ''}\`}`;

file = file.replace(targetGrid, replacementGrid);

// Also handle the empty state block
const targetEmpty = `        <div className="text-center py-12">
          {ICONS.users}`;
const replacementEmpty = `        <div className={\`text-center py-12 \${viewingProfile ? 'print:hidden' : ''}\`}>
          {ICONS.users}`;

file = file.replace(targetEmpty, replacementEmpty);

fs.writeFileSync('pages/Profiles.tsx', file);

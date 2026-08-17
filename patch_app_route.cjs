const fs = require('fs');
let file = fs.readFileSync('App.tsx', 'utf8');

const targetImport = "const DevelopmentHub = lazy(() => import('./pages/DevelopmentHub'));";
const replacementImport = "const DevelopmentHub = lazy(() => import('./pages/DevelopmentHub'));\nconst CommunityOfPractices = lazy(() => import('./pages/CommunityOfPractices'));";

file = file.replace(targetImport, replacementImport);

const targetRoute = '<Route path="/development-hub" element={<DevelopmentHub />} />';
const replacementRoute = '<Route path="/development-hub" element={<DevelopmentHub />} />\n                        <Route path="/community-of-practices" element={<CommunityOfPractices />} />';

file = file.replace(targetRoute, replacementRoute);

fs.writeFileSync('App.tsx', file);

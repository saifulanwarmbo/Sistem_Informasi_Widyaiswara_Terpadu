const fs = require('fs');
let app = fs.readFileSync('App.tsx', 'utf8');

app = app.replace('<div className="flex h-screen bg-gray-50">', '<div className="flex h-screen bg-gray-50 print:bg-white print:h-auto print:block">');
app = app.replace('<main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg p-4 md:p-8">', '<main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">');

fs.writeFileSync('App.tsx', app);

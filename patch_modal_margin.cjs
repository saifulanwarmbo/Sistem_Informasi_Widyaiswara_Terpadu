const fs = require('fs');
let file = fs.readFileSync('components/ProfileDetailModal.tsx', 'utf8');

const targetStyle = `<style type="text/css" media="print">
        {\`
          .print-hidden {
            display: none !important;
          }
          @page {
            margin: 0;
            margin-top: 1cm;
            margin-bottom: 1cm;
          }
        \`}
      </style>`;

const replacementStyle = `<style type="text/css" media="print">
        {\`
          .print-hidden {
            display: none !important;
          }
          @page {
            margin: 1.5cm 2cm;
          }
        \`}
      </style>`;

file = file.replace(targetStyle, replacementStyle);

fs.writeFileSync('components/ProfileDetailModal.tsx', file);

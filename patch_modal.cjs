const fs = require('fs');
let file = fs.readFileSync('components/ProfileDetailModal.tsx', 'utf8');

const targetStyle = `<style type="text/css" media="print">
        {\`
          body * {
            visibility: hidden;
          }
          #profile-detail-modal-root, #profile-detail-modal-root * {
            visibility: visible;
          }
          #profile-detail-modal-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            max-height: none;
            overflow: visible;
            box-shadow: none;
            background: white;
          }
          .print-hidden {
            display: none !important;
          }
        \`}
      </style>`;

file = file.replace(targetStyle, `<style type="text/css" media="print">
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
      </style>`);

// Also change the wrapper classes to remove fixed centering for print
const targetWrapper = `className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 print:absolute print:inset-0 print:bg-white print:p-0"`;
const replacementWrapper = `className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 print:static print:bg-transparent print:p-0 print:block"`;

file = file.replace(targetWrapper, replacementWrapper);

// Also remove margin/centering from modal root
const targetRoot = `className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:block"`;
const replacementRoot = `className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:block print:m-0"`;

file = file.replace(targetRoot, replacementRoot);

fs.writeFileSync('components/ProfileDetailModal.tsx', file);

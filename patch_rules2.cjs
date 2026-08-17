const fs = require('fs');
let file = fs.readFileSync('firestore.rules', 'utf8');

const targetCop = \`    function isValidCopEvent() {
      return request.resource.data.keys().hasAll(['id', 'title', 'description', 'date', 'location', 'createdAt']) &&
             request.resource.data.id is string &&
             request.resource.data.title is string &&
             request.resource.data.description is string &&
             request.resource.data.date is number &&
             request.resource.data.location is string &&
             request.resource.data.createdAt is number;
    }\`;

const replacementCop = \`    function isValidCopEvent() {
      return request.resource.data.keys().hasAll(['id', 'title', 'description', 'date', 'location', 'createdAt']);
    }\`;

file = file.replace(targetCop, replacementCop);

fs.writeFileSync('firestore.rules', file);

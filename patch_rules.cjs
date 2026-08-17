const fs = require('fs');
let file = fs.readFileSync('firestore.rules', 'utf8');

const targetAgendas = `    match /agendas/{agendaId} {
      allow read: if true;
      allow create: if isAdmin() && isValidAgenda();
      allow update: if isAdmin() && isValidAgenda();
      allow delete: if isAdmin();
    }`;

const replacementAgendas = `    match /agendas/{agendaId} {
      allow read: if true;
      allow create: if isAdmin() && isValidAgenda();
      allow update: if isAdmin() && isValidAgenda();
      allow delete: if isAdmin();
    }

    function isValidCopEvent() {
      return request.resource.data.keys().hasAll(['id', 'title', 'description', 'date', 'location', 'createdAt']) &&
             request.resource.data.id is string &&
             request.resource.data.title is string &&
             request.resource.data.description is string &&
             request.resource.data.date is number &&
             request.resource.data.location is string &&
             request.resource.data.createdAt is number;
    }

    match /cop_events/{copId} {
      allow read: if true;
      allow create: if isAdmin() && isValidCopEvent();
      allow update: if isAdmin() && isValidCopEvent();
      allow delete: if isAdmin();
    }`;

file = file.replace(targetAgendas, replacementAgendas);

fs.writeFileSync('firestore.rules', file);

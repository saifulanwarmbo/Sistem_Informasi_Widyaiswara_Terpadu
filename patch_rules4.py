import os

with open('firestore.rules', 'r') as f:
    content = f.read()

target = """    match /cop_events/{copId} {
      allow read: if true;
      allow create: if isAdmin() && isValidCopEvent();
      allow update: if isAdmin() && isValidCopEvent();
      allow delete: if isAdmin();
    }"""

replacement = """    match /cop_events/{copId} {
      allow read: if true;
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }"""

content = content.replace(target, replacement)

with open('firestore.rules', 'w') as f:
    f.write(content)

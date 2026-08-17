import os

with open('firestore.rules', 'r') as f:
    content = f.read()

target = """    function isValidCopEvent() {
      return request.resource.data.keys().hasAll(['id', 'title', 'description', 'date', 'location', 'createdAt']) &&
             request.resource.data.id is string &&
             request.resource.data.title is string &&
             request.resource.data.description is string &&
             request.resource.data.date is number &&
             request.resource.data.location is string &&
             request.resource.data.createdAt is number;
    }"""

replacement = """    function isValidCopEvent() {
      return request.resource.data.keys().hasAll(['id', 'title', 'description', 'date', 'location', 'createdAt']);
    }"""

content = content.replace(target, replacement)

with open('firestore.rules', 'w') as f:
    f.write(content)

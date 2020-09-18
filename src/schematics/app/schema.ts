export default {
  '$schema': 'http://json-schema.org/schema',
  'id': 'SchematicsNestApplication',
  'title': 'Nest Application Options Schema',
  'questions': [
    {
      type: 'input',
      name: 'name',
      message: 'What name would you like to use for the new project?',
      validate: (value) => {
        return !!value.trim() || 'Please enter a name for the project';
      }
    },
    {
      type: 'list',
      name: 'transport',
      message: 'Which transport layer would you like to use?',
      choices: [ 'NATS' ]
    },
    {
      type: 'confirm',
      name: 'pure',
      message: 'Are you building a pure app?',
      default: true
    },
    {
      type: 'confirm',
      name: 'persistence',
      message: 'Are you going to use persistence in a DB?',
      default: false
    },
    {
      type: 'list',
      name: 'persistenceDB',
      message: 'Which database would you like to use?',
      choices: [
        'mongodb',
        'postgresql',
        'mysql',
        'other'
      ],
      default: 'mongodb',
      when: (answers) => {
        return answers.persistence;
      }
    }
  ]
}
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
      type: 'input',
      name: 'author',
      message: 'Who is the author of the project?',
      default: 'Rebellion Pay <backend@rebellionpay.com>'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Which is the description of the project?',
    },
    {
      type: 'input',
      name: 'license',
      message: 'Which is the project license?',
      default: 'MIT'
    },
    {
      type: 'number',
      name: 'port',
      message: 'In which port will it run?',
      default: 3000
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
      default: false
    },
    {
      type: 'confirm',
      name: 'persistence',
      message: 'Are you going to use persistence in a DB?',
      default: true
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
    },
    {
      type: 'confirm',
      name: 'useSpinnaker',
      message: 'Are you going to make the CD with spinnaker?',
      default: true
    },
    {
      type: 'input',
      name: 'spinnakerUrl',
      message: 'What is the spinnaker API url?',
      when: (answers) => {
        return answers.useSpinnaker;
      },
      validate: (value) => {
        return (!!value.trim() && new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g).test(value)) || 'Please enter a valid URL (don\'t forget the protocol)';
      }
    },
    {
      type: 'input',
      name: 'kubernetesNamespace',
      message: 'In which kubernetes namespace will this app going to be deployed?',
      default: 'default'
    }
  ]
}
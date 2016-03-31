// 1. Copy this file to configDev.js and input your environment-specific variables.
//    configDev.js is included within the .gitignore
// 2. When running your development environment, copy configDev.js to config.js

module.exports = {
  port: 8000,
  dbUser : 'root',
  dbPassword : 'INSERT PASSWORD HERE',
  dbHost : 'localhost', // for development, this would be 'localhost'
  db : 'wandoo', // for development, 'wandoo'
  serverURL : 'http://localhost:8000'  
};

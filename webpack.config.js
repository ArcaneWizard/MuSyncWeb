const path = require('path');

module.exports = {
  // Other webpack configurations...

  resolve: {
    alias: {
      'react': path.resolve(__dirname, './client/node_modules', 'react'),
      // Add other aliases as needed for packages causing duplication issues...
    }
  }
};
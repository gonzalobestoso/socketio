const optionsSQLITE = require('knex')({
    client: "sqlite3", 
    connection: {
      filename: "../db/ecommerce.sqlite",
    },
    useNullAsDefault: true,
  });

  module.exports = optionsSQLITE;
const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.log('Unable to connect to the database:', err);
    })

const db = {}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = require('/users')(sequelize, DataTypes);
db.change = require('/change')(sequelize, DataTypes);
db.convert = require('/convert')(sequelize, DataTypes);


db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables synced');
    }).catch(err => {
        console.error('Unable to sync database & tables:', err);
    })

module.exports = db;
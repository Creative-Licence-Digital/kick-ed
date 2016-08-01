import fs        from 'fs'
import path      from 'path'
import Sequelize from 'sequelize'

export default (config) => {
  const ENV = process.env.NODE_ENV || "development";
  const sequelize = new Sequelize(config.database, config.username, config.password, config);
  const _db       = {};
  
  fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf(".") !== 0) && (file !== "index.js"))
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file));
      _db[model.name] = model;
    });
  
  Object.keys(_db).forEach(modelName => {
    if ("associate" in _db[modelName]) {
      _db[modelName].associate(_db);
    }
  });
  
  _db.sequelize = sequelize;
  _db.Sequelize = Sequelize;
  _db.sequelize.sync().then(res => {
    console.log("DB synchronized");
  }).catch(err => {
    console.error("Error while synchronizing the DB schemas", err);
  });
  return _db;
}

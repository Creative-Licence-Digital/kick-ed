export default (sequelize, DataTypes) => {
  const UserContentField = sequelize.define('UserContentField', { 
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    label: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    position: DataTypes.INTEGER
  });
  return UserContentField;
}

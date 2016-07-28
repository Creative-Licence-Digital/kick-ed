export default (sequelize, DataTypes) => {
  const UserContentField = sequelize.define('UserContentField', { 
    label: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    position: DataTypes.INTEGER
  });
  return UserContentField;
}

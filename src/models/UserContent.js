export default (sequelize, DataTypes) => {
  const UserContent = sequelize.define('UserContent', {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user:        DataTypes.STRING,
    account:     DataTypes.STRING,
    lesson:      DataTypes.STRING,
    isSubmitted: DataTypes.BOOLEAN,
    requestedAt: DataTypes.DATE,
    submittedAt: DataTypes.DATE
  }, { 
    classMethods: {
      associate: (models) => {
        UserContent.hasMany(models.UserContentField);
      }
    } 
  });
  return UserContent;
};

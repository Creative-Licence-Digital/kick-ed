export default (sequelize, DataTypes) => {
  const UserContent = sequelize.define('UserContent', {
    user: DataTypes.STRING,
    lesson: DataTypes.STRING,
    course: DataTypes.STRING,
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

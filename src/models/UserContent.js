export default (sequelize, DataTypes) => {
  const UserContent = sequelize.define('UserContent', {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user:         DataTypes.STRING,
    account:      DataTypes.STRING,
    lesson:       DataTypes.STRING,
    title:        DataTypes.STRING,
    instructions: DataTypes.STRING,
    template:     DataTypes.STRING,
    slides:       DataTypes.TEXT,

    lesson_template: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    deletedAt: { 
      type: DataTypes.DATE,
      allowNull: true
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, { 
    classMethods: {
      associate: (models) => {
        UserContent.hasMany(models.UserContentField);
      }
    } 
  });
  return UserContent;
};

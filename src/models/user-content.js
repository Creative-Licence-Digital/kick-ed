import sequelize from 'sequelize'

export const UserContentField = sequelize.define('user-content-field', { 
  label: Sequelize.STRING,
  type: Sequelize.STRING,
  value: Sequelize.STRING,
  position: Sequelize.INTEGER
});

export const UserContent = sequelize.define('user-content', {
  user: Sequelize.STRING,
  lesson: Sequelize.STRING,
  course: Sequelize.STRING,
  isSubmitted: {
    field: 'is_submitted',
    type: Sequelize.BOOLEAN
  },
  requestedAt: {
    field: 'requested_at',
    type: Sequelize.DATE
  },
  submittedAt: {
    field: 'submitted_at',
    type: Sequelize.DATE
  }
});

UserContent.hasMany(UserContentField);


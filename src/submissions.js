import Models from './models'

export default (config) => {
  const models  = Models(config);
  let   methods = {};

  methods.list = (where) => {
    return models.UserContent.findAll({
      where:   where,
      include: [ models.UserContentField ]
    });
  }

  return methods;
}

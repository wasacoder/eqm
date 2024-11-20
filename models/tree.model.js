const RestHapi = require('rest-hapi')

module.exports = function(mongoose) {
  const modelName = 'tree'
  const Types = mongoose.Schema.Types
  const Schema = new mongoose.Schema({
    tree: {
      type: Types.String,
      required: true
    },
    layer: {
      type: Types.String,
      required: true
    },
    ancestors:{
      type: Types.Mixed,
      required: true
    }
  })

  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      extraEndpoints: [

      ],
      create: {

      }
    }
  }

  return Schema
}

const RestHapi = require('rest-hapi')

module.exports = function(mongoose) {
  const modelName = 'request'
  const Types = mongoose.Schema.Types
  const Schema = new mongoose.Schema({
    // #_id = tree :: layer :: business_id
    tree: {
      type: Types.String,
      required: true
    },
    obj:[{layer:{type: Types.String}, business_id:{type: Types.String}}],
    action: {
      type: Types.String,
      required: true
    },
    amt: {
      type: Types.Number
    },
    currency: {
      type: Types.String
    },
    ancestors:{
      type: Types.Mixed
    }
  })

  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      extraEndpoints: [
        // Password Update Endpoint

      ],
      create: {

      }
    },
  }

  return Schema
}

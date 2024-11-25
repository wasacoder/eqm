const RestHapi = require('rest-hapi')

module.exports = function(mongoose) {
  const modelName = 'quota'
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
    business_id: {
      type: Types.String,
      required: true,
      unique: true
    },
    amt: {
      type: Types.Number
    },
    currency: {
      type: Types.String
    },
    available: {
      type: Types.Number
    },
    status:{
      type: Types.String
    }
  })

  Schema.statics = {
    collectionName: modelName,
    routeOptions: {
      extraEndpoints: [

      ],
      create: {

      }
    },
  }

  return Schema
}

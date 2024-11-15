const RestHapi = require('rest-hapi')

module.exports = function(mongoose) {
  const modelName = 'quota'
  const Types = mongoose.Schema.Types
  const Schema = new mongoose.Schema({
    // #_id = tree :: layer :: business_id
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
        function(server, model, options, logger) {
          const Log = logger.bind('Quota Occupy')
          const Boom = require('@hapi/boom')

          const collectionName = model.collectionDisplayName || model.modelName

          Log.note('Occupying ' + collectionName)

          const handler = async function(request, h) {
            try {
              let quota = await model.find({tree: request.payload.tree, layer: request.payload.obj[0].layer, business_id: request.payload.obj[0].business_id})
              //console.log(quota[0])
              let q = quota[0]

              console.log(request.payload.amt)
              q.available = q.available - request.payload.amt
              await q.save()

              return h.response('quota occupied.').code(200)
            } catch (err) {
              Log.error(err)
              throw Boom.badImplementation(err)
            }
          }

          server.route({
            method: 'PUT',
            path: '/quota/occupy',
            config: {
              handler: handler,
              auth: null,
              description: "Occupy quota.",
              tags: ['api', 'Quota', 'Occupy'],
              validate: {
                //params: {
                //  _id: RestHapi.joiHelper.joiObjectId().required()
                //},
                payload: {
                  tree: RestHapi.joi
                  .string()
                  .required()
                  .description("The quota tree"),
                  amt: RestHapi.joi
                  .number()
                  .required()
                  .description("occupy amt"),
                  currency: RestHapi.joi.string().required().description("occupy currency"),
                  obj: RestHapi.joi.any().required().description("occupy obj")
//                  [{layer: RestHapi.joi
//                    .string()
//                    .required()
//                    .description("The quota layer"),
//                    business_id: RestHapi.joi
//                    .string()
//                    .required()
//                    .description("The business_id")
//                  }]
                }
              },
              plugins: {
                'hapi-swagger': {
                  responseMessages: [
                    { code: 204, message: 'Success' },
                    { code: 400, message: 'Bad Request' },
                    { code: 404, message: 'Not Found' },
                    { code: 500, message: 'Internal Server Error' }
                  ]
                }
              }
            }
          })
        }
      ],
      create: {

      }
    },
  }

  return Schema
}

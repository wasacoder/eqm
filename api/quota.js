module.exports = function (server, mongoose, logger) {
  const check_handler = async function(request, h) {
    const Log = logger.bind('Quota Check')
    const Boom = require('@hapi/boom')
    const Tree = mongoose.model('tree')
    const Quota = mongoose.model('quota')
    Log.note('Checking quota')

    try {
      let tree = request.payload.tree
      let layers = request.payload.layers
      let nodes = await Tree.find({tree:tree, layer: {$in: layers}})
      //todo check nodes.size <> layers.size
      let ancestors = nodes.reduce((acc, node) => acc.concat(node.ancestors), layers)
      ancestors = Array.from(new Set(ancestors))
      let quotas = await Promise.all(
        ancestors.map(async(item) => {
          return await Quota.find({tree: tree, layer: item, business_id: request.payload.bizid[item+'_id']})
        })
      );
      quotas = quotas.flat()
      let enough = true
      quotas.map(q => {
        if(q.available < request.payload.amt){
          enough = false
        }
      });
      console.log(enough)

      if (enough){
        return h.response('quota available.').code(200)
      } else {
        return h.response('quota not enough.').code(304)
      }
    } catch (err) {
      Log.error(err)
      throw Boom.badImplementation(err)
    }
  };

  const occupy_handler = async function(request, h) {
    const Log = logger.bind('Quota Occupy')
    const Boom = require('@hapi/boom')
    const Tree = mongoose.model('tree')
    const Quota = mongoose.model('quota')
    Log.note('Occupying quota')

    try {
      let tree = request.payload.tree
      let layers = request.payload.layers
      let nodes = await Tree.find({tree:tree, layer: {$in: layers}})
      //todo check nodes.size <> layers.size
      let ancestors = nodes.reduce((acc, node) => acc.concat(node.ancestors), layers)
      ancestors = Array.from(new Set(ancestors))
      let quotas = await Promise.all(
        ancestors.map(async(item) => {
          return await Quota.find({tree: tree, layer: item, business_id: request.payload.bizid[item+'_id']})
        })
      );
      quotas = quotas.flat()
      await Promise.all(
        quotas.map(async(q) => {
          q.available = q.available - request.payload.amt
          await q.save()
        })
      );

      return h.response('quota occupied.').code(200)
    } catch (err) {
      Log.error(err)
      throw Boom.badImplementation(err)
    }
  };


  server.route({
    method: 'PUT',
    path: '/quota/check',
    config: {
      handler: check_handler,
      tags: ['api', 'quota'],
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
  });


  server.route({
    method: 'PUT',
    path: '/quota/occupy',
    config: {
      handler: occupy_handler,
      tags: ['api', 'quota'],
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
  });
};

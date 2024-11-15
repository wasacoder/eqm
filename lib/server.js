require('env2')('.env')
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const RestHapi = require('rest-hapi')

const server = Hapi.Server({
  port: process.env.PORT,
  routes: {
    validate: {
      failAction: async (request, h, err) => {
        RestHapi.logger.error(err);
        throw err;
      }
    }
  }
})

const config = {
  appTitle: 'Elastic Quota Management',
  enableTextSearch: true,
  logRoutes: true,
  docExpansion: 'list',
  swaggerHost: process.env.SWAGGER_HOST,
  enableCreatedAt: true,
  enableUpdatedAt: true,
  mongo: {
    URI: process.env.MONGO_URI,
  },
}
exports.register = async () => {
  await server.register({
    plugin: RestHapi,
    options: {
      mongoose: mongoose,
      config: config,
    }
  });

  return server;
};


exports.init = async () => {
  await server.initialize();
  return server;
};

exports.start = async () => {
  try{
    await server.start();
    RestHapi.logUtil.logActionComplete(RestHapi.logger, 'Server Initialized', server.info);
    return server;
  } catch (err) {
    console.log('Error starting server:', err)
  }
};


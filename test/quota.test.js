const mongoose = require('mongoose')
const Lab = require('@hapi/lab');
const { expect  } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before  } = exports.lab = Lab.script();
const { init, register  } = require('../lib/server');
const { RequestSchema } = require('../models/request.model')

describe('Quota Request', () => {
  let server;
  before(async () => {
    server = await register();
    server = await init();
  });


  beforeEach(async () => {
    //server = await init();
  });

  afterEach(async () => {
    //await server.stop();

  });

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/'
    });
    expect(res.statusCode).to.equal(200);

  });

  it('responds /hello-world with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/hello-world'
    });
    expect(res.statusCode).to.equal(200);

  });

  it('create a request', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/request',
      payload: {
        tree: 'credit',
        obj: [{layer: 'cust', business_id: 'cust01'}, {layer: 'branch', business_id: '5000'}],
        action: 'init',
        amt: 1000,
        currency: 'CNY'
      }
    });

    expect(res.statusCode).to.equal(201);
  });

  it('occupy quota', async () => {
    const res = await server.inject({
      method: 'put',
      url: '/quota/occupy',
      payload: {
        tree: 'credit',
        obj: [{layer: 'cust', business_id: 'cust01'}, {layer: 'branch', business_id: '5000'}],
        amt: 1000,
        currency: 'CNY'
      }
    });

    expect(res.statusCode).to.equal(200);
  });
});

const mongoose = require('mongoose')
const Lab = require('@hapi/lab');
const { expect  } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before  } = exports.lab = Lab.script();
const { init, register  } = require('../lib/server');

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
  after(async () => {
    await server.stop();
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


  it('take quota', async () => {
    const res = await server.inject({
      method: 'put',
      url: '/quota/occupy',
      payload: {
        tree: 'credit',
        layers: ['cust', 'branch'],
        amt: 1000,
        currency: 'CNY',
        bizid:{cust_id: 'cust01', branch_id: '5000', group_id: 'group01', head_id:'1000'}
      }
    });

    expect(res.statusCode).to.equal(200);
  });

  it('check quota', async () => {
    const res = await server.inject({
      method: 'put',
      url: '/quota/check',
      payload: {
        tree: 'credit',
        layers: ['cust', 'branch'],
        amt: 10000000000,
        currency: 'CNY',
        bizid:{cust_id: 'cust01', branch_id: '5000', group_id: 'group01', head_id:'1000'}
      }
    });

    expect(res.statusCode).to.equal(304);
  });



});

const Lab = require('@hapi/lab');
const { expect  } = require('@hapi/code');
const { afterEach, after, beforeEach, describe, it, before  } = exports.lab = Lab.script();
const { init, register  } = require('../lib/server');

describe('Simple quota tree', () => {
  let server;
  before(async () => {
    server = await register();
    server = await init();
  });

  after(async () => {
    await server.stop();
  });


  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/quota'
    });
    expect(res.statusCode).to.equal(200);

  });

  it('test credit tree', async () => {
    const quotas = await server.inject({
      method: 'post',
      url: '/quota',
      payload: [
        {layer: "cont", tree: "credit", business_id: "cont01", amt: 10000, currency: "CNY", available: 10000},
        {layer: "cust", tree: "credit", business_id: "cust01", amt: 10000, currency: "CNY", available: 10000},
        {layer: "group", tree: "credit", business_id: "group01", amt: 50000, currency: "CNY", available: 50000},
        {layer: "branch", tree: "credit", business_id: "5000", amt: 1000000, currency: "CNY", available: 1000000},
        {layer: "head", tree: "credit", business_id: "1000", amt: 8000000, currency: "CNY", available: 8000000}]
    });

    expect(quotas.statusCode).to.equal(201);
    expect(quotas.result.length).to.equal(5);

    const occupied = await server.inject({
      method: 'put',
      url: '/quota/occupy',
      payload: {
        tree: 'credit',
        layers: ['cont', 'branch'],
        amt: 1000,
        currency: 'CNY',
        bizid:{cont_id: 'cont01', cust_id: 'cust01', branch_id: '5000', group_id: 'group01', head_id:'1000'}
      }
    });

    expect(occupied.statusCode).to.equal(200);

    const availables = await server.inject({
      method: 'get',
      url: '/quota'
    })
    console.log(availables.result.docs)
    let res = availables.result.docs.reduce(function(map, obj){
      map[obj._id] = obj.available;
      return map;
    }, {});
    console.log(res);


    quotas.result.forEach(function(q){
      expect(q.available).to.equal(res[q._id] + 1000);
    })

  });


});

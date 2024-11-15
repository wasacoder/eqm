const { register, init, start } = require('./lib/server');
async function bootup(){
  await register();
  await init();
  await start();
}
bootup();

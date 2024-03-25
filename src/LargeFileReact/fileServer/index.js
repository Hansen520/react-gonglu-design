/*
 * @Date: 2024-03-19 10:59:53
 * @Description: description
 */
const Controller = require('./controller.js');
const AliLarge = require('./ali_large.js'); // 测试阿里的大文件
const TencentLarge = require('./ten_large.js'); // 测试腾讯的大文件
const http = require('http');
const server = http.createServer();
const controller = new Controller();
const tencentLarge = new TencentLarge();

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return;
  }
  if (req.url === '/verify') {
    await controller.handleVerifyUpload(req, res);
    return;
  }

  if (req.url === '/merge') {
    // todo
    await controller.handleMerge(req, res);
    return;
  }

  if (req.url === '/') {
    await controller.handleFormData(req, res);
  }

  if (req.url === '/delete') {
    await controller.deleteFiles(req, res);
  }

  if (req.url === '/ali_large') {
    await AliLarge();
    return 'success';
  }

  // 腾讯 获取初始化接口
  if (req.url === '/attachment/urls') {
    await tencentLarge.init(req, res);
  }
});

server.listen(3000, () => console.log('listening port 3000'));

// 通过 npm 安装 sdk npm install cos-nodejs-sdk-v5
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
// nodejs 端可直接使用 CAM 密钥计算签名，建议用限制最小权限的子用户的 CAM 密钥
// 最小权限原则说明 https://cloud.tencent.com/document/product/436/38618
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const fs = require('fs');
const http = require('http');

const Bucket = 'han-9999-1257066862';
const Region = 'ap-nanjing';

const cos = new COS({
  SecretId: 'AKID44IJHC31Efw0qlhow2xjNGOlGxXt6B3l', // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey: 'jXn6XAocQEwQgRI5nZKE1iMuOyncN1Y2', // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});

module.exports = class {
  async init(req, res) {
    // cos.multipartListPart(
    //   {
    //     Bucket, // 必须
    //     Region, // 必须
    //     Key: "flower.png", // 必须
    //     UploadId: "17110028227f644a4dcfe555cd251d641bd6f43e866ca7e9594027a30d5db6f1a1683994f1", // 必须
    //   },
    //   function (err, data) {
    //     if (err) {
    //       // 处理请求出错
    //       console.log(err);
    //     } else {
    //       // 处理请求成功
    //       console.log(data);
    //     }
    //   }
    // );
    let dataVal = '';
    // console.log(req, 38);
    let eTag = '';
    cos.multipartUpload(
      {
        Bucket, // 必须
        Region, // 必须
        Key: 'flower.png', // 必须
        ContentLength: '1024',
        UploadId:
          '17110028227f644a4dcfe555cd251d641bd6f43e866ca7e9594027a30d5db6f1a1683994f1',
        PartNumber: '1',
        Body: fs.createReadStream('largeFileUpload/flower.png'),
      },
      function (err, data) {
        console.log(1);
        if (err) {
          // 处理请求出错
          console.log(err);
        } else {
          // 处理请求成功
          console.log(data);
        }
        if (data) {
          eTag = data.ETag;
        }
      },
    );

    const filePath = 'temp-file-to-upload'; // 本地文件路径
  }
};

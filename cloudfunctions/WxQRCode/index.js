const cloud = require('wx-server-sdk')
const axios = require('axios')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  // [MUST_SET]
  var appid = "please input your appid";
  var secret = "please input your secret";
  try {
    // appid和secret已自动注入云函数中
    const resultValue = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret);
    const token = JSON.parse(resultValue).access_token;
    console.log('------ TOKEN:', token);

    var acode_url = "https://api.weixin.qq.com/wxa/getwxacode";
    if (event.is_qr_code) {
      acode_url = "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode";
    }
    const response = await axios({
      method: 'post',
      url: acode_url,
      responseType: 'stream',
      params: {
        access_token: token,
      },
      data: {
        path: event.path,
        width: event.width,
        auto_color: false,
        // 是否透明底色
        is_hyaline: event.is_hyaline,
        line_color: { "r": 255, "g": 255, "b": 255 }
      },
    });

    return await cloud.uploadFile({
      cloudPath: 'acodeimages/' + Date.now() + '.png',
      fileContent: response.data,
    });
  } catch (err) {
    console.log('>>>>>> ERROR:', err)
  }
}
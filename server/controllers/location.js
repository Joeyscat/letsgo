// const { mysql } = require('../qcloud')
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wx213fcac1c2ebf712',
  database: 'cAuth'
});
connection.connect();


async function save(ctx, next) {
  // 检查签名，确认是微信发出的请求
  // const { signature, timestamp, nonce } = ctx.query
  // if (!checkSignature(signature, timestamp, nonce)) ctx.body = 'ERR_WHEN_CHECK_SIGNATURE'
  /**
   * 解析微信发送过来的请求体
   * 可查看微信文档：https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/receive.html#接收消息和事件
   */
  const body = ctx.request.body
  console.log('ctx.request: '+JSON.stringify(ctx.request));
  var user = body;

  var addSql = 'INSERT INTO location_info(nickname,user_id,latitude,longitude,speed,accuracy,date,address) ' +
    'VALUES(?,?,?,?,?,?,?,?)';
  var addSqlParams = [user.nickname, '223', user.latitude, user.longitude, user.speed, user.accuracy, user.date, user.address];
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log(new Date() + '[INSERT ERROR] - ', err.message);
      return;
    }
    console.log(new Date() + 'result: ', result);
    // ctx.body='OKKOKKO';
  });
}

async function list(ctx, next) {
  var sql = 'SELECT * FROM location_info';
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(new Date() + '[SELECT ERROR] - ', err.message);
      return;
    }
    console.log(result);
    return result;
  });
}

module.exports = {
  save,
  list
}

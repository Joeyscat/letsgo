//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();

Page({
  data: {
    userInfo: {},
    logged: app.logged,
    takeSession: false,
    requestResult: ''
  },

  // 用户登录示例
  login: function () {
    if (this.data.logged) return;

    util.showBusy('正在登录');
    var that = this;

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          app.logged = true;
          that.setData({
            userInfo: result,
            logged: true
          })
          console.log('login()登录成功成功返回result：' + JSON.stringify(result));
          app.nickname = result.nickName;
        } else {
          console.log('login()登录成功成功不返回result， 开始请求code')
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          that.request();
        }
      },
      fail(error) {
        // util.showModel('登录失败', error)
        console.log('login()登录失败', error)
      }
    })
  },

  // 请求用户信息
  request: function () {
    var that = this;
    qcloud.request({
      url: config.service.requestUrl,
      login: false,
      success(result) {
        util.showSuccess('获取用户信息成功')
        app.logged = true;
        that.setData({
          userInfo: result.data.data,
          logged: true
        })
        console.log('request()成功result: ' + JSON.stringify(result))
      },
      fail(error) {
        app.logged = false;
        // util.showModel('请求用户信息失败', error)
        console.log('request()失败，重新登录login()', error)
        that.login();
      }
    })
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },
})
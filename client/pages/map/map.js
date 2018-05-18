// pages/component/pages/map/map.js

var app = getApp();
// 初始化坐标信息
var latitude = '23.099994', longitude = '113.324520', name = 'T.I.T 创意园', speed, accuracy, address;
var that, myAmapFun;
var qcloud = require('../../vendor/wafer2-client-sdk/index.js');
var config = require('../../config')
var util = require('../../utils/util.js')
var amapFile = require('../../lib/amap-wx.js')
var count = 1; // 记录点击定位按钮次数，第一次会提醒用户登录

Page({
  data: {
    latitude: latitude,
    longitude: longitude,
    address: address,
    markers: [{
      latitude: latitude,
      longitude: longitude,
      name: name
    }],
    covers: [{
      latitude: latitude,
      longitude: longitude,
      // iconPath: '../common/image/location.png'
    }, {
      latitude: latitude,
      longitude: longitude,
      // iconPath: '../common/image/location.png'
    }]
  },
  onLoad: function () {
    myAmapFun = new amapFile.AMapWX({ key: '1165b2ecb629ba7919905e0d3d224416' });
    this.getLoc();
  },

  /* 获取位置信息 */
  getLoc: function () {
    var that = this;
    this.getAMap();
    console.log('定位中。。。。')
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        speed = res.speed
        accuracy = res.accuracy
        console.log('getLocation()--OK')
        // 获得当前坐标后刷新
        that.showLoc();
        if (app.logged) {
          var locationData = {
            latitude: latitude,
            longitude: longitude,
            speed: speed,
            accuracy: accuracy,
            date: new Date(),
            address: address,
            nickname: app.nickname,
          };
          that.qcloundReq('saveLoc', locationData);
        } else if (count++ == 1)
          util.showModel('当前未登录', '登录之后可以查看历史记录哦');
      },
      fail: function (msg) {
        console.log('定位失败' + msg[0])
      }
    })
  },

  /* 更新地图页面 */
  showLoc: function () {
    var that = this;
    that.setData({
      latitude: latitude,
      longitude: longitude,
      address: address,
      markers: [{
        latitude: latitude,
        longitude: longitude,
        name: name
      }],
      covers: [{
        latitude: latitude,
        longitude: longitude,
        // iconPath: '../common/image/location.png'
      }, {
        latitude: latitude,
        longitude: longitude,
        // iconPath: '../common/image/location.png'
      }]
    })
  },

  // 封装为请求函数，参数1：url、参数2：data
  qcloundReq: function (url, locationData) {
    console.log(app.nickname + '--发送位置信息到服务器')
    // 使用 login 参数之前，需要设置登录地址
    qcloud.request({
      // login: true,
      // url: 'http://806bp1lj.qcloud.la/saveLoc',
      url: `${config.service.host}/weapp/` + url,
      method: 'POST',
      data: locationData,
      success: function (response) {
        console.log(JSON.stringify(response));
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  // 高德SDK
  getAMap: function () {

    myAmapFun.getRegeo({
      success: function (data) {
        address = data[0].name

      },
      fail: function (info) {
        console.log(info)
      }
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('转发' + res.target)
    }
    return {
      title: '小地图',
      path: '/pages/map/map',
      success: function (res) {
        // 转发成功
        console.log('转发成功')

      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },

  // 收藏当前位置
  favorite: function () {
    console.log('收藏位置' + longitude + '--' + latitude+'('+address+')')
  }
})
/*
CREATE TABLE IF NOT EXISTS `location_info`(
  `id` INT UNSIGNED AUTO_INCREMENT,
  `nickname` VARCHAR(40) NOT NULL,
  `user_id` VARCHAR(40) NOT NULL,
  `latitude` VARCHAR(20) NOT NULL,
  `longitude` VARCHAR(20) NOT NULL,
  `speed` VARCHAR(10) NOT NULL,
  `accuracy` VARCHAR(10) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `address` VARCHAR(100),
  PRIMARY KEY (`id`)
)ENGINE= InnoDB DEFAULT CHARSET= utf8;
*/
var md5 = require('../../../utils/md5.js')
var http = require('../../../utils/http.js')
var util = require('../../../utils/util.js')
// import { Utilaa } from 'util'
// var u = require('underscore')
Page({
  data: {
    accessToken: "24.6415c3ec4a7ce5de86ada3271c89e022.2592000.1643451434.282335-25246383",
    isShow: false,
    results: [],
    src: "",
    isCamera: true,
    btnTxt: "拍照"
  },
  onLoad() {
    this.ctx = wx.createCameraContext()
    var time = wx.getStorageSync("time")
    var curTime = new Date().getTime()
    var timeInt = parseInt(time)
    var timeNum = parseInt((curTime - timeInt) / (1000 * 60 * 60 * 24))
    console.log("=======" + timeNum)
    var accessToken = wx.getStorageSync("access_token")
    console.log("====accessToken===" + accessToken + "a")
    if (timeNum > 28 || (accessToken == "" ||
      accessToken == null || accessToken == undefined)) {
      //this.accessTokenFunc()
    } else {
      this.setData({
        accessToken: wx.getStorageSync("access_token")
      })
    }
  },
  takePhoto() {
///
    this.setData({
      results: [{'keyword': '汤圆', 'score': 0.249366, 'root': '商品-食物'}, {'keyword': '鼓棒', 'score': 0.179915, 'root': '商品-乐器'}, {'keyword': '吸顶灯', 'score': 0.120701, 'root': '商品-家居家装'}, {'keyword': '灯', 'score': 0.062241, 'root': '商品-灯具'}, {'keyword': '轮胎', 'score': 0.002948, 'root': '交通工具-汽车'}]
    })


    var that = this
    if (this.data.isCamera == false) {
      this.setData({
        isCamera: true,
        btnTxt: "拍照"
      })
      return
    }
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath,
          isCamera: false,
          btnTxt: "重拍"
        })
        console.log(that.data.src),
        wx.showLoading({
          title: '正在加载中',
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath,
          encoding: "base64",
          success: res => {
            that.req(that.data.accessToken, res.data)
          },
          fail: res => {
            wx.hideLoading()
            wx.showToast({
              title: '拍照失败,未获取相机权限或其他原因',
              icon: "none"
            })
          }
        })
      }
    })
  },
  
  req: function (token, image) {
    var that = this
    http.req("https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" + token, {
      "image": image
    }, function (res) {
      wx.hideLoading()
      console.log(JSON.stringify(res))
      var code = res.data.err_code
      if (code == 111 || code == 100 || code == 110) {
        wx.clearStorageSync("access_token")
        wx.clearStorageSync("time")
        that.accessTokenFunc()
        return
      }
      var num = res.result_num
      var results = res.data.result
      if (results != undefined && results != null) {
        that.setData({
          isShow: true,
          results: results
        })

        console.log(results)
      } else {
        wx.clearStorageSync("access_token")
        wx.showToast({
          icon: 'none',
          title: 'AI识别失败,请重新尝试',
        })
      }
    }, "POST")
  },
  
  radioChange: function (e) {
    console.log(e)
    console.log(e.detail)
    console.log(e.detail.value)
    wx.navigateTo({
      url: '/pages/result/list?keyword=' + e.detail.value,
    })
  },
  hideModal: function () {
    this.setData({
      isShow: false,
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }

})
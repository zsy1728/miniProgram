// pages/ai/index.js
const db = wx.cloud.database({env: 'cloud1-2g9pb5jc27ccaab6'})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ShOW_TOP:true,
    x:8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myfunc()
    console.log(this.data.x)

    var myDate = new Date();
    var isShowed = wx.getStorageSync("tip")
    if(isShowed!=1){
      setTimeout(()=>{
        this.setData({
          SHOW_TOP:false
        })
        wx.setStorageSync("tip", 1)
      },2*1000)
    }else{
      this.setData({
        SHOW_TOP:false
      })
    }
  },
  myfunc:function(){
      db.collection('product').where({
        sortId:1
      }).get({
        success:res=>{
          console.log(res.data.length)
          this.setData({
            x:100
          })
          console.log(this.data.x)
        }
      })
      console.log(this.data.x)
  },

  goSearch:function(){
    wx.navigateTo({
      url: 'search',
    })
  },

  onBindCamera:function(){
    wx.navigateTo({
      url: 'camera/camera',
    })
  }
})
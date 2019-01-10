// miniprogram/pages/pageShare/pageShare.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '',
    pageUrl: '',
    pageContentLongUrl: '',
    pageContentShortUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageTitle: options.page_title,
      pageUrl: options.page_url,
      pageContentLongUrl: options.page_content_url
    })
    console.log("pageShare", options.page_url)
    console.log("pageShare", options.page_title)
    console.log("pageShare", options.page_content_url)
    // [MUST_SET]
    var token = 'your token of https://dwz.cn/';
    var shortUrl = '';
    wx.request({
      url: 'https://dwz.cn/admin/v2/create',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Token': token
      },
      data: {
        url: options.page_content_url
      }, success(res) {
        shortUrl = res.data.ShortUrl
        console.log("shortUrl: ", shortUrl);
        if (!shortUrl) {
          shortUrl = "https://blog.csdn.net/freeape";
        }
        console.log(shortUrl)
        that.setData({
          pageContentShortUrl: shortUrl
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
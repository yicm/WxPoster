// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  createPoster: function (e) {
    var that = this;
    var download_url = "https://yicm.github.io";
    var title = "About Me";
    var page_url = 'pages/index/index';
    var page_title = title;
    var page_content_url = download_url;
    wx.navigateTo({
      url: '../pageShare/pageShare?page_url=' + page_url + '&page_title=' + page_title + '&page_content_url=' + page_content_url,
      success: function () {

      },
      fail: function () {
        console.log("failed to open generate page");
      }
    })
  }
})
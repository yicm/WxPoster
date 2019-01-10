// component/WxModal/WxModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean,
      value: false,
      observer(newval, oldval) {
        var that = this;
        console.log(newval)
        console.log(oldval)
        that.setData({
          showModal: newval
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    avatarTempPath: "",
    isSubmit: false,
    userInfo: [],
    nickname: "",
    slogan: "",
    showTitle: true,
    textColor: "white",  
    eventMsg: {avatarTempPath: "", avatarW: 0, avatarH: 0, nickName: "", slogan: "长按识别，精华在里", showTitle: true, whRatio: 0.6, textColor: "white"}
  },

  created: function() {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo,
          nickname: res.userInfo.nickName
        });
        console.log("user_info: ", that.data.userInfo);
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toShowModal: function(e) {
      console.log("toShowModal")
      this.setData({
        showModal: true
      });
    },
    hideModal: function(e) {
      console.log("hideModal")
      if (this.data.isSubmit) {
        this.setData({
          showModal: false
        });
      } else {
        this.setData({
          showModal: false,
          avatarTempPath: ""
        });
      }
    },
    switchTitleChange: function(e) {
      console.log(e.detail.value)
      var that = this;
      that.setData({
        showTitle: e.detail.value
      })
    },
    switchTextColorChange: function(e) {
      console.log("textColorChange: ",e.detail.value)
      var that = this;
      if (e.detail.value) {
        that.setData({
          textColor: "white"
        })
      } else {
        that.setData({
          textColor: "black"
        })
      }
    },
    onFromSubmit: function(e) {
      var that = this;
      console.log(e)
      console.log(that.data.avatarTempPath)

      if (that.data.avatarTempPath) {
        that.setData({
          isSubmit: true
        })
      } else {
        wx.showToast({
          title: '背景图片未选择！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      that.setData({
        showModal: false
      })
    
      that.data.eventMsg.avatarTempPath = that.data.avatarTempPath;
      that.data.eventMsg.nickName = e.detail.value.nickname;
      that.data.eventMsg.slogan = e.detail.value.slogan;
      that.data.eventMsg.showTitle = that.data.showTitle;
      that.data.eventMsg.textColor = that.data.textColor;
      that.setData({
        eventMsg: that.data.eventMsg
      }, () => {
        that.triggerEvent('settingChange', that.data.eventMsg);
      });
    },
    onAvatarUpload: function (e) {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          console.log(res);
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success(res1) {
              console.log("width: ", res1.width)
              console.log("height: ", res1.height)
              if (((res1.width / res1.height) - 1) > 0) {
                wx.showToast({
                  title: '仅支持竖图！',
                  icon: 'none',
                  duration: 2000
                })
                return;
              }

              that.data.eventMsg.avatarW = res1.width;
              that.data.eventMsg.avatarH = res1.height;
              that.data.eventMsg.whRatio = res1.width / res1.height;
              that.setData({
                eventMsg: that.data.eventMsg
              });
              that.setData({
                avatarTempPath: res.tempFilePaths[0]
              })
            }
          })
        }
      })
    }
  }
  
})

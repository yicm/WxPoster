// component/WxPoster/WxPoster.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageUrl: {
      type: String,
      // pages/xiaobaiai/htmlShow/htmlShow?title=title&content=download_url
      value: 'pages/xiaobaiai/index/index',
      observer(newval, oldval) {
        var that = this;
        // console.log(newval)
        // console.log(oldval)
      }
    },
    pageTitle: {
      type: String,
      value: '小白AI',
      observer(newval, oldval) {
        var that = this;
        console.log(newval.length)
        var value = newval;
        // 标题截取，防止生成小程序码超过path长度
        if (newval.length > 21) {
          value = newval.substring(0, 20);
        }
        // console.log(oldval)
        that.setData({
          pageTitle: value
        })
      }
    },
    pageContentUrl: {
      type: String,
      value: '',
      observer(newval, oldval) {
        var that = this;
        // console.log(newval)
        // console.log(oldval)
        console.log(that.data.pageUrl);
        console.log(that.data.pageTitle);
        console.log(that.data.pageContentUrl);
        that._getQRCode();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show_aur_button: false,
    canvas_default_width: 1080,
    canvas_default_height: 1920,
    canvas_width: 1080,
    canvas_height: 1920,
    user_info: [],
    slider: [
      { id: 0, raw_url: 'https://gitee.com/yicm/Images/raw/master/xiaobaiai/poster_bg/raw_0.jpg', eg_url: "https://gitee.com/yicm/Images/raw/master/xiaobaiai/poster_bg/eg_0.jpg"}
    ],
    swiperCurrent: 0,
    showSettingModal: false,
    pageQRCodeImgUrl: "",
    settingMsg: { bgImgTempPath: "", bgImgW: 1080, nickName: "", slogan: "长按图片，精彩在里", useSetting: false, showTitle: true, whRatio: 0.6, textColor: "white"},
    sharerLogo: "./images/share.png",
    titleLogo: "./images/topic.png",
    tipLogo: "./images/tip.png"
  },

  attached() {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log("没有授权获取用户信息");
          wx.showToast({
            title: '没有授权获取用户信息',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            show_aur_button: true,
            placeholder: "未授权获取用户头像和昵称，请先授权哦。"
          });
        } else {
          console.log("已经授权获取用户信息，开始获取信息");

          wx.getUserInfo({
            success: function (res) {
              that.setData({
                user_info: res.userInfo
              }, () => {
                that._resetSettingMsg();
              });
            }
          })
        }
      }, fail: function () {
        console.log("获取用户的当前设置失败");
      }
    })
    // 开始加载swiper内容
    wx.request({
      url: "https://gitee.com/yicm/" + 'XiaoBaiAI/raw/' + "develop" + '/wxposter.json',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          slider: res.data
        });
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '加载Swiper内容失败！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      }
    })
  },
  created() {
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    console.log("windows width: ", sysInfo.windowWidth);
    console.log("screen width: ", screenWidth);
    this.factor = screenWidth / 750;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _toPx(rpx) {
      return rpx * this.factor;
    },
    _toRpx(px) {
      
      return px / this.factor;
    },
    _onGetUserInfo: function (e) {
      var that = this;
      if (e.detail.userInfo) {
        //console.log(e.detail.userInfo);
        wx.showToast({
          title: '授权成功！',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          user_info: e.detail.userInfo,
          show_aur_button: false
        }, () => {
          that._resetSettingMsg();
        });
      }
    },
    _resetSettingMsg: function() {
      var that = this;
      that.data.settingMsg.bgImgTempPath = that.data.slider[that.data.swiperCurrent].raw_url;
      //that.data.settingMsg.bgImgW = that.data.canvas_default_width;
      that.data.settingMsg.nickName = that.data.user_info.nickName;
      //that.data.settingMsg.slogan = "长按图片，精彩在里";
      that.data.settingMsg.useSetting = false;
      //that.data.settingMsg.showTitle = true;
      //that.data.settingMsg.whRatio = 0.6;
      //that.data.settingMsg.textColor = "white";
      that.setData({
        settingMsg: that.data.settingMsg
      })
    },
    _settingChange: function (e) {
      var that = this;
      console.log("settingChange: ", e)
      console.log(e.detail.avatarTempPath, e.detail.nickName, e.detail.slogan)

      that.data.settingMsg.bgImgTempPath = e.detail.avatarTempPath;
      that.data.canvas_width = (e.detail.avatarW / e.detail.avatarH) * that.data.canvas_default_height;
      console.log("canvas_width: ", that.data.canvas_width);
      that.data.settingMsg.nickName = e.detail.nickName;
      that.data.settingMsg.slogan = e.detail.slogan;
      that.data.settingMsg.showTitle = e.detail.showTitle;
      that.data.settingMsg.useSetting = true;
      that.data.settingMsg.whRatio = e.detail.whRatio;
      that.data.settingMsg.textColor = e.detail.textColor;
      that.setData({
        settingMsg: that.data.settingMsg,
        canvas_width: that.data.canvas_width
      })
    },
    _getQRCode: function (e) {
      var that = this;
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      }
      else {
        wx.cloud.init({
          traceUser: true,
        })
      }
      wx.showLoading({
        title: 'Loading...'
      })
      wx.cloud.callFunction({
        // 云函数名称
        name: 'WxQRCode',
        // 传给云函数的参数
        data: {
          path: that.data.pageUrl + '?title=' + that.data.pageTitle + '&content=' + that.data.pageContentUrl,
          is_hyaline: false,
          width: 320,
          is_qr_code: false
        },
      }).then(res => {
        console.log("remote qr result: ", res.result);
        wx.cloud.downloadFile({
          fileID: res.result.fileID,
          success: download_res => {
            // get temp file path
            console.log("localhost qr temp path: ", download_res.tempFilePath)
            that.setData({
              pageQRCodeImgUrl: download_res.tempFilePath
            }, () => {
              wx.hideLoading();
            })
            // preview the QR image
            // wx.previewImage({
            //   current: '',
            //   urls: [download_res.tempFilePath],
            //   success: function (res) {
            //   },
            //   fail: function (res) {
            //   },
            //   complete: function (res) {
            //   },
            // })

            wx.cloud.deleteFile({
              fileList: [res.result.fileID]
            }).then(delete_res => {
              // handle success
              
              console.log(delete_res.fileList)
            }).catch(error => {
              // handle error
            
            })
          },
          fail: err => {
            // handle error
            wx.hideLoading();
            wx.showToast({
              title: 'Loading Failed',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }).catch(console.error)
    },
    _onSettingTap: function (e) {
      var that = this;
      if (that.data.show_aur_button) {
        wx.showToast({
          title: '请您先授权获取头像',
          icon: 'none',
          duration: 2000
        })
        return ;
      }

      that.setData({
        showSettingModal: true
      })
    },
    _onAboutWxPosterTap: function(e) {
      wx.showToast({
        title: 'Powered by yicm.github.io',
        icon: 'none',
        duration: 2000
      })
    },
    _swiperChange: function (e) {
      var that = this;
      that.setData({
        swiperCurrent: e.detail.current
      })
      console.log("swiperCurrent: ", this.data.swiperCurrent);
      that._resetSettingMsg();
    },
    _createCanvasImgByLocalImg: function() {
      var that = this;
      console.log("_createCanvasImgByLocalImg");
      const context = wx.createCanvasContext('poster_canvas', this);
      // 原则： 下层覆盖上层
      // 画背景图
      console.log("bgImgTempPath: ", that.data.settingMsg.bgImgTempPath);

      context.drawImage(that.data.settingMsg.bgImgTempPath, 0, 0, that._toPx(that.data.canvas_width), that._toPx(that.data.canvas_default_height));
      context.draw(false, setTimeout(function (e) {
        console.log("2");
        // 画外框
        if (that.data.settingMsg.textColor == 'white') {
          context.setStrokeStyle('white')
        } else {
          context.setStrokeStyle('black');
        }
        context.strokeRect(that._toPx(20), that._toPx(20), that._toPx(that.data.canvas_width - 40), that._toPx(that.data.canvas_default_height - 40));
        // 画小程序码
        var acode_radius = 160;
        var acode_x = 45;
        var acode_y = 1545;
        console.log("pageQRCodeImgUrl: ", that.data.pageQRCodeImgUrl);
        context.drawImage(that.data.pageQRCodeImgUrl, that._toPx(acode_x),
          that._toPx(acode_y), that._toPx(acode_radius * 2), that._toPx(acode_radius * 2));
        console.log("3");
        // 画字体
        var font_x = acode_x + acode_radius * 2 + 45;
        var font_y = acode_y + acode_radius - 70;
        var font_logo_size = 60;
        if (that.data.settingMsg.whRatio < 0.65) {
          // 兼容宽高比较小的图片，防止文字超出边界
          context.font = 'normal bold 18px sans-serif';
        } else {
          context.font = 'normal bold 22px sans-serif';
        }
        if (that.data.settingMsg.textColor == 'white') {
          context.setFillStyle('white');
        } else {
          context.setFillStyle('black');
        }
        context.setTextBaseline('top')
        if (that.data.settingMsg.nickName) {
          // 画分享者昵称
          context.drawImage(that.data.sharerLogo, that._toPx(font_x), that._toPx(font_y),
            that._toPx(font_logo_size), that._toPx(font_logo_size));
          context.fillText(that.data.settingMsg.nickName, that._toPx(font_x + 80), that._toPx(font_y + 10));
        }
        if (that.data.settingMsg.showTitle) {
          // 画主题
          var topic_y = font_y + 70;
          context.drawImage(that.data.titleLogo, that._toPx(font_x), that._toPx(topic_y),
            that._toPx(font_logo_size), that._toPx(font_logo_size));
          context.fillText(that.data.pageTitle, that._toPx(font_x + 80), that._toPx(topic_y + 10))
        }
        if (that.data.settingMsg.slogan) {
          // 画提示
          var slogan_y = font_y + 140;
          context.drawImage(that.data.tipLogo, that._toPx(font_x), that._toPx(slogan_y),
            that._toPx(font_logo_size), that._toPx(font_logo_size));
          context.fillText(that.data.settingMsg.slogan, that._toPx(font_x + 80), that._toPx(slogan_y + 10))
        }

        wx.downloadFile({
          url: that.data.user_info.avatarUrl,
          success: function (res) {
            console.log("avatar local path: ", res.tempFilePath)
            // 绘制头像
            // 小程序码如实际大小为430 -> 则可以测量得到码中头像半径r=95;
            // 小程序码中头像半径占整个码的比例为95/215
            // 则小程序码实际大小更换为320有，95/215=x/160，新码半径x=70.697，直径141.39
            const real_diameter = 141.39;
            var radius = that._toPx(real_diameter / 2);
            var avatar_x = acode_x + acode_radius - real_diameter / 2;
            var avatar_y = acode_y + acode_radius - real_diameter / 2;
            context.save();
            context.beginPath();
            context.arc(radius + that._toPx(avatar_x), radius + that._toPx(avatar_y), radius, 0, Math.PI * 2);
            context.clip();
            context.drawImage(res.tempFilePath, that._toPx(avatar_x), that._toPx(avatar_y), radius * 2, radius * 2);
            context.restore()
            context.draw(true, setTimeout(function (e) {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: that._toPx(that.data.canvas_width),
                height: that._toPx(that.data.canvas_default_height),
                canvasId: 'poster_canvas',
                quality: 1.0,
                success: function (res) {
                  let pic = res.tempFilePath;
                  console.log(pic);
                  wx.hideLoading();
                  wx.previewImage({
                    urls: [res.tempFilePath],
                  })
                  // 重置设置内容
                  that._resetSettingMsg();
                }, fail: function (res) {
                  wx.hideLoading();
                  console.log(res)
                }
              }, that); // end canvasToTempFilePath
            }, 220)) // end second draw
          } // end succcess callback functon of downloading avatar 
        })  // end download avatar
      }, 220)) // end first draw
    },
    _createCanvasImgByRemoteUrl: function() {
      var that = this;
      console.log("_createCanvasImgByRemoteUrl");
      
      // 原则： 下层覆盖上层
      // 画背景图
      console.log("bgImgTempPath: ", that.data.settingMsg.bgImgTempPath);
      wx.downloadFile({
        url: that.data.settingMsg.bgImgTempPath,
        success: function (bgRes) {
          wx.getImageInfo({
            src: bgRes.tempFilePath,
            success(imgInfo) {
              that.data.canvas_width = (imgInfo.width / imgInfo.height) * that.data.canvas_default_height;
              that.setData({
                canvas_width: that.data.canvas_width
              }, () => {
                // 创建画布
                const context = wx.createCanvasContext('poster_canvas', that);
                // 画背景图
                context.drawImage(bgRes.tempFilePath, 0, 0, that._toPx(that.data.canvas_width), that._toPx(that.data.canvas_default_height));

                context.draw(false, setTimeout(function (e) {
                  console.log("2");
                  // 画外框
                  if (that.data.settingMsg.textColor == 'white') {
                    context.setStrokeStyle('white');
                  } else {
                    context.setStrokeStyle('black');
                  }
                  
                  context.strokeRect(that._toPx(20), that._toPx(20), that._toPx(that.data.canvas_width - 40), that._toPx(that.data.canvas_default_height - 40));
                  // 画小程序码
                  var acode_radius = 160;
                  var acode_x = 45;
                  var acode_y = 1545;
                  context.drawImage(that.data.pageQRCodeImgUrl, that._toPx(acode_x),
                    that._toPx(acode_y), that._toPx(acode_radius * 2), that._toPx(acode_radius * 2));
                  // 画字体
                  var font_x = acode_x + acode_radius * 2 + 45;
                  var font_y = acode_y + acode_radius - 70;
                  var font_logo_size = 60;
                  if ((imgInfo.width / imgInfo.height) < 0.65) {
                    // 兼容宽高比较小的图片，防止文字超出边界
                    context.font = 'normal bold 18px sans-serif';
                  } else {
                    context.font = 'normal bold 22px sans-serif';
                  }
                  
                  if (that.data.settingMsg.textColor == 'white') {
                    context.setFillStyle('white');
                  } else {
                    context.setFillStyle('black');
                  }
                  context.setTextBaseline('top')
                  if (that.data.settingMsg.nickName) {
                    // 画分享者昵称
                    context.drawImage(that.data.sharerLogo, that._toPx(font_x), that._toPx(font_y),
                      that._toPx(font_logo_size), that._toPx(font_logo_size));
                    context.fillText(that.data.settingMsg.nickName, that._toPx(font_x + 80), that._toPx(font_y + 10));
                  }
                  if (that.data.settingMsg.showTitle) {
                    // 画主题
                    var topic_y = font_y + 70;
                    context.drawImage(that.data.titleLogo, that._toPx(font_x), that._toPx(topic_y),
                      that._toPx(font_logo_size), that._toPx(font_logo_size));
                    context.fillText(that.data.pageTitle, that._toPx(font_x + 80), that._toPx(topic_y + 10))
                  }
                  if (that.data.settingMsg.slogan) {
                    // 画提示
                    var slogan_y = font_y + 140;
                    context.drawImage(that.data.tipLogo, that._toPx(font_x), that._toPx(slogan_y),
                      that._toPx(font_logo_size), that._toPx(font_logo_size));
                    context.fillText(that.data.settingMsg.slogan, that._toPx(font_x + 80), that._toPx(slogan_y + 10))
                  }

                  // 绘制头像
                  wx.downloadFile({
                    url: that.data.user_info.avatarUrl,
                    success: function (res) {
                      console.log("avatar local path: ", res.tempFilePath)
                      // 小程序码如实际大小为430 -> 则可以测量得到码中头像半径r=95;
                      // 小程序码中头像半径占整个码的比例为95/215
                      // 则小程序码实际大小更换为320有，95/215=x/160，新码半径x=70.697，直径141.39
                      const real_diameter = 141.39;
                      var radius = that._toPx(real_diameter / 2);
                      var avatar_x = acode_x + acode_radius - real_diameter / 2;
                      var avatar_y = acode_y + acode_radius - real_diameter / 2;
                      context.save();
                      context.beginPath();
                      context.arc(radius + that._toPx(avatar_x), radius + that._toPx(avatar_y), radius, 0, Math.PI * 2);
                      context.clip();
                      context.drawImage(res.tempFilePath, that._toPx(avatar_x), that._toPx(avatar_y), radius * 2, radius * 2);
                      context.restore()
                      context.draw(true, setTimeout(function (e) {
                        wx.canvasToTempFilePath({
                          x: 0,
                          y: 0,
                          width: that._toPx(that.data.canvas_width),
                          height: that._toPx(that.data.canvas_default_height),
                          canvasId: 'poster_canvas',
                          quality: 1.0,
                          success: function (res) {
                            let pic = res.tempFilePath;
                            console.log(pic);
                            wx.hideLoading();
                            wx.previewImage({
                              urls: [res.tempFilePath],
                            })
                            // 重置设置内容
                            that._resetSettingMsg();
                          }, fail: function (res) {
                            wx.hideLoading();
                            console.log(res)
                          }
                        }, that); // end canvasToTempFilePath
                      }, 220)) // end second draw
                    } // end succcess callback functon of downloading avatar 
                  })  // end download avatar
                }, 220)) // end first draw
              }) // end setData in getImageInfo
            } // end success calback function of getting image info
          }) // end get image info after downloading bg image
        } // end success callback function of downloading backgroud image
      }) // end download backgroud image
    },
    _onStartGeneratePoster: function(e) {
      var that = this;
      console.log("_onStartGeneratePoster");
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            user_info: res.userInfo
          });
          //console.log("user_info: ", that.data.user_info);
          wx.showLoading({
            title: 'Loading...'
          })
          if (that.data.settingMsg.useSetting) {
            that._createCanvasImgByLocalImg();
          } else {
            that._createCanvasImgByRemoteUrl();
          }
        }
      })
    }
  }
})

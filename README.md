# WxPoster

`WxPoster`是一个微信小程序海报分享组件，使用简单，只需要将组件嵌入到想要分享的页面，传入页面路径和标题就可以生成漂亮的带小程序码的分享海报。

# 特点

- 多海报模板支持
- 动态设置
    - 分享引导语自定义
    - 分享者昵称(默认获取微信昵称)自定义
    - 分享海报的背景图片自定义
    - 支持海报文字颜色的设置(目前黑白)
    - 标题、昵称、引导语显示与否的设置
- 组件形式，方便集成
- 友好的UI界面和交互界面
- 自适应自定义背景图片
- 支持微信用户信息获取

# 组件截图

下图为`WxPoster`嵌入式到具体博客中显示的效果。

![](https://raw.githubusercontent.com/yicm/WxPoster/master/screenshot/WxPoster_bg_1.png)

![](https://raw.githubusercontent.com/yicm/WxPoster/master/screenshot/WxPoster_bg_2.png)

![](https://raw.githubusercontent.com/yicm/WxPoster/master/screenshot/WxPoster_bg_3.png)

# 快速入手

- 准备(需设置内容可搜索`MUST_SET`关键词快速找出)
    - 百度短地址token获取(因小程序码A/C功能函数path限制长度128字节，页面参数中包含网址短地址化)
    - 创建云函数WxQRCode获取页面小程序码(需要设置appid和secret)
- 集成
    - github 克隆下工程，参考集成示例


`WxPoster`组件属性说明：

```bash
pageUrl: 分享的页面路径，如pages/index/index
pageTitle：分享页面的主题或标题，该属性为页面的参数，可选择设置
pageContentUrl: 分享页面的内容URL，该属性为页面的参数，可选择设置
```

# Demo

小程序`小白AI`博客引WxPoster组件示例，每篇文章页面均有嵌入该组件：

![](https://raw.githubusercontent.com/yicm/WxComment/master/screenshot/xiaobaiai.jpg)


# TODO

- 多模板多样式
- 海报细节设置，如多颜色字体

# License

[MIT](https://opensource.org/licenses/MIT)

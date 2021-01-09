# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


<view class="index_top">
    <!-- <view class="index_search"> -->
    <l-search-bar class="index_search" placeholder="搜索" />
    <!-- </view> -->
    <view class="index_tab">
      <l-segment active-color='{{globalData.color}}' bind:linchange="changeTabs">
        <l-segment-item tab="最近更新" key="tab_one" />
        <l-segment-item tab="时间正序" key="tab_two" />
        <l-segment-item tab="点赞次数" key="tab_three" />
        <l-segment-item tab="浏览次数" key="tab_four" />
      </l-segment>
    </view>
  </view>

      <!-- 左图 -->
      <view class="diary_main">
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
      </view>

      <!-- 右图 -->
      <view class="diary_main">
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
      </view>

       <!-- 左图 -->
       <view class="diary_main">
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
      </view>

      <!-- 右图 -->
      <view class="diary_main">
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
      </view>

       <!-- 左图 -->
       <view class="diary_main">
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
      </view>

      <!-- 右图 -->
      <view class="diary_main">
        <view class="diary_right">
          <view class="diary_title">关于小柴日记簿</view>
          <view class="diary_time">2021.01.07 20:05:32</view>
          <view class="diary_location">江苏省无锡市羊尖镇好几个ID卡就复活更得看个东方航空结构化发动机盖快递费刚发的</view>
          <view class="diary_more">1天 | 浏览1次</view>
          <view class="diary_bottom"></view>
        </view>
        <view class="diary_left">
          <image mode='aspectFill' src='http://data.littlechai.cn/blog_bg28.jpg'></image>
        </view>
      </view>
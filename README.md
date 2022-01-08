## 微信小程序-小柴随心记2.0(原小柴日记簿)

![小柴随心记二维码](./diary.png)

## 开发文档

### 1.克隆项目，地址： https://github.com/LittleChai/littlechai_diary2.0.git

---

### 2.登录&复制AppId[微信公众平台](https://mp.weixin.qq.com)
+ 如果没有注册需要先注册一个个人小程序
+ 登录完成后 点击左侧 **开发** 找到 **开发设置** 找到你的**AppID** 复制下来

---

### 3.下载微信开发者工具 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
+ 稳定版，预发布版，开发版都可安装

---

### 4.云开发开通
+ 使用微信开发者工具打开改项目
+ 点击微信开发者工具左侧云开发
+ 环境名称自己输入喜欢的，点击开通
+ 开通完成后，复制右上角的环境ID

---

### 5.修改项目配置参数
+ 找到根目录下的 **project.config.json**文件，找到39行的**Appid**，修改值为你刚才复制的**AppID**
+ 找到根目录下的 **app.js**文件，找到13行的**env**，修改值为你刚才复制的**环境ID**
+ 重新打开一下开发者工具，找到根目录的**cloudfunctions**,右击，看是否自动选择了刚才创建的云开发环境，没有的话手动选择一下
+ **cloudfunctions**文件夹下每个文件夹都右键 > 创建并部署(云端安装依赖)
+ 目前微信云开发免费版限制了云函数的数量，需要开通特惠基础版1才能上传所有云函数，需要花费6.9元/月(微信太狗了吧，之前创建的可以不用花钱)

---

### 6.云开发配置
+ 找到数据库一栏，点击加号创建集合
+ 创建集合 **admin**、**comments**、**diarys**、**questions**、**users**、**versions**
+ 给**admin**集合添加记录，使用默认模式添加
   + 字段1：controlChat，类型：boolean，值：false
   + 字段2：controlDiary，类型：boolean，值：false
   + 字段3：openid，类型：array，值：不填
+ 创建成功后，复制 **_id** 值，找到 **cloudfunctions** 下的 **getAdminX** 文件夹，打开index.js文件，修改12行 **_id** 的值为刚才复制的 **_id** ，修改完后必须重新上传
+ 给**versions**集合添加记录，使用默认模式添加
   + 字段1：arr，类型：array，值：不填
   + 字段2：updatedTime，类型：string，值：不填
   + 字段3：openid，类型：string，值：不填
   + 字段4：version，类型：string，值：不填
+ 创建成功后，复制 **_id** 值，找到 **cloudfunctions** 下的 **getVersion**，**getVersionOne** 文件夹，打开index.js文件，修改13行 **_id** 的值为刚才复制的 **_id** ，修改完后必须重新上传
+ 上面步骤完成以后，清除缓存，点击全部，点击编译，确保控制台没有报错
+ 在**我的**里面，点击微信图标进行登录注册
+ 注册完成后在云开发的**users**集合中找到新增的一项，找到**openid**,复制值
+ 修改**users**集合中新增的一项，找到**roles**数组,把**user**改成**admin**
+ 在**admin**集合中找到刚才添加的一项，在**openid**数组中添加复制的**openid**
+ 在**versions**集合中找到刚才添加的一项，在**openid**字符串中添加复制的**openid**
---   

### 7.权限管理
   + 每个集合的权限一定要设置成 **所有用户可读，仅创建者可读写**

---   

### 8.完成
   + 编译小程序，即可新建日记   


### License

[MIT](LICENSE)


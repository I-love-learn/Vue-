# HW电商后台

### 项目截图

![](.\资料\mdImages\登录界面.png)

![](.\资料\mdImages\后台欢迎界面.png)

![角色列表](.\资料\mdImages\角色列表.png)

![商品列表](.\资料\mdImages\商品列表.png)

![数据报表](.\资料\mdImages\数据报表.png)

![添加分类](.\资料\mdImages\添加分类.png)

![添加商品](.\资料\mdImages\添加商品.png)

![用户列表](.\资料\mdImages\用户列表.png)

### 项目主要技术栈

vue2.x，vuerouter，vuex，element-ui，数据交互用到了axios，后端是用node写的，包管理工具是yarn，代码规范使用eslint。

### 其他注意点

登录/退出功能使用token保持登陆状态。

vuerouter是用的hash而非history。

### 项目整体思路与教程

项目主要思路来自于b站黑马前端的电商管理后台，想从头到尾完整敲一遍的话可去b站搜索黑马电商后台，跟随视频学习。

### 项目适用人群

 vue初学者，毕业设计等等。

### 项目运行

首先下载vue_api_server文件夹，然后npm i 安装依赖包，这个是我们的本地服务器文件，安装完毕后，下载phpstudy_pro,配置mysql，配置很简单，只需要新建一个数据库，数据库的命名与vue_api_server文件夹下config中的default.json保持一致即可（很重要）。

![](.\资料\mdImages\新建数据库.png)

![](.\资料\mdImages\命名.png)

导入数据库

![](.\资料\mdImages\导入数据库.png)

浏览选择vue_api_server文件夹下db文件夹下的mydb.sql。



上面步骤完毕后，可在vue_api_server文件夹下运行终端node app.js 将服务器启动。

进入项目文件夹下，正常yarn i 安装依赖，yarn serve启动项目。
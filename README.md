# HW电商后台

### 项目截图

![登录界面](%E8%B5%84%E6%96%99/mdImages/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.png)

![后台主界面](%E8%B5%84%E6%96%99/mdImages/%E5%90%8E%E5%8F%B0%E6%AC%A2%E8%BF%8E%E7%95%8C%E9%9D%A2.png)

![角色列表](%E8%B5%84%E6%96%99/mdImages/%E8%A7%92%E8%89%B2%E5%88%97%E8%A1%A8.png)

![商品列表](%E8%B5%84%E6%96%99/mdImages/%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8.png)

![数据报表](%E8%B5%84%E6%96%99/mdImages/%E6%95%B0%E6%8D%AE%E6%8A%A5%E8%A1%A8.png)

![添加分类](%E8%B5%84%E6%96%99/mdImages/%E6%B7%BB%E5%8A%A0%E5%88%86%E7%B1%BB.png)

![添加商品](%E8%B5%84%E6%96%99/mdImages/%E6%B7%BB%E5%8A%A0%E5%95%86%E5%93%81.png)

![用户列表](%E8%B5%84%E6%96%99/mdImages/%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8.png)

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

![输入图片说明](%E8%B5%84%E6%96%99/mdImages/%E6%96%B0%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93.png)

![输入图片说明](%E8%B5%84%E6%96%99/mdImages/%E5%91%BD%E5%90%8D.png)

导入数据库

![输入图片说明](%E8%B5%84%E6%96%99/mdImages/%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE%E5%BA%93.png)

浏览选择vue_api_server文件夹下db文件夹下的mydb.sql。



上面步骤完毕后，可在vue_api_server文件夹下运行终端node app.js 将服务器启动。

进入项目文件夹下，正常yarn i 安装依赖，yarn serve启动项目。
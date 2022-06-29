# HW电商后台

### 项目截图

![登录界面](https://user-images.githubusercontent.com/95730717/176366448-f2c9ff67-ef2a-4145-ba01-cf31d1d9224d.png)

![后台欢迎界面](https://user-images.githubusercontent.com/95730717/176366623-65752d6e-4e8e-4231-a8e3-f2a75403966e.png)

![角色列表](https://user-images.githubusercontent.com/95730717/176366688-7691ba6d-0d37-4f58-9caa-716e1e330a99.png)

![商品列表](https://user-images.githubusercontent.com/95730717/176366748-59c6cf75-75e5-45fb-9172-080cae531510.png)

![数据报表](https://user-images.githubusercontent.com/95730717/176366824-4deafcfd-3ab7-4ae5-afbb-e2cd4f7b5d73.png)

![添加分类](https://user-images.githubusercontent.com/95730717/176366862-d3522444-23a0-4e1e-bc25-c94854e5b2e7.png)

![添加商品](https://user-images.githubusercontent.com/95730717/176366912-1e94fbd4-ad90-4fe5-a256-68212fc29a07.png)

![用户列表](https://user-images.githubusercontent.com/95730717/176366949-dbbd7f85-19e0-4496-8054-c05aa7384a7a.png)

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

![新建数据库](https://user-images.githubusercontent.com/95730717/176367020-c91ab592-06db-4bfc-8103-0597fb28d42d.png)

![命名](https://user-images.githubusercontent.com/95730717/176367047-b6557048-1adb-4875-a072-eaddb49cab58.png)

导入数据库

![导入数据库](https://user-images.githubusercontent.com/95730717/176367084-ec3740cb-3c2a-4dc6-a170-585488c3d2b8.png)

浏览选择vue_api_server文件夹下db文件夹下的mydb.sql。



上面步骤完毕后，可在vue_api_server文件夹下运行终端node app.js 将服务器启动。

进入项目文件夹下，正常yarn i 安装依赖，yarn serve启动项目。

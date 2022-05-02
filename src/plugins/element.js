import Vue from 'vue'
import { Button, Input, Form, FormItem, Message, MessageBox, Container, Header, Aside, Footer, Main, Menu, MenuItem, Submenu, Drawer, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Tag, Switch, Tooltip, Pagination, Dialog } from 'element-ui'
// 注册是要一个个注册 而不能同时注册 用逗号分开不可以
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
// 每一行的表单控件样式  formitem  不导入它 每一行的表单便没有边距 全都挤在一起
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Drawer)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// $message挂载到prototype上 不需要use注册
Vue.prototype.$message = Message
// 这么引入才是正确的 http://t.zoukankan.com/cxxb-p-11989637.html
Vue.prototype.$confirm = MessageBox.confirm

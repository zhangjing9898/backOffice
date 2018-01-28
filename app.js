var express = require("express");
var app = express();
var router = require("./router/router.js");

var session = require('express-session');

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//模板引擎
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));
//路由表
app.get("/",router.showIndex);              //显示首页
app.get("/index",router.afterLogin);
app.get("/showUserList",router.showUserList);
app.get("/deleteUser",router.deleteUser);
app.get("/hotImgData",router.hotImgData);
app.get("/articleData",router.articleData);
app.get("/userImg",router.userImg);
app.post("/doLogin",router.dologin);
app.get("/exit",router.exit);
app.listen(8000);

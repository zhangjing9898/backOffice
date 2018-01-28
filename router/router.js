/**
 * Created by Danny on 2015/9/26 15:39.
 */
var express = require("express");
var app = express();
session = require('express-session');
var formidable = require("formidable");
var db = require("../models/db");
var path = require("path");
var fs = require("fs");
var md5 = require("../models/md5");
var sd = require("silly-datetime");
var ObjectId = require('mongodb').ObjectID;

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

exports.showIndex = function (req, res, next) {
        res.render("login")
};

//登录之后
exports.afterLogin=function (req,res,next) {
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面只能管理员查看！");
        return;
    }
    res.render("index",{
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : ""
    });
}

//显示注册过的用户
exports.showUserList=function (req,res,next) {
    db.find("users",{},function (err,result) {
        if (err || result.length == 0) {
            res.json("");
            return;
        }
        res.json(result);
    })
}

//删除用户
exports.deleteUser=function (req, res) {
    //接收其他参数
    var deleteid = req.query.deleteid;
    //插入数据到DB中
    db.deleteMany("users", {"_id": ObjectId(deleteid)}, function (err, result) {
        if (err) {
            res.send("-1");
            return;
        }
        res.send("1"); //删除成功
    })
};

//佳片显示
exports.hotImgData=function (req,res,next) {
    var page=req.query.page;
    db.find("Photo",{},function (err,result) {
        if(page>=result.length){
            res.send("101");
            return;
        }else if(err){
            res.json("")
            return;
        }
        res.json(result[page]);
    })
};

//文章详情
exports.articleData=function (req,res,next) {
    var page=req.query.page;
    db.find("course",{},function (err,result) {
        if(page>=result.length){
            res.send("101");
            return;
        }else if(err){
            res.json("")
            return;
        }
        res.json(result[page]);
    })
};

//用户图片
exports.userImg=function (req,res,next) {
    var dengluming=req.query.dengluming;
    db.find("Img",{"dengluming":dengluming},function (err,result) {
        if(err){
            res.send("error");
            return;
        }
        res.json(result);
    })
}

//管理员登录
exports.dologin=function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var dengluming = fields.dengluming;
        var mima = fields.mima;
        //检索数据库，按登录名检索数据库，查看密码是否匹配
        db.find("manager", {"dengluming": dengluming}, function (err, result) {
            // console.log(result);
            if (result.length == 0) {
                console.log("-2");
                res.send("-2");  //-2没有这个人
                return;
            }
            var shujukuzhongdemima = result[0].mima;
            //要对用户这次输入的密码，进行相同的加密操作。然后与
            //数据库中的密码进行比对
            if (mima == shujukuzhongdemima) {
                console.log("1")
                req.session.login = "1";
                req.session.username = dengluming;
                res.send("1");  //成功
            } else {
                console.log("-1");
                res.send("-1"); //密码不匹配
            }
        });
    })
}

//退出
exports.exit=function (req,res) {
    delete req.session.username;
    req.session.login="-1";
    res.redirect('/');
}

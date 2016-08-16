//require('newrelic');
var express = require('express');
var app = express();
var users = require('./Service/users');
var hire = require('./Service/hire');
var index = require('./Service/index');
var activity = require('./Service/activity');
var info = require('./Service/information');
var invest = require('./Service/investigation');
var circle = require('./Service/circle');
var messages = require('./Service/messages');
var inform = require('./Service/inform');
var sysNotice = require('./Service/systemNotification');
var imageupload = require('./Service/multerUtil.js');
var bodyParser = require('body-parser');
var json = require('json');


var session = require('express-session');
//var cookieParser = require('cookie-parser'); //如果要使用cookie，需要显式包含这个模块
var RedisStore = require('connect-redis')(session);

var db;



// 加载用于解析 cookie 的中间件
//app.use(cookieParser());

//var IM = require('./Service/rongIM');
//var urlencoded = require('urlencoded');
var errorhandler = require('errorhandler');
var log4js = require('log4js');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/041403app';

var RY_APP_KEY = "x4vkb1qpvdm7k";
var RY_APP_SECRET = "0rLbwHWuVlB";
var rongcloudSDK = require( 'rongcloud-sdk' );
rongcloudSDK.init( RY_APP_KEY, RY_APP_SECRET);
app.get('/call', function (req, res) {
    rongcloudSDK.user.getToken( '0001', 'Lance', 'http://files.domain.com/avatar.jpg', function( err, resultText ) {
        if( err ) {
            // Handle the error
            res.send(resultText);
        } else {
            var result = JSON.parse( resultText );
            if( result.code === 200 ) {
                //Handle the result.token
                res.send(result);
            }
        }
    } );
    //res.send("hello call");
})
app.post('/getRongYunToken', function (req, res) {

    var userid = "";
    var name = "";
    var url = "";

    console.log(req.body);

    //var ret = JSON.parse(req.body);
    //if ( ret.code === 200 ) {
    //    console.log(ret["userid"]);
    //    console.log(ret["name"]);
    //    console.log(ret["url"]);
    //}
    //res.json(req.body);

    var ret = req.body;
    userid = ret['userid'];
    name = ret['name'];
    url = ret['url'];

    if (typeof(userid) == "undefined" || typeof(name) =="undefined" || typeof(url) =="undefined") {
        userid = "001";
        name= "john";
        url = "www.google.com";
    }
    rongcloudSDK.user.getToken( userid, name, url, function( err, resultText ) {
        if( err ) {
            // Handle the error
            res.send(resultText);
        } else {
            var result = JSON.parse( resultText );
            if( result.code === 200 ) {
                //Handle the result.token
                res.send(result);
            }
        }
    } );
    //res.send("hello call");
})


app.use(bodyParser({limit: '50mb'}));
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../app/www',{index:'index.html'}));
app.use(express.static('./'));

//
app.use(session({
    store: new RedisStore({
        host: "127.0.0.1",
        port: 6379,
        db: 1,
        logErrors:true
    }),
    secret: 'keyboard cat by csll',
    resave:false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        //set secure to true in production env
        //secure:true,
    }
}))


//通过session获取连接用户id(userId)及用户名(userName)并存储在res.locals={userId:'',userName:''},可以在整个http连接期间
//访问改变量获取当前用户信息.并设置登录状态.
app.use(function (req, res, next) {
    //var cookiesMaxAge = req.cookie.maxAge;
    var sess = req.session;
    console.log('sessionId:',req.sessionID);
    res.locals = sess;
    //console.log('cookie:',(req.cookie));
    console.log(res.locals)
    next();
})

app.get('/echo', function (req, res) {
    res.send("<h1>Echo</h1>");
})
app.post('/echo', function (req, res) {
    res.send("<h1>Echo</h1>");
})
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//for images uploading
app.use('/upload',function(req,res){
  imageupload.upload(req,res);
})


app.get('/service', function (req, res) {
    var action=req.query.action;
    var param=parse(req.query.param,res);
    var data=parse(req.query.data,res);
    switch (action)
    {
        case "new_sysNotice":
            dbcon(sysNotice.new_sysNotice,data,param,res);
            break;
        case "delete_sysNotice":
            dbcon(sysNotice.delete_sysNotice,data,param,res);
            break;
        case "new_circle_sysNotice":
            dbcon(sysNotice.new_circle_sysNotice,data,param,res);
            break;
        case "update_sysNotice":
            dbcon(sysNotice.update_sysNotice,data,param,res);
            break;
        case "get_all_sysNotice":
            dbcon(sysNotice.get_all_sysNotice,data,param,res);
            break;
        case "get_all_psysNotice":
            dbcon(sysNotice.get_all_psysNotice,data,param,res);
            break;
        case "update_a_sysNotice":
            dbcon(sysNotice.update_a_sysNotice,data,param,res);
            break;
        case "refresh_sysNotice":
            dbcon(users.refresh_sysNotice,data,param,res);
            break;

        case "get_toPerson_message":
            dbcon(messages.get_toPerson_message,data,param,res);
            break;
        case "update_user_message":
            dbcon(messages.update_user_message,data,param,res);
            break;
        case "get_all_pMessage":
            dbcon(messages.get_all_pMessage,data,param,res);
            break;
        case "refresh_message":
            dbcon(messages.refresh_message,data,param,res);
            break;

        case "update_message_delete":
            dbcon(messages.update_message_delete,data,param,res);
            break;



        case "new_inform":
            dbcon(inform.new_inform,data,param,res);
            break;
        case "get_participate_item":
            dbcon(users.get_participate_item,data,param,res);
            break;
        /*
         * Circle
         * */
        //Get data for circle-index.html
        case "get_circle_index":
            dbcon(circle.get_circle_index,data,param,res);
            break;
        case "check_add_user":
            dbcon(circle.check_add_user,data,param,res);
            break;
        case "delete_circle":
            dbcon(circle.delete_circle,data,param,res);
            break;

        case "unset_circle_manager":
            dbcon(circle.unset_circle_manager,data,param,res);
            break;

        case "leave_circle":
            dbcon(circle.leave_circle,data,param,res);
            break;

        case "get_circle_members":
            dbcon(circle.get_circle_members,data,param,res);
            break;
        case "find_add_circle_member":
            dbcon(circle.find_add_circle_member,data,param,res);
            break;
        case "add_circle_members":
            dbcon(circle.add_circle_members,data,param,res);
            break;
        case "apply_circle":
            dbcon(circle.apply_circle,data,param,res);
            break;
        //Add a new circle
        case "add_circle":
            dbcon(circle.add_circle,data,param,res);
            break;

        //To be completed
        case "update_circle_item":
            dbcon(circle.update_circle_item,data,param,res);
            break;


        case "update_circle_members":
            dbcon(circle.update_circle_members,data,param,res);
            break;
        //To push new information/invest/hire/activity to circle
        case "update_circle_rRecord":
            dbcon(circle.update_circle_rRecord,data,param,res);
            break;


        case "update_circle_item_rRecord":
            dbcon(circle.update_circle_item_rRecord,data,param,res);
            break;

        case "submit_circle_info_rRecord":
            dbcon(circle.submit_circle_info_rRecord,data,param,res);
            break;

        //Get circle by type("myCircle/hotCircle")
        case "get_circle":
            dbcon(circle.get_circle,data,param,res);
            break;
        case "get_participate_circle":
            dbcon(circle.get_participate_circle,data,param,res);
            break;
        case "get_circle_edit":
            dbcon(circle.get_circle_edit,data,param,res);
            break;
/*        //DataHand.Sdata("get","delete_circle",{},{circleId:**})
        case "delete_circle":
            dbcon(circle.delete_circle,data,param,res);
            break;*/

        case "update_circle_messages":
            dbcon(circle.update_circle_messages,data,param,res);
            break;
        case "update_pull_circle_item":
            dbcon(circle.update_pull_circle_item,data,param,res);
            break;
        case "get_circle_messages":
            dbcon(circle.get_circle_messages,data,param,res);
            break;

        //Get specific item in circle, such as "information","hire" and so on
        case "get_circle_item":
            dbcon(circle.get_circle_item,data,param,res);
            break;
        case "get_circle_items":
            dbcon(circle.get_circle_items,data,param,res);
            break;
        case "get_circle_item_detail":
            dbcon(circle.get_circle_item_detail,data,param,res);
            break;

        case "get_index_detail":
            dbcon(index.get_index_detail,data,param,res);
            break;
        case "search_specialist":
            dbcon(index.search_specialist,data,param,res);
            break;



        case "get_info_detail":
            dbcon(info.get_info_detail,data,param,res);
            break;
        case "get_info_byType":
            dbcon(info.get_info_byType,data,param,res);
            break;
        case "submit_info_rRecord":
            dbcon(info.submit_info_rRecord,data,param,res);
            break;




        case "get_activity_evaluate":
            dbcon(activity.get_activity_evaluate,data,param,res);
            break;



        case "get_activity_detail":
            dbcon(activity.get_activity_detail,data,param,res);
            break;

        case "get_all_activities":
            dbcon(activity.get_all_activities,data,param,res);
            break;

        case "get_activity_item":
            dbcon(activity.get_activity_item,data,param,res);
            break;
        case "get_activity_edit":
            dbcon(activity.get_activity_edit,data,param,res);
            break;
        case "get_activity_area":
            dbcon(activity.get_activity_area,data,param,res);
            break;
        case "submit_activity_rRecord":
            dbcon(activity.submit_activity_rRecord,data,param,res);
            break;
        case "get_activity_registrationAdditionalModel":
            dbcon(activity.get_activity_registAdditModel,data,param,res);
            break;
        case "get_activity_evaluationModel":
            dbcon(activity.get_activity_evaluationModel,data,param,res)
            break;
        case "get_invest_byType":
            dbcon(invest.get_info_byType,data,param,res);
            break;
        case "get_invest_model":
            dbcon(invest.get_invest_model,data,param,res)
            break;
        case "submit_invest_rRecord":
            dbcon(invest.submit_invest_rRecord,data,param,res)
            break;
        case "get_invest_answer":
            dbcon(invest.get_invest_answer,data,param,res)
            break;
        case "get_invest_statistics":
            dbcon(invest.get_invest_statistics,data,param,res)
            break;
            
        //应聘
        case "apply_hire":
            dbcon(hire.apply_hire,data,param,res)
            break;
        case "get_hire_candidates":
            dbcon(hire.get_hire_candidates,data,param,res)
            break;
        case "get_hire_byParam":
            dbcon(hire.get_hire_byParam,data,param,res);
            break;

        /*
         * Publish
         * */
        /*
         * Hire
         * */
        case "add_hire":
            dbcon(hire.newhire,data,param,res)
            break;
        case "get_hire":
            dbcon(hire.get_hire,data,param,res)
            break;
        case "get_u_hire":
            dbcon(hire.get_u_hire,data,param,res)
            break;
        /*
         * Activity
         * */
        case "add_activity":
            dbcon(activity.newactivity,data,param,res)
            break;
        case "get_activity":
            dbcon(activity.getactivity,data,param,res)
            break;
        case "get_u_activity":
            dbcon(activity.get_u_activity,data,param,res)
            break;
        case "update_activity_verify":
            dbcon(activity.update_activity_verify,data,param,res)
            break;
        case "update_activity_signIn":
            dbcon(activity.update_activity_signIn,data,param,res)
            break;
        /*
         * Information
         * */
        case "add_info":
            dbcon(info.newinfo,data,param,res)
            break;
        case "get_u_info":
            dbcon(info.get_u_info,data,param,res)
            break;
        /*
         * Investigation
         * */
        case "add_invest":
            dbcon(invest.newinvest,data,param,res)
            break;
        case "get_invest_detail":
            dbcon(invest.get_invest_detail,data,param,res)
            break;
        case "get_u_invest":
            dbcon(invest.get_u_invest,data,param,res)
            break;
        /*
         * users
         * */

        case "delete_publish_item":
            dbcon(users.delete_publish_item,data,param,res)
            break;

        case "start_signIn":
            dbcon(users.start_signIn,data,param,res);
            break;

        case "update_publish_item":
            dbcon(users.update_publish_item,data,param,res);
            break;

        case "get_all_user":
            dbcon(users.get_all_user,data,param,res)
            break;
        case "get_user_basic":
            dbcon(users.get_user_basic,data,param,res)
            break;

        //login
        case "check_user_login":
            dbcon(users.check_user_login,data,param,res,req)
            break;

        case "get_friend":
            dbcon(users.get_friend,data,param,res)
            break;
        case "add_friend":
            dbcon(users.add_friend,data,param,res)
            break;

        case "apply_friend":
            dbcon(users.apply_friend,data,param,res)
            break;
        case "delete_friend":
            dbcon(users.delete_friend,data,param,res)
            break;

        case "def_friend":
            dbcon(users.def_friend,data,param,res)
            break;

        case "get_user_profile":
            dbcon(users.get_user_profile,data,param,res)
            break;
        case "update_user_info":
            dbcon(users.update_user_info,data,param,res)
            break;

        case "updatePush_user_rRecord":
            dbcon(users.updatePush_user_rRecord,data,param,res)
            break;
        case "update_user_rRecord":
            dbcon(users.update_user_rRecord,data,param,res)
            break;
/*        case "update_userarray_info":
            dbcon(users.update_userarray_info,data,param,res)
            break;*/
        case "add_user":
            dbcon(users.newuser,data,param,res,req)
            // ...
            break;
        case "del_user":
            // ...
            break;
        case "update_user":
            dbcon(users.updateuser,data,param,res)
            break;
        case "updatearray_user":
            dbcon(users.updatearrayuser,data,param,res)
            break;
        case "updatepush_user":
            dbcon(users.updatepushuser,data,param,res)
            break;
        case "updatepull_user":
            dbcon(users.updatepulluser,data,param,res)
            break;
        case "IM_gettoken":
            dbcon(IM.gettoken,data,param,res)
            break;
        default:
            res.send('非法请求');
    }
})

app.post('/service', function (req, res) {
    var action=req.query.action;
    var param=parse(req.query.param,res);
    var data=req.body;
    console.log(data);
    switch (action)
    {
        /*
         * Activity
         * */
        case "add_activity":
            dbcon(activity.newactivity,data,param,res)
            break;
        case "add_invest":
            dbcon(invest.newinvest,data,param,res)
            break;
        case "update_user_info":
            dbcon(users.update_user_info,data,param,res)
            break;
        default:
            res.send('非法请求');
    }
})

//DB connection

function dbcon(daction,data,param,res,req)
{
            try{
                daction(db,data,param,res,req);
            }
            catch(e){
                res.send("数据库操作错误:"+e);
            };
}

// Parse
function parse(data,res)
{
    //console.log(data)
    console.log('》》'+data);
    if(data&&data.userId){
        if((data.userId).find('"\"')){
            
            var rd1 = data.splice('\"');
            var rd = rd1[0];
            data.userId = rd;
            console.log(rd);
        }
    }
    for(var key in data){
        data[key].replace(/"\\/, "")
    }
    try {
        return  JSON.parse(data);
    }
    catch (e) {
        console.log('error: '+data);
        res.send('传入数据出错');
        return
    }
}

//Error handler
app.use(errorhandler({ showStack: true, dumpExceptions: true }));
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    MongoClient.connect(DB_CONN_STR,{
        db: {
            native_parser: false
        },
        server: {
            socketOptions: {
                connectTimeoutMS: 500
            }
        },
        replSet: {},
        mongos: {}
    }, function(err, database)
    {
        db = database;
        if(err)
        {
            console.log(err);
            res.send(' 数据库连接错误');
        }
        else{
            console.log("DataBase ready!")
            console.log("应用实例，访问地址为 http://%s:%s", host, port)
        }
        //res.send(' 数据库连接错误');
    });
})

var io = require('socket.io')(server);
var chatAction = require('./Service/socketio/chatAction.js');
var ppChat = io.of('/pp-chat');
var groupChat = io.of('/group-chat');
var sysChat = io.of('/sys-chat');
ppChat.on('connection', function(socket){
    chatAction.ppChat(socket,io);
});
groupChat.on('connection', function(socket){
    chatAction.groupChat(socket,io);
});
sysChat.on('connection', function(socket){
    chatAction.sysChat(socket,io);
});

/**
 * Created by yeshuijuan on 15/12/19.
 */
var  multer=require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        console.log(req.body.path)
        cb(null, req.body.path)
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, req.body.filename + "." + fileFormat[fileFormat.length - 1]);
    }
});
var uploadf = multer({
    storage: storage
});

var uploader=uploadf.single('file');


exports.upload = function (req,res) {
    uploader(req, res, function (err) {
        //添加错误处理
        if (err) {
          console.log('uploadError:'+err);
          res.send({status:"fail"})
        }
      else  res.send({status:"success"})
        //callback(req);
    });
}




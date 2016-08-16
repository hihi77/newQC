/**
 * Created by yeshuijuan on 16/3/3.
 */
angular.module('starter.Services', [])
    .constant('baseUrl', {
   url: 'http://www.caishangll.com:8081/'
   //url:'http://192.168.27.165:8081/'

   })

  //Return '$http'
  .factory('DataHand', ['$http', '$q', '$ionicLoading', function ($http, $q, $ionicLoading) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
    });
    return {
      Sdata: function (type, action, data, param) {
        //alert(baseUrl.url)
        var Sdata = {};
        var Sparam = {};
        if (data) {
          Sdata = data;
        }
        if (param) {
          Sparam = param;
        }
        if (type == "post") {
          return $http({
            method: type,

            url: baseUrl.url + "service",
            data: Sdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params: {
              'action': action,
              'param': Sparam
            }
          }).success(function () {
            //alert('success')
            $ionicLoading.hide()
          }).error(function () {
            //alert('error')
            $ionicLoading.hide()
          });
        } else {
          return $http({
            method: type,
        
            url: baseUrl.url + "service",
            params: {
              'action': action,
              'data': Sdata,
              'param': Sparam
            }
          }).success(function () {
            $ionicLoading.hide()
          }).error(function () {
            $ionicLoading.hide()
          });
        }
      },
      datajsp: function (action, param) {
        return $http.jsonp("", {
          cache: false
        });
      },


    };
  }])

  //Return 'data'

  .factory('rDataHand', ['$http', '$q', function ($http, $q) {
    return {
      Sdata: function (type, action, data, param) {
        var Sdata = {};
        var Sparam = {};
        if (data)
          Sdata = data;
        if (param)
          Sparam = param;

        return $http({
          method: type,
          url: baseUrl.url + "service",
          params: {
            'action': action,
            'data': Sdata,
            'param': Sparam
          }
        }).then(function (res) {
          return res.data;
        })
      },
      datajsp: function (action, param) {
        return $http.jsonp("", {
          cache: false
        });
      }
    };
  }])


  .factory('localStorageService', [function () {
    return {
      get: function localStorageServiceGet(key, defaultValue) {
        var stored = localStorage.getItem(key);
        try {
          stored = angular.fromJson(stored);
        } catch (error) {
          stored = null;
        }
        if (defaultValue && stored === null) {
          stored = defaultValue;
        }
        return stored;
      },
      update: function localStorageServiceUpdate(key, value) {
        if (value) {
          try {
            localStorage.setItem(key, angular.toJson(value));
          } catch (e) {
            alert("您处于无痕浏览，无法为您保存");
          }
        }
      },
      clear: function localStorageServiceClear(key) {
        localStorage.removeItem(key);
      }
    };
  }])


  .factory('pickPic', ['$timeout','$rootScope', '$q', '$ionicActionSheet', '$cordovaImagePicker', '$ionicLoading', function ($timeout,$rootScope, $q, $ionicActionSheet, $cordovaImagePicker, $ionicLoading) {
    var imagesData = [];

    function takePhoto(callback) {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true
        //cameraDirection:Camera.Direction.FRONT
      };

      function onSuccess(imageURI) {
        if (imageURI) {

          var tsrc;
          var timen = new Date().getTime();
          var fileFormat = (imageURI).split(".");
          tsrc = baseUrl.url + "uploads/" + timen + "." + fileFormat[fileFormat.length - 1];
          var data = {
            name: timen,
            src: imageURI,
            tsrc:tsrc
          };
          //alert(imageURI)
          callback(data);
          $timeout(function(){
            imagesData.push(data);
          },500);

        }
      }

      function onFail(message) {
        //alert('Failed because: ' + message);
      }

      navigator.camera.getPicture(onSuccess, onFail, options);
    }


    function pickImages(callback) {
      var options = {
        quality: 80,
        maximumImagesCount: 5,
        width: 300,
        height: 500,
        allowEdit: true
      };
      //alert($cordovaImagePicker.getPictures)
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          if (results[0]) {
            $rootScope.takeImages = results;
            var len = results.length;
            var timeName = new Date().getTime();
            for (var i = 0; i < len; i++) {
              var tsrc;
              var timen = timeName + i;
              var fileFormat = (results[i]).split(".");
              tsrc = baseUrl.url + "uploads/" + timen + "." + fileFormat[fileFormat.length - 1];
              var data = {
                name: timen,
                src: results[i],
                tsrc: tsrc
              };
              callback(data);
              imagesData.push(data);
            }
            //console.log('imagesData:')
            //console.log(imagesData)
            //callback(data);
            //alert(results[0])
          }
        }, function (error) {
          alert("Failed:" + error);
        });
    }

    return {
      getPic: function (imagesArray, callback) {
        callback = callback || function () {
          };
        if (!imagesArray) {
          alert('没有传递imagesArray对象');
          return;
        }
        imagesData = imagesArray;
        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: '<b>拍照</b> 上传'
          }, {
            text: '从 <b>相册</b> 中选'
          }],
          titleText: '图片上传',
          cancelText: '取 消',
          cancel: function () {
            // add cancel code..
          },
          buttonClicked: function (index) {
            // 相册文件选择上传
            if (index == 1) {
              pickImages(callback);
              //choosePhoto(path,filename,size,callback);
            } else if (index == 0) {
              // 拍照上传
              takePhoto(callback);
            }
            return true;
          }
        });
      },
      upLoad: function (imagedata, callback) {
        callback = callback || function () {
          };
        var serverURL = baseUrl.url + 'upload';
        var takeImagesData = imagedata instanceof Array ? imagedata : imagesData;
        var len = takeImagesData ? takeImagesData.length : 0;
        for (var i = 0; i < len; i++) {
          var filename = takeImagesData[i].name;
          var path = "./uploads";
          var ft = new FileTransfer(),
            options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
          options.mimeType = "image/jpeg";
          options.chunkedMode = false;
          options.params = {// Whatever you populate options.params with, will be available in req.body at the server-side.
            "path": path,
            "filename": filename,
            "action": "upload_file"
          };
          $ionicLoading.show();
          (function(image){
            try {
              ft.upload(takeImagesData[i].src, encodeURI(serverURL),
                  function (success) {
                    $ionicLoading.hide();
                    callback(image);
                  },
                  function (e) {
                    $ionicLoading.hide();
                    console.log("uploaderr:" + test);
                    callback(0);
                    var test = "err:";
                    for (var item in e) test += item + ":" + e[item] + ";";
                    console.log("uploaderr:" + test);
                  }, options);
            }
            catch(e){
               console.log('not modified pictures')
            }
          })(takeImagesData[i]);
        }
      }
    };
  }])


    .factory('pickBrowserPic', ['$timeout','$rootScope', '$q', '$ionicActionSheet', '$cordovaImagePicker', '$ionicLoading', function ($timeout,$rootScope, $q, $ionicActionSheet, $cordovaImagePicker, $ionicLoading) {
      var imagesData = [];

      function pickImages(callback) {
        var options = {
          quality: 80,
          maximumImagesCount: 5,
          width: 300,
          height: 500,
          allowEdit: true
        };
        //alert($cordovaImagePicker.getPictures)
        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
              if (results[0]) {
                $rootScope.takeImages = results;
                var len = results.length;
                var timeName = new Date().getTime();
                for (var i = 0; i < len; i++) {
                  var tsrc;
                  var timen = timeName + i;
                  var fileFormat = (results[i]).split(".");
                  tsrc = baseUrl.url + "uploads/" + timen + "." + fileFormat[fileFormat.length - 1];
                  var data = {
                    name: timen,
                    src: results[i],
                    tsrc: tsrc
                  };
                  callback(data);
                  imagesData.push(data);
                }
                //console.log('imagesData:')
                //console.log(imagesData)
                //callback(data);
                //alert(results[0])
              }
            }, function (error) {
              alert("Failed:" + error);
            });
      }

      return {

        getBrowserPic: function (imagesArray, callback) {
          callback = callback || function () {
              };
          if (!imagesArray) {
            alert('没有传递imagesArray对象');
            return;
          }
          imagesData = imagesArray;
          var hideSheet = $ionicActionSheet.show({
            buttons: [{
              text: '选择图片'
            }],
            titleText: '图片上传',
            cancelText: '取 消',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              // 相册文件选择上传
              if (index == 0) {
                pickBrowserImages(callback);
                //choosePhoto(path,filename,size,callback);
              }
              return true;
            }
          });
        },

        upLoad: function (imagedata, callback) {
          callback = callback || function () {
              };
          var serverURL = baseUrl.url + 'upload';
          var takeImagesData = imagedata instanceof Array ? imagedata : imagesData;
          var len = takeImagesData ? takeImagesData.length : 0;
          for (var i = 0; i < len; i++) {
            var filename = takeImagesData[i].name;
            var path = "./uploads";
            var ft = new FileTransfer(),
                options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = {// Whatever you populate options.params with, will be available in req.body at the server-side.
              "path": path,
              "filename": filename,
              "action": "upload_file"
            };
            $ionicLoading.show();
            (function(image){
              try {
                ft.upload(takeImagesData[i].src, encodeURI(serverURL),
                    function (success) {
                      $ionicLoading.hide();
                      callback(image);
                    },
                    function (e) {
                      $ionicLoading.hide();
                      console.log("uploaderr:" + test);
                      callback(0);
                      var test = "err:";
                      for (var item in e) test += item + ":" + e[item] + ";";
                      console.log("uploaderr:" + test);
                    }, options);
              }
              catch(e){
                console.log('not modified pictures')
              }
            })(takeImagesData[i]);
          }
        }
      };
    }])


  .factory('WeChat', ['$http', '$q', function ($http, $q) {
    return {
      payment: function () {
        var params = {
          mch_id: '10000100', // merchant id
          prepay_id: 'wx201411101639507cbf6ffd8b0779950874', // prepay id
          nonce: '1add1a30ac87aa2db72f57a2375d8fec', // nonce
          timestamp: '1439531364', // timestamp
          sign: '0CB01533B8C1EF103065174F50BCA001', // signed string
        };

        Wechat.sendPaymentRequest(params, function () {
          //alert("Success");
        }, function (reason) {
          //alert("Failed: " + reason);
        });
        return null;
      },


      auth: function (callback) {
        var scope = "snsapi_userinfo";
        Wechat.auth(scope, function (response) {
          // you may use response.code to get the access token.wx79bcf8b025734922'
          $http({
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
            params: {
              'appid': 'wx79bcf8b025734922',
              'secret': 'c7dccf003f3603c54f4f8cc252c41656',
              'code': response.code,
              'grant_type': 'authorization_code'
            }
          }).then(function (res) {
            $http({
              method: 'GET',
              url: 'https://api.weixin.qq.com/sns/userinfo',
              params: {
                'access_token': res.data.access_token,
                'openid': res.data.openid
              }
            }).then(function (res) {
              callback(res.data);
            })
          })
        }, function (reason) {
          //alert("Failed: " + reason);
        });
        return null;
      },

      check: function (callback) {
    Wechat.isInstalled(function (installed) {
      callback(installed);
  
    //alert("Wechat installed: " + (installed ? "Yes" : "No"));
}, function (reason) {
  
    console.log(reason);
});
        return null;
      },


/**/



      sharelink: function (type, title, des, img, link) {
        Wechat.share({
          message: {
            title: title,
            description: des,
            thumb: img,
            mediaTagName: "TEST-TAG-001",
            messageExt: "这是第三方带的测试字段",
            messageAction: "<action>dotalist</action>",
            media: {
              type: Wechat.Type.LINK,
              webpageUrl: link
            }
          },
          scene: type  // share to Timeline
        }, function () {
          //alert("Success");
        }, function (reason) {
          alert("Failed: " + reason);
        });
        return null;
      }
    };
  }])



    .factory('messageVerify', ['ShowM','$sce','$timeout',function (ShowM,$sce,$timeout) {
      var sNumber="";
      return{
        doVerify:function(vNumber)
        {
          console.log(sNumber,vNumber)
          if(sNumber==vNumber&&sNumber>'0')
          {
            return true;
          }
          else
          {
//
            ShowM.showAlert('验证码错误','您输入的短信验证码有误，请检查。');
          }
        },
        sendVerify: function(type,phone)
        {
          var myURL ="";
          var resend=false;

          for(var i=0;i<6;i++)
          {
            sNumber+=Math.floor(Math.random()*10);
          }

          var src='http://106.ihuyi.cn/webservice/sms.php?method=Submit&account=cf_zhongwei&password=amec123456&mobile='+phone+
              '&content=您的验证码是：【'+sNumber+'】。请不要把验证码泄露给其他人。' ;
//alert(src);
          console.log(src)
          myURL = $sce.trustAsResourceUrl(src);

          var wait=60;
          function time() {
            if (wait== 0) {
              resend=true;
              return;
            } else {
              wait--;
              $timeout(function() {
                    time()  ;
                  },
                  1000)
            }
          }
          time();
        }


      }
    }])

    .factory('ShowM', ['$q','$ionicPopup',function($q,$ionicPopup)
    {
      return {
        showAlert: function(title, text) {

          var alertPopup = $ionicPopup.alert({
            title: title,
            template:text
          });
          alertPopup.then(function(res) {

          });
        },
        showConfirm: function(title, text) {
          var confirmPopup = $ionicPopup.confirm({
            title: title,
            template: text
          });
          confirmPopup.then(function(res) {
            if(res) {
              return true;
            } else {
              return false;
            }
          });
          return   confirmPopup; },


      };
    }])

    .factory('mapGps', function() {
      return {
        map: function($scope,options) {
         
          if($scope.map.address>"")
          {
            mapBaiduStree($scope.map.address);
          }
          else
            navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy:true});
//GPS定位成功
          function onSuccess(position) {

    

            /*alert('Latitude: '          + position.coords.latitude          + '\n' +
             'Longitude: '         + position.coords.longitude         + '\n' +
             'Altitude: '          + position.coords.altitude          + '\n' +
             'Accuracy: '          + position.coords.accuracy          + '\n' +
             'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
             'Heading: '           + position.coords.heading           + '\n' +
             'Speed: '             + position.coords.speed             + '\n' +
             'Timestamp: '         + position.timestamp                + '\n');*/

            var Callback = function (Point)
            {
              mapBaiduPoint(Point);
              //   console.log(Point);
            };
 
            var gpsPoint = new BMap.Point(position.coords.longitude,position.coords.latitude);

            BMap.Convertor.translate(gpsPoint,0,Callback);

          }
//GPS定位失败
          function onError(error) {
            //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
            switch(error.code)
            {
              case 1:
                alert('您拒绝了使用位置共享服务，请手动输入地址。!');
                break;
              default :
                alert('获取位置失败，请手动输入您的地址。!');
                break;
            }
          }

          function mapBaiduStree(Stree)
          {  //alert(Stree);

            var myGeo = new BMap.Geocoder();

            myGeo.getPoint(Stree, function(point){
              if (point)
              { mapBaiduPoint(point);
              }
            }, "全国");
          }
          function mapBaiduPoint(Point)
          {

            var map;
            // 百度地图API功能
            map = new BMap.Map("mapdiv");
            map.addControl(new BMap.NavigationControl());
            var myGeo = new BMap.Geocoder();
            map.centerAndZoom(Point , 16);
            map.addOverlay(new BMap.Marker(Point));


            map.addEventListener("click", function(e){
              var pt = e.point;
              myGeo.getLocation(pt, function(rs)
              {
                var addComp = rs.addressComponents;
                map.clearOverlays();
                map.addOverlay(new BMap.Marker(e.point));

                $scope.$apply(function () {
                      $scope.map.address=addComp.city + addComp.district + addComp.street  + addComp.streetNumber;
                })
              });
            });
          }
        }
      }
    })


  .factory('Gpsfun', function () {
    return {
      getgps: function (options) {

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
        //GPS定位成功
        function onSuccess(position) {
          /*alert('Latitude: '          + position.coords.latitude          + '\n' +
           'Longitude: '         + position.coords.longitude         + '\n' +
           'Altitude: '          + position.coords.altitude          + '\n' +
           'Accuracy: '          + position.coords.accuracy          + '\n' +
           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
           'Heading: '           + position.coords.heading           + '\n' +
           'Speed: '             + position.coords.speed             + '\n' +
           'Timestamp: '         + position.timestamp                + '\n');*/

          var Callback = function (Point) {
            //   console.log(Point);
            var map;
            // 百度地图API功能
            map = new BMap.Map("mapdiv");
            //  alert(2);
            //    map.addControl(new BMap.ZoomControl());
            // 创建地址解析器实例
            map.addControl(new BMap.NavigationControl());
            var myGeo = new BMap.Geocoder();
            map.centerAndZoom(Point, 16);
            map.addOverlay(new BMap.Marker(Point));
            //  map.setCenter(new BMap.Point(31.233, 121.671));
            //   map.panTo(new BMap.Point(31.233, 121.671));
          };
          var gpsPoint = new BMap.Point(position.coords.longitude, position.coords.latitude);
          BMap.Convertor.translate(gpsPoint, 0, Callback);

        }
        //GPS定位失败
        function onError(error) {
          alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
          switch (error.code) {
            case 1:
              alert('您拒绝了使用位置共享服务，请手动输入地址。!');
              break;
            default :
              alert('获取位置失败，请手动输入您的地址。!');
              break;
          }
        }
      }
    }
  })


  .factory('rongIM', ['$http', '$q', function ($http, $q, $rootScope) {

    return {
      initRong: function (token) {
        $rootScope.arrMsgs = [];
        $rootScope.arrCons = [];
        RongCloudLibPlugin.init({
            appKey: m7ua80gbu9wcm
            // deviceToken: "87jjfds8393sfjds83"
          },
          function (ret, err) {
            if (ret) {
              console.log('init:' + JSON.stringify(ret));
            }
            if (err) {
              console.log('init error:' + JSON.stringify(err));
            }
          }
        );

        RongCloudLibPlugin.setConnectionStatusListener(
          function (ret, err) {
            if (ret) {
              console.log('setConnectionStatusListener:' + JSON.stringify(ret));
              if (ret.result.connectionStatus == 'KICKED') {
                alert('您的帐号已在其他端登录!');
                $rootScope.hideTabs = false;
                $ionicHistory.clearCache();
                $state.go('login');
              }
            }
            if (err) {
              console.log('setConnectionStatusListener error:' + JSON.stringify(err));
            }
          }
        );

        RongCloudLibPlugin.connect({
            token: token
          },
          function (ret, err) {
            if (ret) {
              console.log('connect:' + JSON.stringify(ret));
              $rootScope.curUID = ret.result.userId;
              $rootScope.$apply();
              myUtil.setUserId(ret.result.userId);
              $state.go('tab.friends', {
                userId: ret.result.userId
              }, {
                reload: true
              });
            }
            if (err) {
              console.log('init error:' + JSON.stringify(err));
            }
          }
        );

        RongCloudLibPlugin.setOnReceiveMessageListener(
          function (ret, err) {
            if (ret) {
              console.log('setOnReceiveMessageListener:' + JSON.stringify(ret));
              $rootScope.arrMsgs.push(JSON.stringify(ret.result.message));
              $rootScope.$apply();
            }
            if (err) {
              console.log('setOnReceiveMessageListener error:' + JSON.stringify(err));
            }
          }
        );
      }
    }
  }]);








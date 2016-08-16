 angular.module('starter.loginServices', [])

.factory('loginServices', ['$q','rDataHand','ShowM',function($q,rDataHand) 
{
   
   return {
     findUser : function(param){
             var re = rDataHand.Sdata('get','get_user_basic',{},param)
      .then(function(res){ 
        return res;
          //callback(res);
              }); 
       return re;
     },
      addUser : function(data){
             var re = rDataHand.Sdata('get','add_user',data,{})
      .then(function(res){ 
        return res;
          //callback(res);
              }); 
       return re;
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




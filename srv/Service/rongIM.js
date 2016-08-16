
/**
 * Created by yeshuijuan on 16/2/22.
 */
//var Rongcloud = require( './Rongcloud.js' );
var rongcloudSDK = require( 'rongcloud-sdk' );
rongcloudSDK.init( 'm7ua80gbu9wcm', '5fBUfV9re9');


exports.getToken= function (db,data,param,res) {
  var collection = db.collection('users');
   collection.find(param).toArray(function(err, result) {
   if(err)
   {
   console.log('Error:'+ err);
   return;
   }
   else if(!result[0].token){
     rongcloudSDK.user.getToken(param.userId, 'Lance', 'http://files.domain.com/avatar.jpg', function( err, resultText ) {
       if( err ) {
         console.log('Error:'+ err);
         return;
       }
       else {
         var rResult = JSON.parse( resultText );
         if( rResult.code === 200 ) {
           console.log(rResult.token)
           var tokendata = {token:rResult.token};
           collection.update(param,{$set:tokendata},'',function(err, result) {
             if(err)
             {
               console.log('Error:'+ err);
               return;
             }
             res.send(rResult);
             //db.close();
           });
         }
       }
     });
   }
   });
}

exports.fetchToken = function(userId,userName){
    rongcloudSDK.user.getToken(userId, userName||"CSLL", 'http://files.domain.com/avatar.jpg', function( err, resultText ) {
       if( err ) {
         console.log('Error:'+ err);
         return;
       }
       else {
         var result = JSON.parse( resultText );
         if( result.code === 200 ) {
           console.log(result.token)
           return result.token;
         }return "";
       }
     });
}


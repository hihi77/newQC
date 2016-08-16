/**
 * Created by yeshuijuan on 5/23/16.
 */
angular.module('starter.publicFilter', [])
    .filter('noDuplicate', function () {
        function formatTime(time){
            return new Date(time).getTime();
        }
        return function(inputArray,param){
            inputArray = inputArray||[];
            var tArray = [];
            var rArray = [];
            inputArray.forEach(function (item) {
                if(tArray.indexOf(item[param])==-1){
                    tArray.push(item[param]);
                    rArray.push(item);
                }else{
/*                    if(formatTime(rArray[tArray.indexOf(item.userId)])<formatTime(item)){
                        tArray.splice(tArray.indexOf(item.userId),1);
                        rArray.splice(tArray.indexOf(item.userId),1);
                        tArray.push(item.userId);
                        rArray.push(item);
                    }*/
                }
            })
            return rArray;
        }
    })


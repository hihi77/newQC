/**
 * Created by lmin on 16/2/25.
 */
var app=angular.module('starter.publishToHireDirective',[]);
app
    .directive('mailTest',function(){//邮箱验证
        function isEmail(str){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            return reg.test(str);
        }
        return {
            restrict:"A",
            link:function(scope,element,attrs){
                element.on('focus',function(){
                    element.removeClass('error');
                });
                element.on('blur',function(){
                    if(!isEmail(element.val())){
                        element.addClass('error');
                    }
                });
            }
        }
    })
    .directive('setIonScrollHeight',function(){
        return {
            restrict:"C",
            link:function(scope,element){
                element.css('height',window.innerHeight-(43+72+50)+'px');
            }
        }
    })
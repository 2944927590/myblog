define(function(require, exports, module){

    exports._init = function(){
        console.log(1);
<<<<<<< HEAD
        console.log(222222222222);
=======
        console.log(23);
>>>>>>> master
        console.log('archive/home/_init', '模块前置');
        $('#navbar-nav li').removeClass('active');
        $('#navbar-nav li[data-nav="home"]').addClass('active');
    };

    exports.init = function(){
        console.log('archive/home/init');
        var tpl = require('./tpl_home');
        var service = require('_service/archive');
        var config = require('_config/app');
        var base = require('_base/base');
        service.getDetails(function(details){
            base.articleCut(details, config.indexShowNum, function(detailsCuted){
                //console.log(detailsCuted);
                base.timeToStr(detailsCuted, function(detailsStrTime){
                    base.isStrCut(detailsStrTime, 'title', config.indexTitleLength, function(details){
                        base.isStrCut(details, 'content', config.indexContentLength, function(details){
                            console.log(details);
                            var details = tpl.main({details: details, category: '', massage: ''});
                            $('#container-left').html(details);
                        });
                    });
                });
            });
        });

    };

    exports._destroy = function(){
        console.log('archive/home/_destroy', '模块后置');
    };
});
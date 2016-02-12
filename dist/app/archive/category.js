define(function(require, exports, module){

    var tpl = require('./tpl_home');
    var service = require('_service/archive');
    var config = require('_config/app');
    var base = require('_base/base');
    var route = require('route');

    var container_left = $('#container-left');

    exports._init = function(){
        console.log('archive/category/_init', '模块前置');
    };

    exports.init = function(){
        console.log('archive/category/init');
    };
    exports.list_init = function(){
        console.log('archive/category/list_init');
        var categoryId = route.getParams('categoryId') - 0;
        base.addClassActive(categoryId);
    }
    exports.list = function(){
        console.log('archive/category/list');

        var categoryId = route.getParams('categoryId') - 0;
        service.getDetails(function(details){
            //console.log(details);
            base.getDetailsByField(details, 'category_id', categoryId, function(details){
                base.articleCut(details, config.indexShowNum, function(detailsCuted){
                    //console.log(detailsCuted);
                    base.timeToStr(detailsCuted, function(detailsStrTime){
                        base.isStrCut(detailsStrTime, 'title', config.indexTitleLength, function(details){
                            base.isStrCut(details, 'content', config.indexContentLength, function(details){
                                if(details.length == 0){
                                    container_left.html( tpl.main({details: details, category: '', massage: config.emptyArticleMsg}) );
                                } else {
                                    container_left.html( tpl.main({details: details, category: details[0]['category'], massage: ''}) );
                                }
                            });
                        });
                    });
                });
            });
        });
    }
    exports._destroy = function(){
        console.log('archive/category/_destroy', '模块后置');
    };
});

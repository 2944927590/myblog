define(function(require, exports, module){

    var container_left = $('#container-left');
    var url = require('url');

    exports._init = function(){
        console.log('archive/category/_init', '模块前置');
    };

    exports.init = function(){
        console.log('archive/category/init');
        var tpl = require('./tpl_home');
        var service = require('_service/archive');
        var config = require('_config/app');
        var base = require('_base/base');

        container_left.on("addClass",  function(e, data){
            //console.log(data);
            base.addClassActive( data.category_id );
        });

        getDetails(tpl, service, config, base);
        container_left.on("getDetailsByCategory",  function(e, data){
            getDetails(tpl, service, config, base);
        });

        $(window).on('hashchange', function(){
            container_left.trigger('getDetailsByCategory');
        });
    };

    exports._destroy = function(){
        container_left.off('addClass').off('getDetailsByCategory');
        console.log('archive/category/_destroy', '模块后置');
    };
    function getDetails(tpl, service, config, base){
        var category_id = url.get("?category_id");
        //console.log(category_id);
        container_left.trigger("addClass", {category_id: category_id});
        service.getDetails(function(details){
            //console.log(details);
            base.getDetailsByField(details, 'category_id', category_id, function(details){
                base.articleCut(details, config.indexShowNum, function(detailsCuted){
                    //console.log(detailsCuted);
                    base.timeToStr(detailsCuted, function(detailsStrTime){
                        base.isStrCut(detailsStrTime, 'title', config.indexTitleLength, function(details){
                            base.isStrCut(details, 'content', config.indexContentLength, function(details){

                                if(details.length == 0){
                                    container_left.html( tpl.main({details: details, category: '', massage: config.emptyArticleMsg}) );
                                } else {
                                    //console.log(details);
                                    //console.log(details[0]['category']);
                                    container_left.html( tpl.main({details: details, category: details[0]['category'], massage: ''}) );
                                }
                                //container_left.html( tpl.main({details: details, category: details[0]['category']}) );
                            });
                        });
                    });
                });
            });
        });
    }

});

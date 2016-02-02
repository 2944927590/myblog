define(function(require, exports, module){

    var container_left = $('#container-left');

    exports._init = function(){
        console.log('archive/detail/_init', '模块前置');
    };

    exports.init = function(){
        console.log('archive/detail/init');
        var tpl = require('./tpl_detail');
        var service = require('_service/archive');
        var base = require('_base/base');
        var url = require('url');

        container_left.on("addClass",  function(e, data){
            //console.log(data);
            base.addClassActive( data.category_id );
        });

        container_left.on("changeArticle", function(e, data){
            var article_id = data.article_id;

            service.getDetails(function(details){
                var details = details;
                //console.log(details);
                getCategoryIdByArticleId(details, article_id, function(category_id){
                    container_left.trigger("addClass", {category_id: category_id});
                });

                base.articleSort(details, 'id', 'ase', function(details){
                    //console.log(details);
                    base.timeToStr(details, function(details){
                        var details = details;
                        getArticleKey(details, article_id, function(key){
                            getThreeArticle(details, key, function(threeArticle){
                                //console.log(threeArticle);
                                $('#container-left').html( tpl.main({threeArticle: threeArticle[0]}) );
                            });
                        });
                    });
                });
            });
        });

        var article_id = url.get('?article_id');
        container_left.trigger("changeArticle", {article_id: article_id});

        $(window).on('hashchange', function(){
            var article_id = url.get('?article_id');
            //console.log(article_id);
            container_left.trigger("changeArticle", {article_id: article_id});
        });

    };
    exports._destroy = function(){
        container_left.off("changeArticle").off("addClass");
        console.log('archive/detail/_destroy', '模块后置');
    };
    function getCategoryIdByArticleId(details, article_id, cb){
        if(0 == details.length){
            cb('');
        } else {
            details.forEach(function(item){
                if(article_id == item['id']){
                    cb(item['category_id'] || '');
                    return false;
                }
            });
        }
    }
    function getThreeArticle(details, key, cb){
        var arr = new Array();
        var length = details.length;
        //  console.log(key);
        if( length == 0 || key === ''){
            cb([]);
        } else if(length == 1){
            arr.push({pre: {}, cur: details[0], next: {} });
        } else {
            if(key == 0){
                arr.push({pre: {}, cur: details[0], next: details[1] });
            } else if (key == length - 1){
                arr.push({pre: details[length - 2], cur: details[length - 1], next: {} });
            } else {
                arr.push({pre: details[key - 1], cur: details[key], next: details[key + 1] });
            }
        }
        cb(arr);
    }
    function getArticleKey(details, article_id, cb){
        if(0 == details.length){
            cb('');
        } else {
            details.forEach(function(item, k){
                if(item['id'] == article_id){
                    cb(k);
                }
            });
        }
    }
});

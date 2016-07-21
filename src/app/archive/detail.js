define(function(require, exports, module){

    var tpl = require('./tpl_detail');
    var service = require('_service/archive');
    var base = require('_base/base');
    var route = require('route');
    var msg = require('msg');
    var event = require('event');
    var container_left = $('#container-left');

    exports._init = function(){
        console.log(1);
        console.log('archive/detail/_init', '模块前置');
        event.on('clickPraise', function (e, $el) {
            var detailId = $el.data('detail-id');
            var isPraise = $el.data('is-praise');

            route.go({
                module: 'archive/detail',
                action: 'praise',
                params: {
                    detailId: detailId,
                    isPraise: isPraise
                },
                options: {
                    reload: true
                }
            });
        });
    };

    exports.init = function(){
        console.log('archive/detail/init');
    };

    exports.detail_init = function(){
        console.log('archive/detail/detail_init');
    }

    exports.detail = function(){
        console.log('archive/detail/detail');
        var detailId = route.getParams('detailId') - 0;
        var isPraise = route.getParams('isPraise');
        //console.log(detailId);
        //console.log(isPraise);
        service.getDetails(function(details){
            var details = details;
            getCategoryIdByArticleId(details, detailId, function(categoryId){
                base.addClassActive(categoryId);
            });
            base.articleSort(details, 'id', 'ase', function(details){
                base.timeToStr(details, function(details){
                    var details = details;
                    getArticleKey(details, detailId, function(key){
                        getThreeArticle(details, key, function(threeArticle){
                            //console.log(threeArticle);
                            $('#container-left').html( tpl.main({threeArticle: threeArticle[0], isPraise:isPraise}) );
                        });
                    });
                });
            });
        });
    }

    exports.praise = function(){
        var detailId = route.getParams('detailId') - 0;
        var isPraise = route.getParams('isPraise') - 0;
        if(isPraise)
            msg.notice("确定取消 ？");
        else
            msg.notice("确定点赞 ？");

        //console.log(isPraise);
        //console.log(detailId);
        route.go({
            module: 'archive/detail',
            action: 'detail',
            params: {
                detailId: detailId,
                isPraise: (isPraise + 1)%2
            },
            options: {
                reload: true
            }
        });
    }

    exports._destroy = function(){
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

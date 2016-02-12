define(function(require, exports, module){

    var css = require('./css_app');
    var tpl = require('./tpl_app');
    var config = require('_config/app');
    var service = require('_service/archive');
    var base = require('_base/base');

    exports.init = function(){
        service.getTopicList(function (topicList) {
            base.nav(topicList, function(topicList){
                //console.log('topicList', topicList);
                var header = tpl.header({title: config.title, topicList: topicList});
                service.getDetails(function(details){
                    //console.log(details);
                    var bodyData = {};
                    base.articleSort(details, 'create_time', 'desc', function(detailsTimeDesc){
                        //console.log(detailsTimeDesc);
                        base.articleCut(detailsTimeDesc, config.newArticleNum, function(detailsTimeDescCut){
                            base.isStrCut(detailsTimeDescCut, 'title', config.newArticleTitleNum, function(detailsTimeDescCut){
                                //console.log(detailsTimeDescCut);
                                bodyData.detailsTimeDesc = detailsTimeDescCut;
                            });
                        });
                    });
                    base.articleSort(details, 'hits', 'desc', function(detailsHitsDesc){
                        base.articleCut(detailsHitsDesc, config.hitArticleNum, function(detailsHitsDescCut){
                            base.isStrCut(detailsHitsDescCut, 'title', config.hitArticleTitleNum, function(detailsHitsDescCut){
                                //console.log(detailsHitsDescCut);
                                bodyData.detailsHitsDesc = detailsHitsDescCut;
                            });
                        });
                    });
                    //console.log(bodyData);
                    var body = tpl.body(bodyData);
                    var footer = tpl.footer();
                    $(HY.rootDom).html(css + header + body + footer);
                });
            });
        });
    };
});
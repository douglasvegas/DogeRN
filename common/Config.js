/**
 * Created by sunxin on 2017/6/9.
 */

module.exports = {
    Header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        }
    },
    Api: {
        base: 'http://rapapi.org/mockjs/20333',
        list: '/api/list',
        up  : '/api/up',
        comments: '/api/comments',
        postComment: '/api/comment',
        getCode: '/api/getCode',
        login: '/api/login'
    }
};
/**
 * Created by sunxin on 2017/6/9.
 */

import qs from 'query-string'
import _ from 'lodash'
import Mock from 'mockjs'
import Config from './Config'
let Request = {};

Request.get = (url, params) => {
    if (params) {
        url += '?' + qs.stringify(params)
    }

    return fetch(url)
        .then((response) => response.json())
        .then((response) =>  Mock.mock(response)) //上线注销即可
}

Request.post = (url, body) => {
    var options = _.extend(Config.Header,{
        body: JSON.stringify(body)
    })

    return fetch(url,options)
        .then((response) => response.json())
        .then((response) => Mock.mock(response))
}

module.exports = Request;
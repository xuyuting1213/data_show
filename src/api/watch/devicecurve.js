import request from '@/utils/request'
import { param } from 'jquery'

/**
 * 查询单条曲线
 */
export function querySingleCurve(params) {
    return request({
        url: '/mes/watch/devicecurve/querySingleCurve',
        method: 'post',
        data: params
    })
}



export function queryCurve(query) {
    return request({
        url: '/mes/watch/devicecurve/queryCurve',
        method: 'get',
        params: query
    })
}  

import request from '@/utils/request'
// console.log(request);
// 查询设备信息列表
export function queryDeviceParameter(query) {
    return request({
        url: '/mes/watch/deviceparameter/query',
        method: 'get',
        params: query
    })
}

export function listDeviceParameter(query) {
    return request({
        url: '/mes/watch/deviceparameter/list',
        method: 'get',
        params: query
    })
}

// 导出设备参数
export function exportDeviceParameter(query) {
    return request({
        url: '/mes/watch/deviceparameter/export',
        method: 'post',
        params: query
    })
}

// 获得设备参数信息
export function getDeviceParameter(deviceid) {
    return request({
        url: '/mes/watch/deviceparameter/' + deviceid,
        method: 'get'
    })
}


// 新增设备
export function addDeviceParameter(data) {
    return request({
        url: '/mes/watch/deviceparameter',
        method: 'post',
        data: data
    })
}

// 修改设备数据
export function updateDeviceParameter(data) {
    return request({
        url: '/mes/watch/deviceparameter',
        method: 'put',
        data: data
    })
}

// 删除字典数据
export function delDeviceParameter(ids) {
    return request({
        url: '/mes/watch/deviceparameter/' + ids,
        method: 'delete'
    })
}

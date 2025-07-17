import request from '@/utils/request'

// 查询设备信息列表
export function listDevice(query) {
  return request({
    url: '/mes/watch/device/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function exportDevice(query) {
  return request({
    url: '/mes/watch/device/export',
    method: 'post',
    params: query
  })
}

// 获得设备信息
export function getDevice(deviceid) {
  return request({
    url: '/mes/watch/device/' + deviceid,
    method: 'get'    
  })
}


// 新增设备
export function addDevice(data) {
  return request({
    url: '/mes/watch/device',
    method: 'post',
    data: data
  })
}

// 修改设备数据
export function updateDevice(data) {
  return request({
    url: '/mes/watch/device',
    method: 'put',
    data: data
  })
}

// 删除设备数据
export function delDevice(deviceid) {
  return request({
    url: '/mes/watch/device/' + deviceid,
    method: 'delete'
  })
}

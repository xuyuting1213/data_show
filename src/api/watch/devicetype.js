import request from '@/utils/request'


export function listDeviceType(query) {
    return request({
      url: '/mes/watch/devicetype/list',
      method: 'get',
      params: query
    })
  }

// 获得设备类型信息
export function getDeviceType(devicetype) {
  return request({
    url: '/mes/watch/devicetype/' + devicetype,
    method: 'get'    
  })
}

export function getDeviceTypeByName(devicetypename) {
    return request({
      url: '/mes/watch/devicetype/getbyname/' + devicetypename,
      method: 'get'    
    })
  }
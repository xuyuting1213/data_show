/**感知数据访问接口 */
import request from '@/utils/request'

// 查询感知数据列表,查询完整的设备参数信息列表
export function listDeviceWatchData(query) {
  return request({
    url: '/mes/watch/devicewatch/list',
    method: 'get',
    params: query
  })
}

/** 
 *读取监控数据 
*/
export function readWatchData(query) {
  return request({
    url: '/mes/watch/devicewatch/read',
    method: 'get',
    params: query
  })
}


export function reconfigWatchData(query) {
  return request({
    url: '/mes/watch/devicewatch/reconfig',
    method: 'get',
    params: query
  })
}



/**报警监控数据访问接口 */
import request from '@/utils/request'

/** 
 *读取报警监控数据 
*/
export function readAlarmData(query) {
  return request({
    url: '/mes/watch/alarmwatch/read',
    method: 'get',
    params: query
  })
}

/**
 * 刷新配置
 * @param {} query 
 * @returns 
 */
export function reconfigAlarmData(query) {
  return request({
    url: '/mes/watch/alarmwatch/reconfig',
    method: 'get',
    params: query
  })
}



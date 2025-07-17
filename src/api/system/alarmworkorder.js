/**报警工单数据访问接口 */
import request from '@/utils/request'

/** 
 *查询报警工单数据 
*/
export function queryAlarmWorkOrder(query) {
  return request({
    url: '/mes/watch/alarmworkorder/query',
    method: 'get',
    params: query
  })
}

/** 
 *读取报警工单列表数据 
*/
export function listAlarmWorkOrder(query) {
    return request({
      url: '/mes/watch/alarmworkorder/list',
      method: 'get',
      params: query
    })
  }

// 获得报警工单信息
export function getAlarmWorkOrder(id) {
  return request({
    url: '/mes/watch/alarmworkorder/' + id,
    method: 'get'    
  })
}
 

/** 
 *导出报警工单列表数据 
*/
export function exportAlarmWorkOrder(query) {
    return request({
      url: '/mes/watch/alarmworkorder/export',
      method: 'post',
      params: query
    })
}

/** 
 *上传报警工单图片数据 
*/
export function uploadAlarmWorkOrderPic(query) {
    return request({
      url: '/mes/watch/alarmworkorder/uploadPic',
      method: 'post',
      params: query
    })
}

/** 
 *上传报警工单附件数据 
*/
export function uploadAlarmWorkOrderAttachment(query) {
    return request({
      url: '/mes/watch/alarmworkorder/uploadAttachment',
      method: 'post',
      params: query
    })
}

// 新增报警工单信息
export function addAlarmWorkOrder(data) {
  return request({
    url: '/mes/watch/alarmworkorder',
    method: 'post',
    data: data
  })
}

// 修改报警工单数据
export function updateAlarmWorkOrder(data) {
  return request({
    url: '/mes/watch/alarmworkorder',
    method: 'put',
    data: data
  })
}

// 删除报警工单数据
export function delAlarmWorkOrder(ids) {
  return request({
    url: '/mes/watch/alarmworkorder/' + ids,
    method: 'delete'
  })
}





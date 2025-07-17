import request from '@/utils/request'

// 查询报警主机设置信息列表
export function queryAlarmHostSetup(query) {
  return request({
    url: '/mes/watch/alarmhostsetup/query',
    method: 'get',
    params: query
  })
}

export function listAlarmHostSetup(query) {
    return request({
      url: '/mes/watch/alarmhostsetup/list',
      method: 'get',
      params: query
    })
  }

// 导出报警主机设置
export function exportAlarmHostSetup(query) {
  return request({
    url: '/mes/watch/alarmhostsetup/export',
    method: 'post',
    params: query
  })
}

// 获得设备报警主机信息
export function getAlarmHostSetup(id) {
  return request({
    url: '/mes/watch/alarmhostsetup/' + id,
    method: 'get'    
  })
}

// 新增报警主机设置信息
export function addAlarmHostSetup(data) {
  return request({
    url: '/mes/watch/alarmhostsetup',
    method: 'post',
    data: data
  })
}

// 修改报警主机设置数据
export function updateAlarmHostSetup(data) {
  return request({
    url: '/mes/watch/alarmhostsetup',
    method: 'put',
    data: data
  })
}

// 删除报警主机设置数据
export function delAlarmHostSetup(ids) {
  return request({
    url: '/mes/watch/alarmhostsetup/' + ids,
    method: 'delete'
  })
}

import request from '@/utils/request'

// 查询设备报警设置信息列表
export function queryDeviceAlarmSetup(query) {
  return request({
    url: '/mes/watch/devicealarmsetup/query',
    method: 'get',
    params: query
  })
}

export function listDeviceAlarmSetup(query) {
    return request({
      url: '/mes/watch/devicealarmsetup/list',
      method: 'get',
      params: query
    })
  }

// 导出设备报警设置
export function exportDeviceAlarmSetup(query) {
  return request({
    url: '/mes/watch/devicealarmsetup/export',
    method: 'post',
    params: query
  })
}

// 获得设备报警设置信息
export function getDeviceAlarmSetup(id) {
  return request({
    url: '/mes/watch/devicealarmsetup/' + id,
    method: 'get'    
  })
}

//根据参数ID列表获得报警设置信息
export function getDeviceAlarmSetupByParamIds(paramIds) {
  return request({
    url: '/mes/watch/devicealarmsetup/getByParamIds/' + paramIds,
    method: 'get'    
  })
}

//批量保存报警设置列表信息
export function batchSaveDeviceAlarmSetups(data) {
  return request({
    url: '/mes/watch/devicealarmsetup/batchSave',
    method: 'post',
    data: data
  })
}


// 新增设备报警设置信息
export function addDeviceAlarmSetup(data) {
  return request({
    url: '/mes/watch/devicealarmsetup',
    method: 'post',
    data: data
  })
}

// 修改设备报警设置数据
export function updateDeviceAlarmSetup(data) {
  return request({
    url: '/mes/watch/devicealarmsetup',
    method: 'put',
    data: data
  })
}

// 删除设备报警设置数据
export function delDeviceAlarmSetup(ids) {
  return request({
    url: '/mes/watch/devicealarmsetup/' + ids,
    method: 'delete'
  })
}

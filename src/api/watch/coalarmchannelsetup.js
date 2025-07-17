import request from '@/utils/request'

// 查询CO报警通道信息列表
export function queryCOAlarmChannelSetup(query) {
  return request({
    url: '/mes/watch/coalarmchannelsetup/query',
    method: 'get',
    params: query
  })
}

export function listCOAlarmChannelSetup(query) {
    return request({
      url: '/mes/watch/coalarmchannelsetup/list',
      method: 'get',
      params: query
    })
  }

// 导出设备报警设置
export function exporCOAlarmChannelSetup(query) {
  return request({
    url: '/mes/watch/coalarmchannelsetup/export',
    method: 'post',
    params: query
  })
}

// 获得(CO)设备报警通道设置信息
export function getCOAlarmChannelSetup(id) {
  return request({
    url: '/mes/watch/coalarmchannelsetup/' + id,
    method: 'get'    
  })
}

// 新增设备报警通道设置信息
export function addCOAlarmChannelSetup(data) {
  return request({
    url: '/mes/watch/coalarmchannelsetup',
    method: 'post',
    data: data
  })
}

// 修改设备报警通道设置数据
export function updateCOAlarmChannelSetup(data) {
  return request({
    url: '/mes/watch/coalarmchannelsetup',
    method: 'put',
    data: data
  })
}

// 删除设备报警设置数据
export function delCOAlarmChannelSetup(ids) {
  return request({
    url: '/mes/watch/coalarmchannelsetup/' + ids,
    method: 'delete'
  })
}

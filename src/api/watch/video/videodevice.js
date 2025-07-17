import request from '@/utils/request'

// 查询视频设备信息列表
export function queryVideoDevice(query) {
  return request({
    url: '/mes/watch/videodevice/query',
    method: 'get',
    params: query
  })
}

//列出视频设备列表信息
export function listVideoDevice(query) {
    return request({
      url: '/mes/watch/videodevice/list',
      method: 'get',
      params: query
    })
  }

// 导出视频设备参数
export function exportVideoDevice(query) {
  return request({
    url: '/mes/watch/videodevice/export',
    method: 'post',
    params: query
  })
}

// 获得视频设备信息
export function getVideoDevice(vdeviceid) {
  return request({
    url: '/mes/watch/videodevice/' + vdeviceid,
    method: 'get'    
  })
} 


// 新增视频设备
export function addVideoDevice(data) {
  return request({
    url: '/mes/watch/videodevice',
    method: 'post',
    data: data
  })
}

// 修改视频设备数据
export function updateVideoDevice(data) {
  return request({
    url: '/mes/watch/videodevice',
    method: 'put',
    data: data
  })
}

// 删除视频设备数据
export function delVideoDevice(ids) {
  return request({
    url: '/mes/watch/videodevice/' + ids,
    method: 'delete'
  })
}

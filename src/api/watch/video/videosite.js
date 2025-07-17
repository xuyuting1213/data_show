import request from '@/utils/request'

// 查询视频站点列表
export function queryVideoSite(query) {
  return request({
    url: '/mes/watch/videosite/query',
    method: 'get',
    params: query
  })
}

//列出视频站点的信息
export function listVideoSite(query) {
    return request({
      url: '/mes/watch/videosite/list',
      method: 'get',
      params: query
    })
}

//列出顶级视频站点信息
export function listTopVideoSite() {
  return request({
    url: '/mes/watch/videosite/listTop',
    method: 'get',
    params: {}
  })
}

// 导出视频站点的信息
export function exportVideoSite(query) {
  return request({
    url: '/mes/watch/videosite/export',
    method: 'post',
    params: query
  })
}

// 获得视频站点信息
export function getVideoSite(siteid) {
  return request({
    url: '/mes/watch/videosite/' + siteid,
    method: 'get'    
  })
}


// 新增视频站点信息
export function addVideoSite(data) {
  return request({
    url: '/mes/watch/videosite',
    method: 'post',
    data: data
  })
}

// 修改视频站点数据
export function updateVideoSite(data) {
  return request({
    url: '/mes/watch/videosite',
    method: 'put',
    data: data
  })
}

// 删除视频站点数据
export function delVideoSite(ids) {
  return request({
    url: '/mes/watch/videosite/' + ids,
    method: 'delete'
  })
}

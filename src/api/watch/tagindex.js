import request from '@/utils/request'


export function listTagIndex(query) {
    return request({
      url: '/mes/watch/tagindex/list',
      method: 'get',
      params: query
    })
  }

  export function queryTagIndex(query) {
    return request({
      url: '/mes/watch/tagindex/query',
      method: 'get',
      params: query
    })
  }  

// 获得标签信息
export function getTagIndex(tagid) {
  return request({
    url: '/mes/watch/tagindex/' + tagid,
    method: 'get'    
  })
}

export function getTagIndexByName(name) {
    return request({
      url: '/mes/watch/tagindex/getbyname/' + name,
      method: 'get'    
    })
  }


// 新增标签索引
export function addTagIndex(data) {
  return request({
    url: '/mes/watch/tagindex',
    method: 'post',
    data: data
  })
}

// 修改标签索引
export function updateTagIndex(data) {
  return request({
    url: '/mes/watch/tagindex',
    method: 'put',
    data: data
  })
}

// 删除标签索引
export function delTagIndex(tagid) {
  return request({
    url: '/mes/watch/tagindex/' + tagid,
    method: 'delete'
  })
}  
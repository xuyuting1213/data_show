import request from '@/utils/request'

// 查询页面分组列表
export function listPageGroup(query) {
  return request({
    url: '/system/pagegroup/list',
    method: 'get',
    params: query
  })
}

//查询所有的页面分组信息
export function listPageGroupAll() {
  return request({
    url: '/system/pagegroup/listAll',
    method: 'get'
  })
}

//导出页面分局信息
export function exportListPageGroup(query) {
  return request({
    url: '/system/pagegroup/export',
    method: 'post',
    params: query
  })
}


// 查询页面分组详细
export function getPageGroup(groupId) {
  return request({
    url: '/system/pagegroup/' + groupId,
    method: 'get'
  })
}

// 新增页面分组
export function addPageGroup(data) {
  return request({
    url: '/system/pagegroup',
    method: 'post',
    data: data
  })
}

// 修改页面
export function updatePageGroup(data) {
  return request({
    url: '/system/pagegroup',
    method: 'put',
    data: data
  })
}

// 删除页面分组
export function delPageGroup(groupId) {
  return request({
    url: '/system/pagegroup/' + groupId,
    method: 'delete'
  })
}
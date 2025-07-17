import request from '@/utils/request'

// 查询页面列表
export function listPage(query) {
  return request({
    url: '/system/page/list',
    method: 'get',
    params: query
  })
}

// 查询页面详细
export function getPage(pageId) {
  return request({
    url: '/system/page/' + pageId,
    method: 'get'
  })
}

// 获得路由列表
export function getRouters() {
  return request({
    url: '/system/page/getRouters',
    method: 'get'
  })
}

export function select(query) {
  return request({
    url: '/system/page/select',
    method: 'get',
    params: query
  })
}

/**
 * 构建查询树结构
 */
export function treeSelect(query) {
  return request({
    url: '/system/page/treeelect',
    method: 'get',
    params: query
  })
}

/**
 * 构建权限树结构
 */
export function rolePageSelect(roleId) {
  return request({
    url: '/system/page/rolePageSelect/' + roleId,
    method: 'get'
  })
}

/**
 * 构建角色对应的树结构
 */
export function rolePageTreeselect(roleId) {
  return request({
    url: '/system/page/rolePageTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增页面
export function addPage(data) {
  return request({
    url: '/system/page',
    method: 'post',
    data: data
  })
}

// 修改页面
export function updatePage(data) {
  return request({
    url: '/system/page',
    method: 'put',
    data: data
  })
}

// 删除页面
export function delPage(pageId) {
  return request({
    url: '/system/page/' + pageId,
    method: 'delete'
  })
}
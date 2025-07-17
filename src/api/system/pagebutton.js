import request from '@/utils/request'

// 查询页面按钮列表
export function listPageButton(query) {
  return request({
    url: '/system/pagebutton/list',
    method: 'get',
    params: query
  })
}

//页面按钮的选项信息
export function optionSelectPageButton(query) {
  return request({
    url: '/system/pagebutton/optionselect',
    method: 'get'
  })
}


//导出页面按钮列表
export function exportPageButton(query) {
  return request({
    url: '/system/pagebutton/list',
    method: 'get',
    params: query
  })
}

// 查询页面按钮详细
export function getPageButton(buttonId) {
  return request({
    url: '/system/pagebutton/' + buttonId,
    method: 'get'
  })
}

// 新增页面按钮
export function addPageButton(data) {
  return request({
    url: '/system/pagebutton',
    method: 'post',
    data: data
  })
}

// 修改页面
export function updatePageButton(data) {
  return request({
    url: '/system/pagebutton',
    method: 'put',
    data: data
  })
}

// 删除页面
export function delPageButton(buttonId) {
  return request({
    url: '/system/pagebutton/' + buttonId,
    method: 'delete'
  })
}
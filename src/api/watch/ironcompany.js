import request from '@/utils/request'

export function listIronCompany(query) {
    return request({
      url: '/mes/watch/ironcompany/list',
      method: 'get',
      params: query
    })
  }

// 导出钢铁公司信息参数
export function exportIronCompany(data) {
  return request({
    url: '/mes/watch/ironcompany/export',
    method: 'post',
    data: data
  })
}

// 获得公司信息
export function getIronCompany(id) {
  return request({
    url: '/mes/watch/ironcompany/' + id,
    method: 'get'    
  })
}


// 新增公司信息
export function addIronCompany(data) {
  return request({
    url: '/mes/watch/ironcompany',
    method: 'post',
    data: data
  })
}

// 修改公司信息
export function updateIronCompany(data) {
  return request({
    url: '/mes/watch/ironcompany',
    method: 'put',
    data: data
  })
}

// 删除公司信息数据
export function delIronCompany(ids) {
  return request({
    url: '/mes/watch/ironcompany/' + ids,
    method: 'delete'
  })
}

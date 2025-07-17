import request from '@/utils/request'


export function listWorkShopInfo(query) {
    return request({
      url: '/mes/watch/workshop/list',
      method: 'get',
      params: query
    })
  }

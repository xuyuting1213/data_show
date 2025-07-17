import request from '@/utils/request'


export function listPlantInfo(query) {
    return request({
      url: '/mes/watch/plantinfo/list',
      method: 'get',
      params: query
    })
  }

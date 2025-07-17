import request from '@/utils/request'


export function listTagDataType(query) {
    return request({
      url: '/mes/watch/tagdatatype/list',
      method: 'get',
      params: query
    })
  }

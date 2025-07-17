import request from '@/utils/request'


export function listProtocolInfo(query) {
    return request({
      url: '/mes/watch/protocolinfo/list',
      method: 'get',
      params: query
    })
  }

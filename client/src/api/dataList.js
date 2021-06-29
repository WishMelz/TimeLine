import request from '@/plugin/axios.js'


export function getDataList() {
    return request({
        url: `/dataList`,
        method: 'get'
    })
}

export function getDataListById(id) {
    return request({
        url: `/dataList/${id}`,
        method: 'get'
    })
}


export function addDataList(data) {
    return request({
        url: `/dataList`,
        method: 'post',
        data
    })
}


export function delDataList(id) {
    return request({
        url: `/dataList/${id}`,
        method: 'delete'
    })
}

export function putDataList(id, data) {
    return request({
        url: `/dataList/${id}`,
        method: 'put',
        data
    })
}


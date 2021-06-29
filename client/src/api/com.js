import request from '@/plugin/axios.js'


export function getSts() {
    return request({
        url: `/getSts`,
        method: 'get'
    })
}




export function login(data) {
    return request({
        url: `/login`,
        method: 'post',
        data
    })
}


import Request from '@/utils/luch-request/index.js' // 下载的插件
// import Request from 'luch-request' // 使用npm

const http = new Request({
    baseURL: "https://birthday.codehub.store/api"
});

let token = ''

export function wxGetToken(code) {
    return http.get('/user/wxapp-login-by-code', { params: { code } }).then(res => {
        res = res.data
        http.setConfig((config) => {
            config.header = {
                ...config.header,
                Authorization: res.data
            }
            return config
        })
        token = res.data
        // console.log('token', token)
        return res
    }).catch(err => {
        console.error(err)
    })
}

export function myFriends() {
    return http.get('/user/jwt/my-friends').then(res => res.data)
}

export function createFriendBirthday(data) {
    return http.post('/user/jwt/create', data)
}
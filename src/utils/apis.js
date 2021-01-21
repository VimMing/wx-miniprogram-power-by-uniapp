import Request from '@/utils/luch-request/index.js' // 下载的插件
// import Request from 'luch-request' // 使用npm

const http = new Request({
    baseURL: "https://birthday.codehub.store/api"
    //  baseURL: "http://127.0.0.1:7001/api"
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

export function getHistoryEvents(month, day) {
    month = ('0' + month).slice(-2)
    day = ('0' + day).slice(-2)
    // const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json?_=${new Date().getTime()}`
    console.log(month + day)
    return http.get('/history/getWhatHappenedFromGivenDate', {
        params: {
            date: month + day
        }
    }).then(res => {
        if (res && res.data && res.data.events) {
            let reg = /<\/?.+?\/?>/g;
            let arr = res.data.events || []
            return arr.map(i => {
                i.desc = i.desc.replace(reg, '')
                i.title = i.title.replace(reg, '')
                return i
            })
        }
        return []
    })
}

export function getFriendByShareCode(shareCode) {
    return http.get('/user/getFriendByShareCode', {
        params: {
            shareCode
        }
    }).then((res) => {
        let data = res.data
        if(data.errcode === 0){
            return data.data
        }else{
            throw(data.errMessage)
        }
    })
}



export function addFriendByOtherManShareByJwt(id) {
    return http.get('/user/addFriendByOtherManShareByJwt', {
        params: {
            id
        }
    }).then((res) => {
        return res.data
    })
}
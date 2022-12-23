import Request from '@/utils/luch-request/index.js' // 下载的插件
// import Request from 'luch-request' // 使用npm

const http = new Request({
  baseURL: 'https://birthday.codehub.store/api'
  // baseURL:
  //   process.env.NODE_ENV === 'development'
  //     ? 'http://127.0.0.1:7001/api'
  //     : 'https://birthday.codehub.store/api'
})

http.interceptors.response.use((res) => {
  if(res && res.data && Number(res.data.errCode) === 1){
    uni.showToast({
      icon: 'none',
      title: res.data.errMessage || res.data.errMsg,
      duration: 1000,
    })
    throw new Error(res.data.errMessage || res.data.errMsg)
  }
  return res
})

let token = ''

export function wxGetToken(code) {
  return http
    .get('/user/wxapp-login-by-code', { params: { code } })
    .then(res => {
      res = res.data
      http.setConfig(config => {
        config.header = {
          ...config.header,
          Authorization: res.data
        }
        return config
      })
      token = res.data
      // console.log('token', token)
      return res
    })
    .catch(err => {
      console.error(err)
    })
}

export function myFriends() {
  return http.get('/user/jwt/my-friends').then(res => res.data)
}

export function mySelf() {
  return http.get('/user/getSelfInfo').then(res => res.data)
}

export function createByInvitation(data) {
  return http.post('/user/createByInvitation', data)
}

export function createFriendBirthday(data) {
  return http.post('/user/jwt/create', data)
}
export function lunarToSolar(data) {
  return http.post('/common/lunarToSolar', data).then(res => res.data)
}

export function getHistoryEvents(month, day) {
  month = ('0' + month).slice(-2)
  day = ('0' + day).slice(-2)
  return http
    .get('/history/getWhatHappenedFromGivenDate', {
      params: {
        date: month + day
      }
    })
    .then(res => {
      if (res && res.data && res.data.events) {
        let reg = /<\/?.+?\/?>/g
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
  return http
    .get('/user/getFriendByShareCode', {
      params: {
        shareCode
      }
    })
    .then(res => {
      let data = res.data
      if (data.errCode === 0) {
        let i = data.data
        let today = new Date()
        i._birthday = new Date(i.birthday).format('MM月dd日')
        let j = i.solarBirthday
        i._solarBirthday = new Date(j.year, j.month - 1, j.day, 23, 59, 59)
        if (i._solarBirthday.getTime() - today.getTime() < 0) {
          i._solarBirthday.setYear(j.year + 1)
        }
        i.daysDistance = Math.floor(
          (i._solarBirthday.getTime() - today.getTime()) / (24 * 3600 * 1000)
        )
        return i
      } else {
        throw data.errMessage
      }
    })
}

export function addFriendByOtherManShareByJwt(id) {
  return http
    .get('/user/addFriendByOtherManShareByJwt', {
      params: {
        id
      }
    })
    .then(res => {
      return res.data
    })
}

export function deleteFriend(id) {
  return http
    .get('/user/deleteFriendByJwt', {
      params: {
        id
      }
    })
    .then(res => {
      return res
    })
}
export function addBirthdayNotice(params) {
  return http.post('/wx/addBirthdayNotice', params).then(res => {
    return res.data
  })
}

export function updateUserInfo(params) {
  return http.post('/user/updateUserInfo', params)
}

export function activeNoticeAgain(params) {
  return http.post('/wx/birthdayNotice/activeNoticeAgain', params)
}

export function birthdayNoticeList(params) {
  return http.post('/wx/birthdayNotice/list', params).then(res => {
    return res.data
  })
}

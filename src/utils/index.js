const Storage = function(keys = [], preKey = '') {
  let _proxy = {}
  keys.forEach(i => (_proxy[i] = preKey + i))
  this._ = new Proxy(_proxy, {
    get: function(target, key, receiver) {
      let _key = Reflect.get(target, key, receiver)
      return uni.getStorageSync(_key) || {}
    },
    set: function(target, key, value, receiver) {
      uni.setStorageSync(target[key], value || {})
      return true
    }
  })
  this.isEmpty = function(key) {
    let i = this._[key]
    if (i instanceof Array) {
      return i.length === 0
    } else if (i instanceof Object) {
      return Object.keys(i).length === 0
    } else {
      return !i
    }
  }
}

const $ = new Storage(
  ['birthdayList', 'currentBirthday', 'userInfo', 'audioFilePath', 'myBgImage'],
  'common-key-'
)
export default $
export const storage = $._

export function storageEmpty(key) {
  return $.isEmpty(key)
}

export const promisify = original => {
  return function(opt) {
    return new Promise((resolve, reject) => {
      opt = Object.assign(
        {
          success: resolve,
          fail: reject,
          complete: resolve
        },
        opt
      )
      original(opt)
    })
  }
}

export function formatBirthday(item) {
  let i = { ...item }
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
}
// https://github.com/equicy/weapp-jwt-decode/blob/master/weapp-jwt.js
export function atob(string) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/
  string = String(string).replace(/[\t\n\f\r ]+/g, '')
  if (!b64re.test(string))
    throw new TypeError(
      "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
    )
  string += '=='.slice(2 - (string.length & 3))
  var bitmap,
    result = '',
    r1,
    r2,
    i = 0
  for (; i < string.length; ) {
    bitmap =
      (b64.indexOf(string.charAt(i++)) << 18) |
      (b64.indexOf(string.charAt(i++)) << 12) |
      ((r1 = b64.indexOf(string.charAt(i++))) << 6) |
      (r2 = b64.indexOf(string.charAt(i++)))
    result +=
      r1 === 64
        ? String.fromCharCode((bitmap >> 16) & 255)
        : r2 === 64
        ? String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255)
        : String.fromCharCode(
            (bitmap >> 16) & 255,
            (bitmap >> 8) & 255,
            bitmap & 255
          )
  }
  return result
}

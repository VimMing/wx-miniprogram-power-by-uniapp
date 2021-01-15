const Storage = function (keys = [], preKey = '') {
    let _proxy = {}
    keys.forEach(i => _proxy[i] = preKey + i)
    this._ = new Proxy(_proxy, {
        get: function (target, key, receiver) {
            let _key = Reflect.get(target, key, receiver)
            return uni.getStorageSync(_key) || {}
        },
        set: function (target, key, value, receiver) {
            uni.setStorageSync(target[key], value || {})
            return true
        }
    })
    this.isEmpty = function (key) {
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

const $ = new Storage(['birthdayList', 'currentBirthday'], 'common-key-')
export default $
export const storage = $._

export function storageEmpty (key) {
  return $.isEmpty(key)
}

export const promisify = original => {
    return function (opt) {
        return new Promise((resolve, reject) => {
            opt = Object.assign({
                success: resolve,
                fail: reject,
                complete: resolve
            }, opt)
            original(opt)
        })
    }
}
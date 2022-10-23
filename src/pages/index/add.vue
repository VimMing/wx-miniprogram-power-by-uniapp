<template>
  <view class="birthday--edit--page">
    <view class="avatar--wrap">
      <view class="iconfont" :class="'icon-' + form.zodiac">
        <picker
          style="height: 100%; width: 100%"
          :range="chineseZodiac"
          :value="zodiacActiveIndex"
          @change="handleChange"
          data-name="zodiac"
        >
          <view style="opacity: 0; display: block; height: 160rpx">placeholder</view>
        </picker>
      </view>
    </view>
    <view class="form">
      <view class="form-item">
        <view class="label">姓名</view>
        <view class="inner-form">
          <input v-model="form.name" auto-focus placeholder="请输入名字" />
        </view>
      </view>
      <view class="form-item">
        <view class="label">生日</view>
        <view class="inner-form">
          <picker
            mode="multiSelector"
            @change="handleChange"
            :range="multiArray"
            :value="multiSelect"
            :color="$color.primary"
            data-name="birthday"
          >
            <view class="picker">{{
              form._birthday ? form._birthday : '点击设置生日'
            }}</view>
          </picker>
        </view>
      </view>
      <view class="form-item">
        <view class="label">公农历</view>
        <view class="inner-form">
          <radio-group @change="handleChange" class="radio--group" data-name="type">
            <label
              class="radio--label"
              v-for="item in birthdayTypes"
              :key="item.name"
              :for="item.name"
            >
              <radio
                :id="item.name"
                :value="item.value + ''"
                :checked="form.type == item.value"
                color="#ff272e"
              ></radio>
              <text>{{ item.chineseName }}</text>
            </label>
          </radio-group>
        </view>
      </view>
      <view class="more-setting">
        <view v-if="!showMore">
          <view class="form-item">
            <view class="label">更多设置</view>
            <view class="inner-form" @click="handleShowMore">
              <i class="iconfont icon-more pull-right"></i>
            </view>
          </view>
        </view>
        <view v-if="showMore">
          <view class="form-item">
            <view class="label">性别</view>
            <view class="inner-form">
              <radio-group @change="handleChange" class="radio--group" data-name="sex">
                <label
                  class="radio--label"
                  v-for="item in genders"
                  :key="item.name"
                  :for="item.name"
                >
                  <radio
                    :id="item.name"
                    :value="item.value + ''"
                    :checked="form.sex == item.value"
                    color="#ff272e"
                  ></radio>
                  <text>{{ item.chineseName }}</text>
                </label>
              </radio-group>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="submit--wrap">
      <button :loading="loading" plain @click="handleSave">保存</button>
    </view>
  </view>
</template>

<script>
import { createFriendBirthday, myFriends } from '@/utils/apis.js'
import { storage } from '@/utils'
export default {
  data() {
    return {
      zodiac: [
        'mouse',
        'cattle',
        'tiger',
        'rabitt',
        'dragon',
        'snake',
        'horse',
        'sheep',
        'monkey',
        'chicken',
        'dog',
        'pig',
      ],
      chineseZodiac: [
        '鼠',
        '牛',
        '虎',
        '兔',
        '龙',
        '蛇',
        '马',
        '羊',
        '猴',
        '鸡',
        '狗',
        '猪',
      ],
      loading: false,
      showMore: false,
      form: {
        name: '',
        sex: -1, // 0 boy , 1 girl
        birthday: '', // month-day
        type: 0, // 0: false, 1: true 公历还是农历
        zodiac: 'picker',
      },
      zodiacActiveIndex: '',
      genders: [
        { name: 'boy', value: 0, chineseName: '男' },
        { name: 'girl', value: 1, chineseName: '女' },
      ],
      // solar2lunar
      birthdayTypes: [
        { name: 'solar', value: 0, chineseName: '公历' },
        { name: 'lunar', value: 1, chineseName: '农历' },
      ],
    }
  },
  onLoad(options) {
    let today = new Date()
    this.zodiacActiveIndex = (today.getFullYear() - 1996) % 12
    // this.form.zodiac = this.zodiac[this.zodiacActiveIndex];
    if (options.id) {
      let temp = storage.currentBirthday
      this.form = temp
      this.zodiacActiveIndex = this.form.zodiac
      this.form.zodiac = this.zodiac[this.zodiacActiveIndex]
      this.form.type = Number(this.form.isLunar)
      this.form.birthday = new Date(this.form.birthday).format('MM-dd')
      console.log(this.form)
    }
  },
  computed: {
    multiSelect() {
      let res = []
      if (this.form.birthday) {
        res = this.form.birthday.split('-').map((i) => i - 1)
      } else {
        let today = new Date()
        res = [today.getMonth(), today.getDate() - 1]
      }
      return res
    },
    multiArray() {
      let months = new Array(12).fill(0)
      let days = new Array(31).fill(0)
      return [
        months.map((i, index) => index + 1 + '月'),
        days.map((i, index) => index + 1 + '日'),
      ]
    },
  },
  methods: {
    handleSave(e) {
      if (!this.form.name) {
        uni.showToast({
          icon: 'none',
          title: '请填写姓名',
          duration: 1000,
        })
        return e
      }
      if (!this.form.birthday) {
        uni.showToast({
          icon: 'none',
          title: '请填写生日',
          duration: 1000,
        })
        return e
      }
      this.loading = true
      try {
        createFriendBirthday({
          id: this.form.id,
          name: this.form.name,
          zodiac: +this.zodiacActiveIndex,
          birthday: '2021-' + this.form.birthday,
          isLunar: Boolean(+this.form.type),
        })
          .then(() => {
            myFriends()
              .then((res) => {
                storage.birthdayList = res.data
              })
              .finally(() => {
                uni.navigateBack()
                this.loading = false
              })
          })
          .catch((e) => {
            uni.showToast({
              icon: 'none',
              title: e,
              duration: 1000,
            })
            this.loading = false
          })
      } catch (e) {
        // error
        uni.showToast({
          icon: 'none',
          title: e,
          duration: 1000,
        })
        this.loading = false
      }
    },
    handleShowMore() {
      this.showMore = true
    },
    handleChange(e) {
      let {
        currentTarget: {
          dataset: { name },
        },
        detail: { value },
      } = e
      console.log(name, value)
      if (name === 'type' || name === 'sex') {
        this.form[name] = value
      }
      if (name === 'birthday') {
        this.form[name] = value.map((i) => ('0' + (i + 1)).slice(-2)).join('-')
        this.form['_' + name] = value[0] + 1 + '月' + (value[1] + 1) + '日'
      }
      if (name === 'zodiac') {
        this.form.zodiac = this.zodiac[value]
        this.zodiacActiveIndex = value
      }
    },
  },
}
</script>

<style scoped lang="scss">
.submit--wrap {
  padding: 60rpx 30rpx;
}
.radio--group {
  display: flex;
}
.radio--label {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.birthday--edit--page {
  .form {
    padding: 10rpx 20rpx;
    .form-item {
      padding: 20rpx 5rpx;
      border-bottom: 1px dashed #eeeeee;
      display: flex;
      align-items: center;
      .label {
        color: #676767;
        font-size: 16px;
        padding-left: 10rpx;
        width: 140rpx;
      }
      .inner-form {
        flex: 1;
      }
    }
  }
}
.avatar--wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
}
.avatar--wrap > view {
  width: 160rpx;
  height: 160rpx;
  padding: 10rpx;
  border: solid 1px #eee;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <view class="user-index">
    <view
      class="person-info-data-statistic-wrapper"
      :style="{ backgroundImage: 'url(' + tempFilePathBg + ')' }"
    >
      <view class="person-info flex-space-between flex-align-center">
        <view class="info flex-align-center">
          <view class="ma-10-r">
            <image class="avatar" :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" />
            <view class="avatar" v-else>V</view>
          </view>
          <view class="info-text-wrapper" v-if="userInfo.avatarUrl">
            <view v-if="userInfo.nickName">{{ userInfo.nickName }}</view>
            <view v-if="userInfo.province"
              >{{ userInfo.province }} {{ userInfo.city }}</view
            >
          </view>
          <view class="no-info-text-wrapper" v-else>
            <!-- <button  class="getInfo" @click="getUserInfo">获取头像</button> -->
            <button open-type="chooseAvatar" class="getInfo" @chooseavatar="getAvatar">
              获取头像
            </button>
          </view>
        </view>
        <view class="goto-wrapper flex-align-center">
          <uni-icon type="forward" color="white"></uni-icon>
        </view>
      </view>
      <view class="staticstic"></view>
    </view>
    <view class="tool-menu-title">工具</view>
    <view class="tool-menu-body">
      <uni-grid :column="3" :show-border="false" :square="false" @change="change">
        <uni-grid-item>
          <i class="iconfont icon-about-music"></i>
          <text class="text">音程训练</text>
        </uni-grid-item>
        <uni-grid-item>
          <i class="iconfont icon-about-me"></i>
          <text class="text">关于</text>
        </uni-grid-item>
      </uni-grid>
    </view>
  </view>
</template>

<script>
import uniIcon from '@/components/uni-icon/uni-icon.vue'
import uniGrid from '@/components/uni-grid/uni-grid.vue'
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue'
// const _ = require('ramda');
import { updateUserInfo } from '@/utils/apis.js'
import { storage, storageEmpty } from '@/utils'

export default {
  components: {
    uniIcon,
    uniGrid,
    uniGridItem,
  },
  data() {
    return {
      tempFilePathBg: 'https://source.unsplash.com/random',
      userInfo: {
        avatarUrl: '',
      },
    }
  },
  onLoad() {
    if (!storageEmpty('userInfo')) {
      this.userInfo = storage.userInfo
    }
    if (!storageEmpty('myBgImage')) {
      this.tempFilePathBg = storage.myBgImage
    }
    uni.downloadFile({
      url: 'https://source.unsplash.com/random',
      header: {
        'Content-Type': 'image/png',
      },
      success: (res) => {
        this.tempFilePathBg = res.tempFilePath
        storage.myBgImage = this.tempFilePathBg
      },
    })
    //
  },
  computed: {
    isGetUserProfileCanUse() {
      return !!uni.getUserProfile
    },
  },
  methods: {
    updateUserInfo(e) {
      this.userInfo = e.detail.userInfo
      updateUserInfo(this.userInfo)
      this.$loginUser = this.userInfo
      storage.userInfo = this.userInfo
    },
    getAvatar(e) {
      const { avatarUrl } = e.detail
      this.userInfo = {
        avatarUrl: avatarUrl,
      }
      storage.userInfo = this.userInfo
    },
    getUserInfo(e) {
      if (wx.getUserProfile) {
        console.log('使用getUserProfile方法')
        wx.getUserProfile({
          desc: '用于完善用员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (e) => {
            this.updateUserInfo({ detail: e })
          },
          fail: (e) => {
            console.log(e)
          },
        })
      }
    },
    change({ detail: { index } }) {
      if (index === 0) {
        uni.navigateTo({
          url: '/pages/music/index',
        })
      }
      if (index === 1) {
        uni.navigateTo({
          url: 'about',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.ma-10-r {
  margin-right: 20rpx;
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.flex-align-center {
  display: flex;
  align-items: center;
}
.person-info-data-statistic-wrapper {
  background-image: url(https://source.unsplash.com/random);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: $uni-text-color-inverse;
  padding: 20rpx;
  box-sizing: border-box;
  min-height: 500rpx;
  padding-top: 160rpx;

  .info-text-wrapper {
    color: white;
    & > view:first-child {
      font-size: 14px;
    }
    & > view:last-child {
      font-size: 12px;
    }
  }
  .goto-wrapper {
    justify-content: flex-end;
    width: 50rpx;
  }
  .getInfo {
    background-color: $uni-color-primary;
    color: white;
    font-size: 30rpx;
    border: 1rpx solid $uni-color-primary;
    line-height: 1;
    padding: 10rpx 20rpx;
    border-radius: 25rpx;
  }
  .avatar {
    $size: 120rpx;
    width: $size;
    height: $size;
    border-radius: 50%;
    text-align: center;
    line-height: 120rpx;
    background-color: $uni-bg-color-grey;
    color: #c0c0c0;
  }
}
.tool-menu {
  padding: 0 30upx 30upx;
}

.tool-menu-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32upx;
  color: #464e52;
  padding: 30upx;
  margin-top: -20upx;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: relative;
  background-color: $uni-bg-color;
}

.tool-menu-title__after {
  position: relative;
  color: $uni-color-primary;
}

.tool-menu-title:after {
  content: '';
  position: absolute;
  left: 0;
  margin: auto;
  top: 0;
  bottom: 0;
  width: 10upx;
  height: 40upx;
  border-top-right-radius: 10upx;
  border-bottom-right-radius: 10upx;
  background-color: $uni-color-primary;
}

.tool-menu .tool-menu-title {
  margin: 40upx 0;
}

.tool-menu-body {
  border-top: 1px #f5f5f5 solid;
  padding: 30upx;
  background: #fff;
}

.tool-menu-info {
  padding: 30upx;
  color: #3b4144;
  background: #fff;
}

.image {
  width: 50upx;
  height: 50upx;
}

.text {
  font-size: 26upx;
  margin-top: 10upx;
}
</style>

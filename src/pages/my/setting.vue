<template>
  <view class="form">
    <form-item label="昵称">
      <div>
        <input
          type="nickname"
          v-model="userInfo.nickName"
          placeholder="请输入昵称"
          @change="handleInputChange"
        />
      </div>
    </form-item>
    <form-item label="头像">
      <div class="flex justify-content-center align-items-center">
        <image class="avatar" :src="userInfo.avatarUrl" v-if="userInfo.avatarUrl" />
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="getAvatar">
          获取头像
        </button>
      </div>
    </form-item>
  </view>
</template>
<script>
import FormItem from '@/components/form-item/index.vue'
import { updateUserInfo } from '@/utils/apis.js'
import { storage, storageEmpty } from '@/utils'
export default {
  components: {
    FormItem,
  },
  data() {
    return {
      userInfo: {
        avatarUrl: '',
        nickName: '',
      },
    }
  },
  onLoad() {
    if (!storageEmpty('userInfo')) {
      this.userInfo = storage.userInfo
    }
  },
  methods: {
    handleInputChange(e) {
      const { value } = e.detail
      this.userInfo.nickName = value
      updateUserInfo({
        nickName: this.userInfo.nickName,
      })
      storage.userInfo = this.userInfo
    },
    getAvatar(e) {
      const { avatarUrl } = e.detail
      this.userInfo.avatarUrl = avatarUrl
      storage.userInfo = this.userInfo
      updateUserInfo({
        avatarUrl,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
.avatar-btn {
  margin-left: auto;
  margin-right: 10rpx;
  background-color: white;
  color: $uni-color-primary;
}
button.avatar-btn::after {
  border: none;
}
</style>

<template>
  <view class="container">
    <img src="https://codehub.store/douban/today.png" alt="" mode="widthFix" />
    <view class="submit--wrap">
      <button :loading="loading" plain @click="handleSave">下载保存</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    loading: false;
  },
  methods: {
    handleSave() {
      this.loading = true;
      uni.downloadFile({
        url: "https://codehub.store/douban/today.png",
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({
                icon: "none",
                title: "保存成功",
                duration: 1000,
              });
            },
            complete: () => {
              uni.showToast({
                icon: "none",
                title: "保存失败",
                duration: 1000,
              });
            },
          });
        },
        fail: () => {
          uni.showToast({
            icon: "none",
            title: "下载失败",
            duration: 1000,
          });
          this.loading = false;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  img {
    display: block;
    width: 90vw;
    margin: 5vw auto 1vw auto;
  }
}
.submit--wrap {
  padding: 60rpx 30rpx;
}
</style>
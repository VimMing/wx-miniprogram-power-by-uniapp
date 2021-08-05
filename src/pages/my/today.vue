<template>
  <view class="container">
    <view v-if="imgSrc">
      <img :src="imgSrc" alt="" mode="widthFix" />
      <view class="submit--wrap">
        <button :loading="loading" plain @click="handleSave">下载保存</button>
      </view>
    </view>
    <div class="spinner" v-else>
      <div class="cube1"></div>
      <div class="cube2"></div>
      <div class="loadingText">海报加载中...</div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      imgSrc: "",
    };
  },
  onLoad() {
    uni.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    this.loading = true;
    uni.downloadFile({
      url: "https://codehub.store/douban/today.png",
      success: (res) => {
        this.imgSrc = res.tempFilePath;
        this.loading = false;
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
  methods: {
    handleSave() {
      this.loading = true;
      uni.saveImageToPhotosAlbum({
        filePath: this.imgSrc,
        success: () => {
          uni.showToast({
            icon: "none",
            title: "保存成功",
            duration: 1000,
          });
          this.loading = false;
        },
        fail: () => {
          uni.showToast({
            icon: "none",
            title: "保存失败",
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
.cube1,
.cube2 {
  background-color: $uni-color-primary;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 40%;
  left: calc(50% - 40px);

  -webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
  animation: sk-cubemove 1.8s infinite ease-in-out;
}

.cube2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.loadingText {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  color: $uni-color-primary;
}

@-webkit-keyframes sk-cubemove {
  25% {
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  }
  50% {
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  }
  75% {
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg)
      scale(0.5);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}

@keyframes sk-cubemove {
  25% {
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  }
  50.1% {
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  }
  75% {
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg)
      scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>
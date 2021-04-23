<template>
  <view class="user-index">
    <view class="person-info-data-statistic-wrapper">
      <view class="person-info flex-space-between flex-align-center">
        <view class="info flex-align-center">
          <view class="ma-10-r">
            <image
              class="avatar"
              :src="userInfo.avatarUrl"
              v-if="userInfo.avatarUrl"
            ></image>
            <view class="avatar" v-else>V</view>
          </view>
          <view class="info-text-wrapper" v-if="userInfo.avatarUrl">
            <view>{{ userInfo.nickName }}</view>
            <view>{{ userInfo.province }} {{ userInfo.city }}</view>
          </view>
          <view class="no-info-text-wrapper" v-else
            ><button
              class="getInfo"
              open-type="getUserInfo"
              @getuserinfo="getUserInfo"
            >
              获取头像
            </button></view
          >
        </view>
        <view class="goto-wrapper flex-align-center"
          ><uni-icon type="forward" color="white"></uni-icon
        ></view>
      </view>
      <view class="staticstic"></view>
    </view>
    <view class="tool-menu-title">工具</view>
    <view class="tool-menu-body">
      <uni-grid
        :column="3"
        :show-border="false"
        :square="false"
        @change="change"
      >
        <uni-grid-item>
          <image
            class="image"
            src="cloud://production-15c960.7072-production-15c960/icons/vote-icon.png"
            mode="aspectFill"
          />
          <text class="text">关于</text>
        </uni-grid-item>
      </uni-grid>
    </view>
  </view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue";
import uniGrid from "@/components/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue";
// const _ = require('ramda');
import { updateUserInfo } from "@/utils/apis.js";

export default {
  components: {
    uniIcon,
    uniGrid,
    uniGridItem,
  },
  data() {
    return {
      userInfo: {
        avatarUrl: "",
      },
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo(e) {
      uni
        .getUserInfo()
        .then((res) => {
          if (res && res[1] && res[1]["userInfo"]) {
            this.userInfo = res[1]["userInfo"];
            console.log(this.userInfo);
            updateUserInfo(this.userInfo);
            this.$loginUser.avatarUrl = this.userInfo.avatarUrl;
          } else {
            throw res;
          }
        })
        .catch((e) => {
          console.log(e, "获取用户信息错误");
        });
    },
    change(index) {
      uni.navigateTo({
        url: "about",
      });
    },
  },
};
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
  background-color: $uni-color-primary;
  color: $uni-text-color-inverse;
  min-height: 400rpx;
  padding: 20rpx;
  box-sizing: border-box;

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
    background-color: inherit;
    color: white;
    font-size: 30rpx;
    border: 1rpx solid;
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
  content: "";
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

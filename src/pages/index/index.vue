<template>
  <view>
    <view v-if="len">
      <view class="birthday-list-wrap">
        <view class="birthday-item" v-for="(item, index) in list" :key="index">
          <view class="avatar-wrap">
            <view class="avatar iconfont" :class="'icon-' + item.zodiac"></view>
          </view>
          <view class="birthday-content">
            <view class="name-birthday-wrap">
              <text class="name">{{item.name}}</text>
              <text class="birthday">{{item.birthday}}</text>
            </view>
            <view></view>
          </view>
        </view>
      </view>
      <uni-fab
        :pattern="pattern"
        :content="content"
        horizontal="right"
        vertical="bottom"
        direction="horizontal"
        @trigger="trigger"
      ></uni-fab>
    </view>
    <view class="content" v-else>
      <image class="logo" src="/static/birthday-app-logo.png" />
      <view>
        <text class="title">{{title}}</text>
      </view>
      <view class="iconfont icon-add" @click="handleAdd"></view>
    </view>
  </view>
</template>

<script>
import uniFab from "@/components/uni-fab/uni-fab.vue";
export default {
  components: {
    uniFab
  },
  data() {
    return {
      title: "Hello, 点击下面的按钮添加生日备忘^_^",
      list: [],
      pattern: {
        color: "white",
        selectedColor: "",
        backgroundColor: this.$color.primary,
        buttonColor: this.$color.primary
      },
      content: [{ text: "手动填写", iconPath: "/static/icons/manualPen.png" }]
    };
  },
  computed: {
    len() {
      return this.list.length;
    }
  },
  onShow() {
    var storage_birthday_list = "storage_birthday_list";
    let arr = [];
    try {
      const value = uni.getStorageSync(storage_birthday_list);
      if (value) {
        arr = JSON.parse(value) || [];
      }
    } catch (e) {
      console.error(e);
    }
    this.list = arr;
    console.log(this.list);
  },
  methods: {
    trigger(e) {
      console.log(e);
      uni.navigateTo({
        url: "add"
      });
    },
    handleAdd() {
      uni.navigateTo({
        url: "add"
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.birthday-list-wrap {
  .birthday-content {
    display: flex;
    justify-content: space-between;
	padding: 10rpx;
	.name{
		color: $uni-text-color;
	}
  }
  .name-birthday-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .birthday-item {
    display: flex;
    border-bottom: 1px dashed #eee;
    padding: 10rpx 8rpx;
  }
  .avatar-wrap {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 50%;
    margin-right: 10px;
  }
  .avatar {
    width: 80rpx;
    height: 80rpx;
  }
  padding: 10px 30rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.icon-add {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: $uni-color-primary;
  text-align: center;
  height: 120rpx;
  width: 120rpx;
  margin-top: 15px;
  border-radius: 50%;
  border: 2px solid $uni-color-primary;
}
</style>

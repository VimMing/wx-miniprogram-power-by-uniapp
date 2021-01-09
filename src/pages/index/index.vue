<template>
  <view>
    <view v-if="len">
      <view class="birthday-list-wrap">
        <view class="birthday-item" v-for="(item, index) in l" :key="index">
          <view class="avatar-wrap">
            <view class="avatar iconfont" :class="'icon-' + zodiac[item.zodiac]"></view>
          </view>
          <view class="birthday-content">
            <view class="name-birthday-wrap">
              <text class="name">{{item.name}}</text>
              <text class="birthday">{{item._birthday}}({{item.isLunar ? "农历" : "公历"}})</text>
            </view>
            <view class="next-birthday-wrap">
              <view
                class="next-birthday-distance"
              >{{item.daysDistance == 0 ? "今" : item.daysDistance }}日</view>
              <view class="next-birthday-day">距下次生日{{item._solarBirthday.format("yyyy年MM月dd日")}}</view>
            </view>
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
import { wxGetToken, myFriends } from "@/utils/apis.js";
import { storage, storageEmpty, promisify } from "@/utils";
export default {
  components: {
    uniFab
  },
  data() {
    return {
      title: "Hello, 点击下面的按钮添加生日备忘^_^",
      list: [],
      zodiac: [
        "mouse",
        "cattle",
        "tiger",
        "rabitt",
        "dragon",
        "snake",
        "horse",
        "sheep",
        "monkey",
        "chicken",
        "dog",
        "pig"
      ],
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
    },
    l() {
      let res = [];
      let today = new Date();
      res = this.list.map(item => {
        let i = { ...item };
        i._birthday = new Date(i.birthday).format("MM月dd日");
        let j = i.solarBirthday;
        i._solarBirthday = new Date(j.year, j.month - 1, j.day, 23, 59, 59);
        if (i._solarBirthday.getTime() - today.getTime() < 0) {
          i._solarBirthday.setYear(j.year + 1);
        }
        i.daysDistance = Math.floor(
          (i._solarBirthday.getTime() - today.getTime()) / (24 * 3600 * 1000)
        );
        return i;
      });
      res.sort((i, j) => i.daysDistance - j.daysDistance);
      return res;
    }
  },
  onPullDownRefresh() {
    console.log("refresh");
    myFriends()
      .then(res => {
        this.list = res.data || [];
        storage.birthdayList = res.data;
      })
      .finally(() => {
        uni.stopPullDownRefresh();
      });
  },
  onLoad() {
    promisify(uni.login)({
      provider: "weixin"
    }).then(({ code }) => {
      wxGetToken(code).then(res => {
        myFriends().then(res => {
          this.list = res.data || [];
          storage.birthdayList = res.data;
        });
      });
    });
  },
  onShow() {
    console.log(storageEmpty("birthdayList"));
    if (!storageEmpty("birthdayList")) {
      this.list = storage.birthdayList;
    }
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
    flex: 1;
    text.birthday {
      font-size: $uni-font-size-sm;
    }
    .name {
      font-size: $uni-font-size-lg;
      color: $uni-text-color;
    }
    .next-birthday-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
    }
    .next-birthday-distance {
      color: $uni-color-primary;
      font-size: $uni-font-size-lg;
    }
    .next-birthday-day {
      white-space: nowrap;
      font-size: $uni-font-size-sm;
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
    width: 80rpx;
    height: 80rpx;
  }
  .avatar {
    width: 100%;
    height: 100%;
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

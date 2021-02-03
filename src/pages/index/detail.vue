<template>
  <div class="birthday-detail-page">
    <view class="avatar--wrap">
      <view>
        <div
          class="iconfont"
          :class="'icon-' + zodiac[currentBirthday.zodiac]"
          style="height: 100%; width: 100%"
        >
          <view style="opacity: 0; display: block; height: 160rpx"
            >placeholder</view
          >
        </div>
      </view>
    </view>
    <view class="user-name">{{ currentBirthday.name }}</view>
    <div class="user-birthday">
      {{ currentBirthday._birthday }}({{
        currentBirthday.isLunar ? "农历" : "公历"
      }})
    </div>
    <div class="birthday-distance">
      <span class="distance"
        >{{
          currentBirthday.daysDistance == 0
            ? "今"
            : currentBirthday.daysDistance
        }}天</span
      >后是他/她的生日
    </div>
    <liuyuno-tabs
      :tabData="tabs"
      :defaultIndex="defaultIndex"
      @tabClick="tabClick"
    />
    <div>
      <events-tab :events="events" v-show="defaultIndex === 0"/>
      <notices-tab :events="events" v-show="defaultIndex === 1"/>
    </div>
    <div class="operation-wrap">
      <button @click="remind">
        <i class="iconfont icon-clock"></i>
        <text>订阅提醒</text>
      </button>
      <button open-type="share">
        <i class="iconfont icon-wechat"></i>
        <text>分享生日</text>
      </button>
      <button @click="add" :loading="loading.adding">
        <i class="iconfont icon-add-friends"></i>
        <text>添加生日</text>
      </button>
    </div>
  </div>
</template>
<script>
// Hbuild
// 15116103402@163.com
// 123456qweR
import {
  getHistoryEvents,
  getFriendByShareCode,
  addFriendByOtherManShareByJwt,
} from "@/utils/apis.js";
import { storage, storageEmpty, promisify } from "@/utils";
import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
import eventsTab from "@/components/detail-tabs/events.vue";
import noticesTab from "@/components/detail-tabs/notices.vue";
export default {
  components: {
    liuyunoTabs,
    eventsTab,
    noticesTab
  },
  data() {
    return {
      tabs: [
        {
          name: "历史时刻",
        },
        { name: "通知订阅" },
      ],
      defaultIndex: 0,
      loading: {
        adding: false,
      },
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
        "pig",
      ],
      events: [],
      currentBirthday: {
        solarBirthday: {
          month: "",
          day: "",
        },
      },
    };
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: `${this.currentBirthday.name}的生日`,
      path: `/pages/index/detail?shareCode=${this.currentBirthday.shareCode}`,
    };
  },
  methods: {
    tabClick(item) {
      this.defaultIndex = item;
    },
    remind() {
      uni.requestSubscribeMessage({
        tmplIds: ["E3YdVL8G4BZaFJ9ORfp6-nKtRhB1oyh-HWM8zKJpjj8"],
        success(res) {
          console.log(res);
        },
      });
    },
    add() {
      this.loading.adding = true;
      addFriendByOtherManShareByJwt(this.currentBirthday.id).finally(() => {
        this.loading.adding = false;
      });
    },
    showCurrentBirthday(options) {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
      if (!storageEmpty("currentBirthday")) {
        let t = storage.currentBirthday;
        let j = t.solarBirthday;
        if (t.id == options.id) {
          this.currentBirthday = storage.currentBirthday;
          getFriendByShareCode(this.currentBirthday.shareCode).then((res) => {
            console.log(res, this.currentBirthday);
          });
          uni.setNavigationBarTitle({
            title: `${this.currentBirthday.name}的生日`,
          });
          getHistoryEvents(j.month, j.day).then((res) => {
            this.events = res.reverse() || [];
          });
        }
      }
    },
  },
  onLoad(options) {
    console.log(options);
    if (options.shareCode) {
    } else {
      this.showCurrentBirthday(options);
    }
  },
};
</script>
<style scoped lang="scss">
$operation-wrap-height: 120rpx;

.events-container {
  padding-bottom: $operation-wrap-height;
}
.operation-wrap {
  display: flex;
  position: fixed;
  width: 100%;
  height: $operation-wrap-height;
  bottom: 0;
  border-top: 1px solid #eee;
  i {
    font-size: 24px;
  }
  .icon-wechat {
    color: $uni-color-success;
  }
  .icon-add-friends {
    color: $uni-color-primary;
  }
  .icon-clock {
    color: $uni-color-warning;
  }
  button {
    flex: 1;
    border: none;
    border-radius: 0;
    height: 100%;
    display: flex;
    font-size: 14px;
    flex-direction: column;
    padding: 8px 0;
    justify-content: space-between;
    line-height: 1;
    background: white;
  }
  button::after {
    border: none;
  }
}
.user-name {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.user-birthday {
  text-align: center;
  margin: 12rpx 0;
  color: #464646;
}
.birthday-distance {
  text-align: center;
  margin-bottom: 40rpx;
  .distance {
    color: $uni-color-primary;
  }
}
.icon i {
  font-size: 16px;
  color: #c2c2c2;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
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
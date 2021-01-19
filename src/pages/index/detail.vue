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
    <div class="events-container">
      <div id="events">
        <div class="title">
          历史上<span class="date">她/他生日这天</span>都发生了什么？
        </div>
        <div class="events">
          <div v-for="item in events" :key="item.year">
            <div class="year">
              {{ item.year }} <span class="character">年</span>
            </div>
            <div class="icon">
              <i class="iconfont icon-event" v-if="item.type === 'event'"></i>
              <i class="iconfont icon-birth" v-if="item.type === 'birth'"></i>
              <i class="iconfont icon-death" v-if="item.type === 'death'"></i>
            </div>
            <div class="event">
              <div class="event_tit-wrapper">
                <div class="event_tit">
                  {{ item.title }}
                </div>
              </div>
              <div class="event_cnt">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-wrap">
      <button open-type="share">
        <i class="iconfont icon-wechat"></i>
        <text>分享</text>
      </button>
      <button>
        <i class="iconfont icon-add-friends"></i>
        <text>添加</text>
      </button>
    </div>
  </div>
</template>
<script>
import { getHistoryEvents } from "@/utils/apis.js";
import { storage, storageEmpty, promisify } from "@/utils";
export default {
  data() {
    return {
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
  onLoad(options) {
    console.log(options);
    uni.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    if (!storageEmpty("currentBirthday")) {
      let t = storage.currentBirthday;
      let j = t.solarBirthday;
      if (t.id == options.id) {
        this.currentBirthday = storage.currentBirthday;
        uni.setNavigationBarTitle({
          title: `${this.currentBirthday.name}的生日`,
        });
        getHistoryEvents(j.month, j.day).then((res) => {
          this.events = res || [];
        });
      }
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
#events .title {
  padding-left: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 16px;
  color: #666;
  background: #f5f5f5;
}
#events .events {
  margin-left: 170rpx;
}
#events .events > div {
  position: relative;
  border-left: 1px solid #e1e3e6;
  padding-bottom: 90rpx;
}
#events .events div .year {
  position: absolute;
  left: -160rpx;
  top: 0;
  height: 25px;
  line-height: 25px;
  color: #333;
  font-size: 14px;
  text-align: right;
}
#events .events div .icon {
  position: absolute;
  left: -18px;
  top: -5px;
  border: 5px solid #fff;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  text-align: center;
  background: #e5e5e5;
}
.event {
  padding-top: 12px;
}
.event .event_tit-wrapper {
  font-size: 16px;
  border-top: 1px solid #e1e3e6;
}
.event .event_tit-wrapper .event_tit {
  position: relative;
  top: -13px;
  margin-left: 35px;
  padding-left: 5px;
  background: #fff;
}
.event .event_cnt {
  margin: -6px 0 0 40px;
  font-size: 14px;
  color: #999;
  padding-right: 5px;
}
.events a {
  color: #338de6;
  text-decoration: none;
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
#events .events > div:first-child {
  padding-top: 40px;
}
#events .events > div:first-child .year {
  margin-top: 40px;
}
#events .events > div:first-child .icon {
  margin-top: 40px;
}
</style>
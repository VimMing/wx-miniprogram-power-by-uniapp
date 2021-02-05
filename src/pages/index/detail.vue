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
      <span class="distance">
        {{
          currentBirthday.daysDistance == 0
            ? "今"
            : currentBirthday.daysDistance
        }}天 </span
      >后是他/她的生日
    </div>
    <liuyuno-tabs
      :tabData="tabs"
      :defaultIndex="defaultIndex"
      @tabClick="tabClick"
    />
    <div>
      <events-tab :events="events" v-show="defaultIndex === 0" />
      <notices-tab
        :list="notices"
        :b="currentBirthday"
        v-show="defaultIndex === 1"
      />
    </div>
    <div>
      <uni-popup ref="popup" type="dialog">
        <uni-popup-dialog
          type="error"
          title="提醒日期"
          :before-close="true"
          @close="close"
          @confirm="confirm"
        >
          <view style="display: flex">
            <span>提醒日期:</span>
            <picker
              @change="handleChange"
              :range="days"
              :value="form.day"
              :color="$color.primary"
              data-name="day"
            >
              <span class="picker">生日{{ days[form.day] }}天前</span>
            </picker>
          </view>
          <view style="display: flex">
            <span>提醒时间:</span>
            <picker
              mode="multiSelector"
              @change="handleChange"
              :range="multiArray"
              :value="form.noticeDay"
              :color="$color.primary"
              data-name="noticeDay"
            >
              <span class="picker">{{ form._noticeDay }}</span>
            </picker>
          </view>
          <view>(可点击修改)</view>
        </uni-popup-dialog>
      </uni-popup>
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
  addBirthdayNotice,
  birthdayNoticeList,
  myFriends,
} from "@/utils/apis.js";
import { storage, storageEmpty, promisify } from "@/utils";
import liuyunoTabs from "@/components/liuyuno-tabs/liuyuno-tabs.vue";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/components/uni-popup/uni-popup-dialog.vue";
import eventsTab from "@/components/detail-tabs/events.vue";
import noticesTab from "@/components/detail-tabs/notices.vue";
export default {
  components: {
    liuyunoTabs,
    eventsTab,
    noticesTab,
    uniPopup,
    uniPopupDialog,
  },
  data() {
    return {
      notices: [],
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
      days: [1, 3, 7],
      events: [],
      currentBirthday: {
        solarBirthday: {
          month: "",
          day: "",
        },
      },
      form: {
        noticeDay: [0, 9],
        day: 1,
        _noticeDay: "上午10点",
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
  computed: {
    multiArray() {
      let months = new Array(12).fill(0);
      return [["上午", "下午"], months.map((i, index) => index + 1 + "点")];
    },
  },
  methods: {
    add() {
      this.loading.adding = true;
      addFriendByOtherManShareByJwt(this.currentBirthday.id)
        .then((res) => {
          console.log(res);
          if (res.errcode === 0) {
            myFriends().then((res) => {
              storage.birthdayList = res.data;
            });
            uni.showToast({
              title: "添加成功",
              duration: 2000,
              mask: true,
              complete: () => {
                setTimeout(() => {
                  uni.redirectTo({
                    url: `/pages/index/index`,
                  });
                }, 1500);
              },
            });
          } else {
            uni.showToast({
              title: res.errMessage,
              duration: 2000,
              icon: "none",
            });
          }
        })
        .finally(() => {
          this.loading.adding = false;
        });
    },
    birthdayNoticeList() {
      return birthdayNoticeList({
        birthdayId: this.currentBirthday.id,
      }).then((res) => {
        console.log(res);
        let data = res.data || [];
        data.forEach(
          (i) => (i._when = new Date(i.when).format("yyyy-MM-dd HH点"))
        );
        this.notices = data.reverse();
        return this.notices
      });
    },
    handleChange(e) {
      let {
        currentTarget: {
          dataset: { name },
        },
        detail: { value },
      } = e;
      if (name === "day") {
        this.form[name] = value;
      }
      if (name === "noticeDay") {
        this.form[name] = value;
        this.form["_" + name] = `${value[0] ? "下午" : "上午"}${
          value[1] + 1
        }点`;
      }
    },
    /**
     * 点击取消按钮触发
     * @param {Object} done
     */
    close(done) {
      // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
      // ...
      done();
    },
    /**
     * 点击确认按钮触发
     * @param {Object} done
     * @param {Object} value
     */
    confirm(done, value) {
      // 输入框的值
      console.log(value);
      let j = this.currentBirthday.solarBirthday;
      let t = this.form.noticeDay;
      let birthday = new Date(
        j.year,
        j.month - 1,
        j.day,
        t[0] ? (12 + t[1] + 1) % 24 : t[1] + 1
      );
      birthday.setDate(birthday.getDate() - this.days[this.form.day]);
      console.log(j, birthday.format("yyyy-MM-dd HH:mm:ss"));
      addBirthdayNotice({
        when: birthday.format("yyyy-MM-dd HH:mm:ss"),
        birthdayId: this.currentBirthday.id,
      }).then(() => {
        this.birthdayNoticeList().then(() => {
          this.defaultIndex = 1;
        });
      });
      // TODO 做一些其他的事情，手动执行 done 才会关闭对话框
      // ...
      done();
    },
    tabClick(item) {
      this.defaultIndex = item;
    },
    remind() {
      uni.requestSubscribeMessage({
        tmplIds: ["E3YdVL8G4BZaFJ9ORfp6-nKtRhB1oyh-HWM8zKJpjj8"],
        success: (res) => {
          this.$refs.popup.open();
        },
        fail: (res) => {
          uni.showToast({
            icon: "none",
            title: "微信信息订阅，授权失败",
            duration: 1000,
          });
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
        if (t.id == options.id || t.shareCode === options.shareCode) {
          this.currentBirthday = storage.currentBirthday;
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
    if (options.shareCode) {
      console.log(options.shareCode);
      getFriendByShareCode(options.shareCode).then((res) => {
        storage.currentBirthday = res;
        this.showCurrentBirthday(options);
      });
    } else {
      this.showCurrentBirthday(options);
    }
    this.birthdayNoticeList();
  },
};
</script>
<style scoped lang="scss">
$operation-wrap-height: 120rpx;
.picker {
  color: $uni-color-primary;
}
.events-container {
  padding-bottom: $operation-wrap-height;
}
.operation-wrap {
  display: flex;
  position: fixed;
  width: 100%;
  height: $operation-wrap-height;
  bottom: 0;
  z-index: 1;
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
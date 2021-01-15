<template>
  <div>
    <div class="events-container" v-if="events.length">
      <div id="events">
        <div class="title">
          历史上<span class="date"
            >{{ currentBirthday.solarBirthday.month }}月{{
              currentBirthday.solarBirthday.day
            }}日</span
          >都发生了什么？
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
  </div>
</template>
<script>
import { getHistoryEvents } from "@/utils/apis.js";
import { storage, storageEmpty, promisify } from "@/utils";
export default {
  data() {
    return {
      events: [],
      currentBirthday: {
        solarBirthday: {
          month: "",
          day: "",
        },
      },
    };
  },
  onLoad(options) {
    if (!storageEmpty("currentBirthday")) {
      let t = storage.currentBirthday;
      let j = t.solarBirthday;
      if (t.id == options.id) {
        this.currentBirthday = storage.currentBirthday;
        getHistoryEvents(j.month, j.day).then((res) => {
          this.events = res || [];
        });
      }
    }
  },
};
</script>
<style scoped>
#events .title {
  padding-left: 15px;
  /* width: 320px; */
  height: 45px;
  line-height: 45px;
  font-size: 20px;
  color: #666;
  background: #f5f5f5;
}
#events .events {
  margin-left: 80px;
}
#events .events > div {
  position: relative;
  border-left: 1px solid #e1e3e6;
  padding-bottom: 45px;
}
#events .events div .year {
  position: absolute;
  left: -80px;
  top: 0;
  /* width: 120px; */
  height: 25px;
  line-height: 25px;
  color: #333;
  font-size: 16px;
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
</style>
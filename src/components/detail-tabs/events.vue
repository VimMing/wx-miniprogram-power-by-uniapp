<template>
  <div class="events-container">
    <div id="events">
      <div class="title">
          历史上<span class="date">生日这天</span>都发生了什么？
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
</template>

<script>
export default {
  name: 'events-tab',  
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
  mounted(){
      // console.log('hello world')
  }
};
</script>

<style lang="scss">
$operation-wrap-height: 120rpx;

.events-container {
  padding-bottom: $operation-wrap-height;
}
.events-container .title {
  padding-left: 30rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 16px;
  color: #666;
  background: #f5f5f5;
}
.events-container .events {
  margin-left: 170rpx;
}
.events-container .events > div {
  position: relative;
  border-left: 1px solid #e1e3e6;
  padding-bottom: 90rpx;
}
.events-container .events div .year {
  position: absolute;
  left: -160rpx;
  top: 0;
  height: 25px;
  line-height: 25px;
  color: #333;
  font-size: 14px;
  text-align: right;
}
.events-container .events div .icon {
  position: absolute;
  left: -18px;
  top: -5px;
  border: 5px solid #fff;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  text-align: center;
  background: rgba(229, 229, 229, 0.21);
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
.events-container .events > div:first-child {
  padding-top: 40px;
}
.events-container .events > div:first-child .year {
  margin-top: 40px;
}
.events-container .events > div:first-child .icon {
  margin-top: 40px;
}
.icon-event{
  color: $uni-color-warning;
}
.icon-birth{
  color: $uni-color-success;
}
</style>
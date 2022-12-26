<template>
  <div class="notice-tabs">
    <div v-if="list.length">
      <uni-card
        title="生日提醒"
        v-for="item in list"
        :key="item.id"
        :extra="item.status === 0 ? '未完成' : '已完成'"
        :note="true"
      >
        <div>生日日期: {{ new Date(b._solarBirthday).format('yyyy年MM月dd日') }}</div>
        <div>提醒日期: {{ item._when }}</div>
        <template v-slot:footer>
          <view class="footer-btn-wrap">
            <button
              @click="remind(item)"
              plain
              class="remind-again"
              v-if="item.status === 1 || noticeAgainWhenNoticeDayLessThanNow(item)"
            >
              <text>再次订阅</text>
            </button>
            <button @click="delRemind(item)" plain>
              <text>删除数据</text>
            </button>
          </view>
        </template>
      </uni-card>
    </div>
    <div class="empty-holder" v-else>
      <div>请点击下方或左下方的《订阅提醒》</div>
      <div>添加生日提醒, 不错过生日</div>
      <view class="submit--wrap">
        <button plain @click="remindFirstTime">订阅提醒</button>
      </view>
    </div>
  </div>
</template>

<script>
import uniCard from '@/components/uni-card/uni-card.vue'
import { promisify } from '@/utils'
export default {
  components: {
    uniCard,
  },
  name: 'notices-tab',
  props: {
    list: {
      default: () => [],
      type: Array,
    },
    b: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    remind(item) {
      this.$emit('remindAgain', item)
    },
    delRemind(item) {
      promisify(uni.showModal)({
        title: '删除确认',
        content: `确定删除该提醒吗？`,
      }).then((res) => {
        if (res.confirm) {
          this.$emit('remindDel', item)
        }
      })
    },
    remindFirstTime() {
      this.$emit('remindFirstTime')
    },
    noticeAgainWhenNoticeDayLessThanNow(item) {
      if (new Date(item.when).getTime() < new Date().getTime()) {
        return true
      }
      return false
    },
  },
}
</script>

<style scoped lang="scss">
$operation-wrap-height: 120rpx;
.notice-tabs {
  padding-bottom: $operation-wrap-height;
}
.empty-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  text-align: center;
}
.submit--wrap {
  padding: 60rpx 30rpx;
}
.footer-btn-wrap {
  display: flex;
  & > button {
    flex: 1;
  }
  .remind-again {
    color: $uni-color-success;
    border: 1px solid $uni-color-success;
  }
  button + button {
    margin: 0 10px;
  }
}
</style>

<template>
  <div class="notice-tabs">
    <div v-if="list.length">
      <uni-card
        title="生日提醒"
        v-for="item in list"
        :key="item.id"
        :extra="item.status === 0 ? '未完成' : '已完成'"
        :note="item.status === 1"
      >
        <div>
          生日日期: {{ new Date(b._solarBirthday).format("yyyy年MM月dd日") }}
        </div>
        <div>提醒日期: {{ item._when }}</div>
        <template v-slot:footer>
          <button @click="remind(item)" plain>
            <text>再次订阅</text>
          </button>
        </template>
      </uni-card>
    </div>
    <div class="empty-holder" v-else>hello, 请点击左下方的《订阅提醒》添加</div>
  </div>
</template>

<script>
import uniCard from "@/components/uni-card/uni-card.vue";
import { activeNoticeAgain } from "@/utils/apis.js";
export default {
  components: {
    uniCard,
  },
  name: "notices-tab",
  props: {
    list: {
      default: () => [],
      type: Array,
    },
    b: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    remind(item) {
      this.$emit("remindAgain", item)
    }
  },
};
</script>

<style scoped lang="scss">
$operation-wrap-height: 120rpx;
.notice-tabs {
  padding-bottom: $operation-wrap-height;
}
.empty-holder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  text-align: center;
}
</style>

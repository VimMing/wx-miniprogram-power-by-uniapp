<template>
  <view class="form-item">
    <view class="label">{{ label }}</view>
    <view class="inner-form">
      <slot>
        <input v-model="_value" :placeholder="placeholder" @input="handleInput" />
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    label: {
      default: '',
      type: String,
    },
    placeholder: {
      default: '请输入',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      _value: '',
    }
  },
  watch: {
    value() {
      this._value = this.value
    },
  },
  mounted() {
    this._value = this.value
  },
  methods: {
    handleInput() {
      this.$emit('input', this._value)
    },
  },
}
</script>

<style lang="scss" scoped>
.form-item {
  padding: 20rpx 5rpx;
  border-bottom: 1px dashed #eeeeee;
  display: flex;
  align-items: center;
  .label {
    color: #676767;
    font-size: 16px;
    padding-left: 10rpx;
    width: 140rpx;
  }
  .inner-form {
    flex: 1;
  }
}
</style>

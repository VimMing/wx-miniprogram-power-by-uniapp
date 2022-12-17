<template>
  <view class="keyboard">
    <view v-for="(k, _) in keys" :key="_" :class="k.class" @click="mouseup(k)" />
  </view>
</template>

<script>
export default {
  name: 'KeyBoard',
  props: {
    baseKeyIndex: {
      type: Number,
      default: 4,
    },
    questionPitch: {
      type: Number,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      correct: false,
      keys: [],
    }
  },
  watch: {
    baseKeyIndex() {
      this.setKeys()
    },
  },
  mounted() {
    this.setKeys()
  },
  methods: {
    setKeys() {
      const baseKeyIndex = this.baseKeyIndex
      this.keys = [
        {
          class: 'white c',
          pitch: baseKeyIndex * 12 + 0,
          keycode: 'KeyA',
          pressing: false,
        },
        {
          class: 'black c-sharp',
          pitch: baseKeyIndex * 12 + 1,
          keycode: 'KeyW',
          pressing: false,
        },
        {
          class: 'white d',
          pitch: baseKeyIndex * 12 + 2,
          keycode: 'KeyS',
          pressing: false,
        },
        {
          class: 'black d-sharp',
          pitch: baseKeyIndex * 12 + 3,
          keycode: 'KeyE',
          pressing: false,
        },
        {
          class: 'white e',
          pitch: baseKeyIndex * 12 + 4,
          keycode: 'KeyD',
          pressing: false,
        },
        {
          class: 'white f',
          pitch: baseKeyIndex * 12 + 5,
          keycode: 'KeyF',
          pressing: false,
        },
        {
          class: 'black f-sharp',
          pitch: baseKeyIndex * 12 + 6,
          keycode: 'KeyT',
          pressing: false,
        },
        {
          class: 'white g',
          pitch: baseKeyIndex * 12 + 7,
          keycode: 'KeyG',
          pressing: false,
        },
        {
          class: 'black g-sharp',
          pitch: baseKeyIndex * 12 + 8,
          keycode: 'KeyY',
          pressing: false,
        },
        {
          class: 'white a',
          pitch: baseKeyIndex * 12 + 9,
          keycode: 'KeyH',
          pressing: false,
        },
        {
          class: 'black a-sharp',
          pitch: baseKeyIndex * 12 + 10,
          keycode: 'KeyU',
          pressing: false,
        },
        {
          class: 'white b',
          pitch: baseKeyIndex * 12 + 11,
          keycode: 'KeyJ',
          pressing: false,
        },
        {
          class: 'white c5',
          pitch: (baseKeyIndex + 1) * 12,
          keycode: 'KeyK',
          pressing: false,
        },
      ]
    },
    play(pitch) {
      this.$emit('sheetPressed', pitch)
    },
    mouseup(key) {
      if (Number(key.pitch) === Number(this.questionPitch)) {
        this.correct = true
      } else {
        this.correct = false
      }
      if (this.correct) {
        key.class = key.class + ' success active'
        setTimeout(() => {
          key.class = key.class.replace(' success active', '')
        }, 100)
      } else {
        key.class = key.class + ' error active'
        setTimeout(() => {
          key.class = key.class.replace(' error active', '')
        }, 100)
      }
      this.play(key.pitch)
    },
  },
}
</script>

<style lang="scss" scoped>
.keyboard {
  position: fixed;
  bottom: 130rpx;
  margin: 0 auto;
  max-width: 880px;
  display: block;
  width: 100%;
  height: 220px;
}
.white,
.black {
  float: left;
  box-sizing: border-box;
  /* -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none; */
}

.white {
  height: 200px;
  width: 12.5%;
  border: 1px solid black;
  display: inline-block;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  /* cursor: pointer; */
}

.black {
  height: 120px;
  width: 5%;
  border: 1px solid #000000;
  background-color: #000000;
  display: inline-block;
  cursor: pointer;
  z-index: 10;
  /* left: 15px;
  margin-left: -30px; */
  position: absolute;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.black::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100px;
  width: 100%;
  background-color: #272626;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.success.white:active,
.success.white.active {
  background-color: $uni-color-light-success;
}

.success.black:active,
.success.black.active {
  background-color: $uni-color-light-success;
}

.error.white:active,
.error.white.active {
  background-color: $uni-color-error;
}

.error.black:active,
.error.black.active {
  background-color: $uni-color-error;
}

.c-sharp {
  left: 10%;
}

.d-sharp {
  left: 22.5%;
}

.f-sharp {
  left: 47.5%;
}

.g-sharp {
  left: 60%;
}

.a-sharp {
  left: 73%;
}
</style>

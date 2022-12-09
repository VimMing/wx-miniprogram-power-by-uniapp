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
  },
  computed: {
    keys() {
      const baseKeyIndex = this.baseKeyIndex
      return [
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
  },
  mounted() {},
  methods: {
    play(pitch) {
      this.$emit('sheetPressed', pitch)
    },
    mouseup(key) {
      key.class = key.class.replaceAll(' active', '')
      key.pressing = true
      key.class = key.class + ' active'
      this.play(key.pitch)
    },
  },
}
</script>

<style scoped>
.keyboard {
  position: fixed;
  bottom: 10rpx;
  margin: 0 auto;
  max-width: 880px;
  display: block;
  width: 100%;
  height: 350px;
}
.white,
.black {
  float: left;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.white {
  height: 300px;
  width: 12.5%;
  border: 2px solid black;
  display: inline-block;
  cursor: pointer;
}

.black {
  height: 200px;
  width: 5%;
  border: 2px solid #000000;
  background-color: #000000;
  display: inline-block;
  cursor: pointer;
  z-index: 10;
  /* left: 15px;
  margin-left: -30px; */
  position: absolute;
}

.white:active,
.white.active {
  background-color: #e0e0e0;
}

.black:active,
.black.active {
  background-color: #404040;
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

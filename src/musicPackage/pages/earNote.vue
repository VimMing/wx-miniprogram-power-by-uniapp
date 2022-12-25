<template>
  <view>
    <!-- <view class="module-tooltips"
      >训练范围为C3~C6, 播放内容全部为全音, 参照音为C4,
      可以点击下方设置按钮，进行自定义设置</view
    > -->
    <view class="container-wrap" @click="playQuestion()">
      <view class="tips">问题</view>
      <view class="container-wrap_inner">
        <button><i class="iconfont icon-audio-play"></i></button>
        <progress
          class="progress"
          :percent="percent"
          color="#333333"
          active
          duration="8"
          stroke-width="4"
          @activeend="handleActiveend"
        />
        <text class="pitch-note">?</text>
      </view>
    </view>
    <view class="container-wrap" @click="playStardardPitch()">
      <view class="tips">参考</view>
      <view class="container-wrap_inner">
        <button><i class="iconfont icon-audio-play"></i></button>
        <progress
          class="progress"
          :percent="percentStardard"
          color="#333333"
          active
          duration="8"
          stroke-width="4"
          @activeend="handleStardardActiveend"
        />
        <text class="pitch-note">{{ getNote(stardardPitch) }}</text>
      </view>
    </view>
    <Keyboard
      @sheetPressed="handleSheetPressed"
      :baseKeyIndex="basePitch"
      :disable="keyboardDisabled"
      :questionPitch="questionPitch"
    ></Keyboard>
    <uni-drawer ref="showRight" mode="right" :mask-click="true" :width="320">
      <scroll-view style="height: 100%" scroll-y="true">
        <view class="form">
          <view class="form-item">
            <view class="label">参考音</view>
            <view class="inner-form">
              <picker
                mode="selector"
                @change="handleChange"
                :range="allPitchArray"
                range-key="note"
                :value="drawerSetting.stardardPitch"
                :color="$color.primary"
                data-name="stardardPitch"
              >
                <view class="picker">{{ getNote(drawerSetting.stardardPitch) }}</view>
              </picker>
            </view>
          </view>
          <view class="form-item">
            <view class="label">范围</view>
            <view class="inner-form note-range">
              <picker
                mode="selector"
                @change="handleChange"
                :range="allPitchArray"
                range-key="note"
                :value="drawerSetting.lowPitch"
                :color="$color.primary"
                data-name="lowPitch"
                class="note-range-picker"
              >
                <view class="picker">{{ getNote(drawerSetting.lowPitch) }}</view>
              </picker>
              <text>~</text>
              <picker
                mode="selector"
                @change="handleChange"
                :range="allPitchArray"
                range-key="note"
                :value="drawerSetting.highPitch"
                :color="$color.primary"
                data-name="highPitch"
                class="note-range-picker"
              >
                <view class="picker">{{ getNote(drawerSetting.highPitch) }}</view>
              </picker>
            </view>
          </view>
        </view>
        <button @click="closeDrawer" class="setting-save">保存</button>
      </scroll-view>
    </uni-drawer>
    <div class="operation-wrap">
      <button open-type="share">
        <i class="iconfont icon-wechat"></i>
        <text>分享</text>
      </button>
      <button @click="showDrawer">
        <i class="iconfont icon-setting"></i>
        <text>设置</text>
      </button>
    </div>
  </view>
</template>
<script>
import { storage, storageEmpty } from '@/utils'
import WxAudioPlayer from '@/musicPackage/utils/WxAudioPlayer'
import Keyboard from '@/musicPackage/components/Keyboard.vue'
import UniDrawer from '@/components/uni-drawer/uni-drawer.vue'
let audioData = []
let playIns = null
export default {
  components: { Keyboard, UniDrawer },
  data() {
    return {
      timeId: null,
      percent: 0,
      percentStardard: 0,
      filePath: '',
      drawerSetting: {
        stardardPitch: 0,
        lowPitch: 0,
        highPitch: 0,
      },
      keyboardDisabled: false,
      started: false,
      audioContext: null,
      loading: false,
      tryCounter: 0, // 最多试3次
      // playIns: null,
      basePitch: 4,
      stardardPitch: 4 * 12 + 0,
      questionPitch: 4 * 12 + 0,
      lowPitch: 3 * 12,
      highPitch: 6 * 12,
      diatonicArray: [0, 2, 4, 5, 7, 9, 11], // 全音阶
      diatonicArrayText: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      allPitchArray: [],
      chromaticScaleArrayText: [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
      ],
      answerPitchText: '',
    }
  },
  onLoad() {
    this.next()
    this.downFile()
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
    for (let i = 0; i < 12 * 10; i++) {
      let note = this.chromaticScaleArrayText[i % 12] + parseInt(i / 12) + ''
      this.allPitchArray.push({
        pitch: i,
        note,
      })
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `音程训练～～`,
      path: `/musicPackage/pages/earNote`,
    }
  },
  methods: {
    getNote(pitch) {
      return this.allPitchArray[pitch] && this.allPitchArray[pitch].note
    },
    handleChange(e) {
      let {
        currentTarget: {
          dataset: { name },
        },
        detail: { value },
      } = e
      this.drawerSetting[name] = Number(value)
    },
    showDrawer() {
      this.drawerSetting = {
        stardardPitch: this.stardardPitch,
        lowPitch: this.lowPitch,
        highPitch: this.highPitch,
      }
      this.$refs.showRight.open()
    },
    closeDrawer() {
      this.stardardPitch = this.drawerSetting.stardardPitch
      this.lowPitch = this.drawerSetting.lowPitch
      this.highPitch = this.drawerSetting.highPitch
      this.$refs.showRight.close()
      this.next()
    },
    playQuestion() {
      this.percent = 100
      this.playPitch()
    },
    playStardardPitch() {
      this.percentStardard = 100
      this.playPitch(this.stardardPitch)
    },
    handleStardardActiveend() {
      this.percentStardard = 0
    },
    handleActiveend() {
      this.percent = 0
    },
    next(play = false) {
      let randomPitch = Math.floor(
        Math.random() * (this.highPitch - this.lowPitch + 1) + this.lowPitch
      )
      let rangePitch = Math.floor(randomPitch / 12)
      this.basePitch = rangePitch
      let diatonicRandom = Math.floor(Math.random() * this.diatonicArray.length)
      this.questionPitch = rangePitch * 12 + this.diatonicArray[diatonicRandom]
      this.answerPitchText = this.diatonicArrayText[diatonicRandom] + rangePitch
      if (play) {
        this.percent = 100
        this.playPitch()
        this.started = true
      }
    },
    handleSheetPressed(pitch) {
      if (this.timeId) {
        clearTimeout(this.timeId)
        if (this.keyboardDisabled) {
          this.timeId = setTimeout(() => {
            this.next(true)
            this.keyboardDisabled = false
          }, 1200)
        }
      }
      this.playPitch(pitch)
      if (Number(pitch) === Number(this.questionPitch)) {
        this.keyboardDisabled = true
        this.timeId = setTimeout(() => {
          this.next(true)
          this.keyboardDisabled = false
        }, 1200)
      }
    },
    playPitch(pitch = this.questionPitch) {
      if (!this.audioContext) {
        if (wx.createWebAudioContext) {
          this.audioContext = wx.createWebAudioContext()
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          })
          return
        }
        // else if (wx.createInnerAudioContext) {

        //   console.log('createInnerAudioContext.....')
        //   this.audioContext = wx.createInnerAudioContext({
        //     useWebAudioImplement: true, // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        //   })
        // } else if (wx.createAudioContext) {
        //   console.log('createAudioContext.....')
        //   this.audioContext = wx.createAudioContext({
        //     useWebAudioImplement: true, // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        //   })
        // }
      }
      playIns.queueWaveTable(
        this.audioContext,
        this.audioContext.destination,
        audioData,
        0,
        pitch,
        0.75
      )
    },
    readFile() {
      const fs = wx.getFileSystemManager()
      // 判断文件/目录是否存在
      fs.access({
        path: `${this.filePath}`,
        success: () => {
          fs.readFile({
            filePath: `${this.filePath}`,
            encoding: 'utf8',
            position: 0,
            success: (res) => {
              if (res.data) {
                try {
                  audioData = JSON.parse(res.data)
                  playIns = new WxAudioPlayer()
                } catch (e) {
                  console.error(' audioData = JSON.parse(res.data)', e)
                }
              }
            },
            fail(res) {
              console.error(res)
            },
          })
        },
        fail: (res) => {
          // 文件不存在或其他错误
          this.tryCounter++
          if (this.tryCounter > 3) {
            uni.showToast({
              icon: 'none',
              title: '文件不能访问',
              duration: 1000,
            })
            return
          }
          console.error(res)
          storage.audioFilePath = ''
          this.downFile()
        },
      })
    },
    downFile() {
      if (!storageEmpty('audioFilePath')) {
        this.filePath = storage.audioFilePath
        this.readFile()
      } else {
        this.loading = true
        wx.showLoading({
          title: '加载中',
        })
        uni.downloadFile({
          url: 'https://codehub.store/douban/audio_tone_0000_SBLive_sf2.json',
          success: (res) => {
            this.filePath = res.tempFilePath
            storage.audioFilePath = res.tempFilePath
            this.readFile()
            this.loading = false
            wx.hideLoading()
          },
          fail: () => {
            uni.showToast({
              icon: 'none',
              title: '下载失败',
              duration: 1000,
            })
            this.loading = false
            wx.hideLoading()
          },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.answer {
  display: flex;
  justify-content: center;
  font-size: 40rpx;
  padding: 10rpx 0;
  margin-top: 40rpx;
  color: $uni-text-color;
  justify-content: space-around;
}
.module-tooltips {
  position: relative;
  width: 640rpx;
  margin: 10px auto;
  padding: 10px;
}
.btn-wrap,
.container-wrap {
  font-size: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150rpx;
  width: 640rpx;
  margin: 10px auto;
  background-color: #f0f0f0;
  padding: 0 10px;
  border-radius: 10px;
  .tips {
    top: 10px;
    position: absolute;
    font-size: 14px;
  }
  &_inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
  .progress {
    flex-grow: 1;
  }
  .pitch-note {
    padding-left: 10px;
  }
  // display: flex;
  // justify-content: space-around;
  margin-top: 10px;
  // & > button {
  //   width: 300rpx;
  // }
  button {
    border: none;
    border-radius: 0;
    display: flex;
    font-size: inherit;
    justify-content: center;
    align-items: center;
    line-height: 1;
    background: inherit;
  }
  button::after {
    border: none;
  }
}
.mt {
  margin-top: 20rpx;
}

$operation-wrap-height: 120rpx;

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

.form {
  padding: 10rpx 20rpx;
  margin-bottom: 100rpx;
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
}
.note-range {
  display: flex;
  &-picker {
    padding: 0 10px;
  }
}
.setting-save {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>

<template>
  <view>
    <text>现在是简单版， 训练范围为C3~C6, 播放内容全部为全音, 参照音为C4, 261.1HZ</text>

    <view class="container-wrap">
      <view class="tips">问题</view>
      <view class="container-wrap_inner" @click="playQuestion()">
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
    <view class="container-wrap">
      <view class="tips">参考</view>
      <view class="container-wrap_inner" @click="playStardardPitch()">
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
        <text class="pitch-note">C4</text>
      </view>
    </view>
    <!-- <view> <button @click="playPitch(stardardPitch)">标准C4音</button></view> -->
    <!-- <view style="margin-top: 10px"><button open-type="share">分享</button></view> -->

    <Keyboard
      @sheetPressed="handleSheetPressed"
      :baseKeyIndex="basePitch"
      :disable="keyboardDisabled"
      :questionPitch="questionPitch"
    ></Keyboard>
  </view>
</template>
<script>
import { storage, storageEmpty } from '@/utils'
import WxAudioPlayer from './WxAudioPlayer'
import Keyboard from './Keyboard.vue'
let audioData = []
let playIns = null
export default {
  components: { Keyboard },
  data() {
    return {
      percent: 0,
      percentStardard: 0,
      filePath: '',
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
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `音程训练～～`,
      path: `/pages/music/index`,
    }
  },
  methods: {
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
      this.playPitch(pitch)
      if (Number(pitch) === Number(this.questionPitch)) {
        this.keyboardDisabled = true
        setTimeout(() => {
          this.next(true)
          this.keyboardDisabled = false
        }, 1200)
      }
    },
    playPitch(pitch = this.questionPitch) {
      if (!this.audioContext) {
        this.audioContext = wx.createWebAudioContext()
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
</style>

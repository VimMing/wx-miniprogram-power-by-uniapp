<template>
  <view>
    <text>现在是简单版， 训练范围为C3~C6, 播放内容全部为全音, 参照音为C4, 261.1HZ</text>
    <view class="btn-wrap">
      <button @click="next(true)">{{ started ? '下一题' : '开始' }}</button>
      <button @click="playPitch(stardardPitch)">标准C4音</button></view
    >
    <view class="btn-wrap">
      <button @click="playPitch()">重复播放</button>
      <button @click="showAnswer = true">查看答案</button></view
    >
    <view style="margin-top: 10px"><button open-type="share">分享</button></view>

    <view v-if="showAnswer" class="answer">
      <text>正确答案: {{ answerPitchText }}</text>
      <text v-if="yourAnswerPitchText">你的答案: {{ yourAnswerPitchText }}</text>
    </view>
    <Keyboard @sheetPressed="handleSheetPressed" :baseKeyIndex="basePitch"></Keyboard>
  </view>
</template>
<script>
import { storage, storageEmpty } from '@/utils'
import WxAudioPlayer from './WxAudioPlayer'
import Keyboard from './Keyboard.vue'
let audioData = []
export default {
  components: { Keyboard },
  data() {
    return {
      yourAnswerPitchText: '',
      showAnswer: false,
      filePath: '',
      started: false,
      audioContext: null,
      loading: false,
      tryCounter: 0, // 最多试3次
      playIns: null,
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
    next(play = false) {
      this.showAnswer = false
      this.yourAnswerPitchText = ''
      let randomPitch = Math.floor(
        Math.random() * (this.highPitch - this.lowPitch + 1) + this.lowPitch
      )
      let rangePitch = Math.floor(randomPitch / 12)
      this.basePitch = rangePitch
      let diatonicRandom = Math.floor(Math.random() * this.diatonicArray.length)
      this.questionPitch = rangePitch * 12 + this.diatonicArray[diatonicRandom]
      this.answerPitchText = this.diatonicArrayText[diatonicRandom] + rangePitch
      if (play) {
        this.playPitch()
        this.started = true
      }
    },
    handleSheetPressed(pitch) {
      this.playPitch(pitch)
      this.yourAnswerPitchText = this.chromaticScaleArrayText[pitch % 12] + this.basePitch
      this.showAnswer = true
    },
    playPitch(pitch = this.questionPitch) {
      if (!this.audioContext) {
        this.audioContext = wx.createWebAudioContext()
      }
      this.playIns.queueWaveTable(
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
                  this.playIns = new WxAudioPlayer()
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
.btn-wrap {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  & > button {
    width: 300rpx;
  }
}
</style>

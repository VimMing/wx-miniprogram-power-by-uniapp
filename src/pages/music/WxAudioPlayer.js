import { atob } from "@/utils"
export default function WxAudioPlayer() {
  this.envelopes = []
  this.afterTime = 0.5
  this.nearZero = 0.000001
}

WxAudioPlayer.prototype.queueWaveTable = function(
  audioContext,
  target,
  preset,
  when,
  pitch,
  duration,
  volume
) {
  this.resumeContext(audioContext)
  volume = this.limitVolume(volume)
  var zone = this.findZone(audioContext, preset, pitch)
  /***
   * baseDetune代表原始音频的pitch, 这个pitch已经放大一百倍了
   *  乐理常识是一个8度是上一个8度的2倍， 一个8度里面有12个半音， 整个8度会均匀分到， 使得它成等比数列
   *  C*q12 = 2C, q = Math.pow(2, 1 / 12)
   * playRate为频率的倍数， 比如2倍，原始为440HZ, 现在为 880HZ
   * playRate = Math.pow(2, (pitch - originalPitch) / 12)
   * pitch - originalPitch为中间相隔的半音数量
   */
  var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune
  var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0)
  var startWhen = when
  if (startWhen < audioContext.currentTime) {
    startWhen = audioContext.currentTime
  }
  var waveDuration = duration + this.afterTime
  var envelope = this.findEnvelope(audioContext, target)

  this.setupEnvelope(
    audioContext,
    envelope,
    zone,
    volume,
    startWhen,
    waveDuration,
    duration
  )
  envelope.audioBufferSourceNode = audioContext.createBufferSource()
  envelope.audioBufferSourceNode.playbackRate.setValueAtTime(playbackRate, 0)

  envelope.audioBufferSourceNode.buffer = zone.buffer

  envelope.audioBufferSourceNode.connect(envelope)
  envelope.audioBufferSourceNode.start(startWhen, zone.delay)
  envelope.audioBufferSourceNode.stop(startWhen + waveDuration)
  envelope.when = startWhen
  envelope.duration = waveDuration
  envelope.pitch = pitch
  envelope.preset = preset
  return envelope

  // console.log(envelope)
  // // Get an AudioBufferSourceNode.
  // // This is the AudioNode to use when we want to play an AudioBuffer
  // var source = audioContext.createBufferSource()
  // // set the buffer in the AudioBufferSourceNode
  // source.buffer = zone.buffer
  // // connect the AudioBufferSourceNode to the
  // // destination so we can hear the sound
  // source.connect(target)
  // // start the source playing
  // source.start()
}

WxAudioPlayer.prototype.noZeroVolume = function(n) {
  if (n > this.nearZero) {
    return n
  } else {
    return this.nearZero
  }
}

WxAudioPlayer.prototype.setupEnvelope = function(
  audioContext,
  envelope,
  zone,
  volume,
  when,
  sampleDuration,
  noteDuration
) {
  envelope.gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime)
  var lastTime = 0
  var lastVolume = 0
  var duration = noteDuration
  var zoneahdsr = zone.ahdsr
  if (sampleDuration < duration + this.afterTime) {
    duration = sampleDuration - this.afterTime
  }
  if (zoneahdsr) {
    if (!(zoneahdsr.length > 0)) {
      zoneahdsr = [
        {
          duration: 0,
          volume: 1
        },
        {
          duration: 0.5,
          volume: 1
        },
        {
          duration: 1.5,
          volume: 0.5
        },
        {
          duration: 3,
          volume: 0
        }
      ]
    }
  } else {
    zoneahdsr = [
      {
        duration: 0,
        volume: 1
      },
      {
        duration: duration,
        volume: 1
      }
    ]
  }
  var ahdsr = zoneahdsr
  envelope.gain.cancelScheduledValues(when)
  envelope.gain.setValueAtTime(
    this.noZeroVolume(ahdsr[0].volume * volume),
    when
  )
  for (var i = 0; i < ahdsr.length; i++) {
    if (ahdsr[i].duration > 0) {
      if (ahdsr[i].duration + lastTime > duration) {
        var r =
          1 - (ahdsr[i].duration + lastTime - duration) / ahdsr[i].duration
        var n = lastVolume - r * (lastVolume - ahdsr[i].volume)
        envelope.gain.linearRampToValueAtTime(
          this.noZeroVolume(volume * n),
          when + duration
        )
        break
      }
      lastTime = lastTime + ahdsr[i].duration
      lastVolume = ahdsr[i].volume
      envelope.gain.linearRampToValueAtTime(
        this.noZeroVolume(volume * lastVolume),
        when + lastTime
      )
    }
  }
  envelope.gain.linearRampToValueAtTime(
    this.noZeroVolume(0),
    when + duration + this.afterTime
  )
}

WxAudioPlayer.prototype.findEnvelope = function(audioContext, target) {
  var envelope = null
  for (var i = 0; i < this.envelopes.length; i++) {
    var e = this.envelopes[i]
    if (
      e.target == target &&
      audioContext.currentTime > e.when + e.duration + 0.001
    ) {
      try {
        if (e.audioBufferSourceNode) {
          e.audioBufferSourceNode.disconnect()
          e.audioBufferSourceNode.stop(0)
          e.audioBufferSourceNode = null
        }
      } catch (x) {
        //audioBufferSourceNode is dead already
      }
      envelope = e
      break
    }
  }
  if (!envelope) {
    envelope = audioContext.createGain()
    envelope.target = target
    envelope.connect(target)
    envelope.cancel = function() {
      if (
        envelope &&
        envelope.when + envelope.duration > audioContext.currentTime
      ) {
        envelope.gain.cancelScheduledValues(0)
        envelope.gain.setTargetAtTime(0.00001, audioContext.currentTime, 0.1)
        envelope.when = audioContext.currentTime + 0.00001
        envelope.duration = 0
      }
    }
    this.envelopes.push(envelope)
  }
  return envelope
}

WxAudioPlayer.prototype.limitVolume = function(volume) {
  if (volume) {
    volume = 1.0 * volume
  } else {
    volume = 0.5
  }
  return volume
}

WxAudioPlayer.prototype.resumeContext = function(audioContext) {
  try {
    if (audioContext.state == 'suspended') {
      console.log('audioContext.resume', audioContext)
      audioContext.resume()
    }
  } catch (e) {
    //don't care
  }
}

WxAudioPlayer.prototype.findZone = function(audioContext, preset, pitch) {
  // var zone = preset.zones[0]
  var zone = null
  // 这个的目的是为了音色更好
  for (var i = preset.zones.length - 1; i >= 0; i--) {
    zone = preset.zones[i]
    if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
      break
    }
  }
  try {
    if (zone) this.adjustZone(audioContext, zone)
  } catch (ex) {
    console.log('adjustZone', ex)
  }
  return zone
}

WxAudioPlayer.prototype.adjustZone = function(audioContext, zone) {
  if (zone.buffer == null) {
    zone.delay = 0
    if (zone.sample) {
      var decoded = atob(zone.sample)
      zone.buffer = audioContext.createBuffer(
        1,
        decoded.length / 2,
        zone.sampleRate
      )
      var float32Array = zone.buffer.getChannelData(0)
      var b1, b2, n
      for (var i = 0; i < decoded.length / 2; i++) {
        b1 = decoded.charCodeAt(i * 2)
        b2 = decoded.charCodeAt(i * 2 + 1)
        b1 = b1 < 0 ? b1 + 256 : b1
        b2 = b2 < 0 ? b2 + 256 : b2
        n = b2 * 256 + b1
        n = n >= (256 * 256) / 2 ? n - 256 * 256 : n
        float32Array[i] = n / (256 * 256)
      }
    }
  }
  zone.loopStart = this.numValue(zone.loopStart, 0)
  zone.loopEnd = this.numValue(zone.loopEnd, 0)
  zone.coarseTune = this.numValue(zone.coarseTune, 0)
  zone.fineTune = this.numValue(zone.fineTune, 0)
  zone.originalPitch = this.numValue(zone.originalPitch, 6000)
  zone.sampleRate = this.numValue(zone.sampleRate, 44100)
  zone.sustain = this.numValue(zone.originalPitch, 0)
}

WxAudioPlayer.prototype.numValue = function(aValue, defValue) {
  if (typeof aValue === 'number') {
    return aValue
  } else {
    return defValue
  }
}

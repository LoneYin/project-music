<template>
    <div class="player" v-show="playList.length > 0">
        <transition
            name="normal"
            @enter="enter"
            @after="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image" alt>
                </div>
                <div class="top">
                    <div class="back">
                        <i class="icon-back" @click="minimize"></i>
                    </div>
                    <h1 class="title ellipsis" v-html="currentSong.name"></h1>
                    <h2 class="subtitle ellipsis" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" ref="imageWrapper">
                                <img
                                    ref="image"
                                    class="image"
                                    :class="rotate"
                                    :src="currentSong.image"
                                    alt
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <ProgressBar :percent="percent" @percentChange="onProgressBarChange"/>
                        </div>
                        <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" :class="readyToPlay ? '' : 'disable'">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="togglePlaying" :class="playing ? 'icon-pause' : 'icon-play'"></i>
                        </div>
                        <div class="icon i-right" :class="readyToPlay ? '' : 'disable'">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="maximize">
                <div class="icon">
                    <div class="imgWrapper" ref="miniWrapper">
                        <img
                            ref="miniImage"
                            :class="rotate"
                            width="40"
                            height="40"
                            :src="currentSong.image"
                            alt
                        >
                    </div>
                </div>
                <div class="text">
                    <h2 class="name ellipsis" v-html="currentSong.name"></h2>
                    <p class="desc ellipsis" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <ProgressCircle :percent="percent">
                        <i
                            @click.stop="togglePlaying"
                            :class="playing ? 'icon-mini icon-pause-mini' : 'icon-mini icon-play-mini'"
                        ></i>
                    </ProgressCircle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio
            :src="currentSong.url"
            ref="audio"
            @canplay="ready"
            @error="error"
			@ended="end"
            @timeupdate="timeUpdate"
        ></audio>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import keyframeAnimation from 'create-keyframe-animation'
import { prefixStyle } from 'utils/prefix'
import ProgressBar from 'components/progress-bar/ProgressBar.vue'
import ProgressCircle from 'components/progress-circle/ProgressCircle.vue'
import playMode from 'utils/playMode'
import shuffle from 'utils/shuffle'

export default {
    data() {
        return {
            readyToPlay: false,
			currentTime: 0
        }
    },
    components: {
        ProgressBar,
        ProgressCircle
    },
    computed: {
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
			'currentIndex',
			'mode',
			'sequenceList'
        ]),
        rotate() {
            return this.playing ? 'play' : 'stop'
        },
        percent() {
            return this.currentTime / this.currentSong.duration
        },
        iconMode() {
            switch (this.mode) {
                case playMode.sequence:
                    return 'icon-sequence'
                case playMode.loop:
                    return 'icon-loop'
                case playMode.random:
                    return 'icon-random'
                default:
                    return ''
            }
        }
    },
    watch: {
        currentSong(newSong, oldSong) {
			if (newSong.id === oldSong.id) {
				return
			}
            this.$nextTick(() => {
                this.$refs.audio.play()
            })
        },
        playing(newStatus) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newStatus ? audio.play() : audio.pause()
            })
        }
    },
    methods: {
        minimize() {
            this.setFullScreen(false)
        },
        maximize() {
            this.setFullScreen(true)
        },
        enter(el, done) {
            const { x, y, scale } = this.getPositionAndScale()

            const animation = {
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            }

            keyframeAnimation.registerAnimation({
                name: 'moveIn',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })

            keyframeAnimation.runAnimation(this.$refs.cdWrapper, 'moveIn', done)
        },
        afterEnter() {
            keyframeAnimation.unregisterAnimation('moveIn')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            const prefixTransform = prefixStyle('transform')

            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const { x, y, scale } = this.getPositionAndScale()
            this.$refs.cdWrapper.style[prefixTransform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            const prefixTransform = prefixStyle('transform')

            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[prefixTransform] = ''
        },
        getPositionAndScale() {
            const targetWidth = 40
            const offsetLeft = 40
            const offsetBottom = 30
            const offsetTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - offsetLeft)
            const y = window.innerHeight - offsetTop - offsetBottom - width / 2

            return {
                x,
                y,
                scale
            }
        },
        togglePlaying() {
            this.setPlaying(!this.playing)
        },
        next() {
            if (!this.readyToPlay) {
                return
			}
			if (this.mode === playMode.loop) {
				this.loop()
				return
			}
            let index = this.currentIndex + 1
            if (index === this.playList.length) {
                index = 0
            }
            this.setCurrentIndex(index)
            this.readyToPlay = false
            !this.playing && this.togglePlaying()
        },
        prev() {
            if (!this.readyToPlay) {
                return
			}
			if (this.mode === playMode.loop) {
				this.loop()
				return
			}
            let index = this.currentIndex - 1
            if (index === -1) {
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            this.readyToPlay = false
            !this.playing && this.togglePlaying()
		},
		loop() {
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
		},
        ready() {
            this.readyToPlay = true
        },
        error() {
            this.readyToPlay = true
		},
		end() {
			this.next()
		},
        timeUpdate(e) {
            this.currentTime = e.target.currentTime
        },
        formatTime(time) {
            time = Number.parseInt(time)
            const minute = Number.parseInt(time / 60)
            const second = Number.parseInt(time % 60)
            return `${this.pad(minute)}:${this.pad(second)}`
        },
        pad(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        },
        onProgressBarChange(percent) {
            this.$refs.audio.currentTime = this.currentSong.duration * percent
            if (!this.playing) {
                this.togglePlaying()
            }
		},
		changeMode() {
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlayList(list)
		},
		resetCurrentIndex(list, song) {
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlaying: 'SET_PLAYING',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlayList: 'SET_PLAYLIST'
        })
    }
}
</script>

<style lang="less">
@import "~assets/style/variable.less";
.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: @color-background;
        .background {
            position: absolute;
            left: -5%;
            top: -5%;
            width: 110%;
            height: 110%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }
        .top {
            position: relative;
            margin-bottom: 25px;
            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: @font-size-large-x;
                    color: @color-theme;
                    transform: rotate(-90deg);
                }
            }
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                font-size: @font-size-large;
                color: @color-text;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    box-sizing: border-box;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border-radius: 50%;
                            border: 10px solid rgba(255, 255, 255, 0.1);
                            animation: rotate 20s linear infinite;
                        }
                        .stop {
                            animation-play-state: paused;
                        }
                    }
                }
                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: @font-size-medium;
                        color: @color-text;
                    }
                }
            }
            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        line-height: 32px;
                        color: @color-text-n;
                        font-size: @font-size-medium;
                        &.current {
                            color: @color-text;
                        }
                    }
                    .pure-music {
                        padding-top: 50%;
                        line-height: 32px;
                        color: @color-text;
                        font-size: @font-size-medium;
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper {
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: @color-text-n;
                }
                &.active {
                    width: 20px;
                    border-radius: 5px;
                    background: @color-text-l;
                }
            }
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time {
                    color: @color-text;
                    font-size: @font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                .progress-bar-wrapper {
                    flex: 1;
                    margin: 0 10px;
                }
            }
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    color: @color-theme;
                    &.disable {
                        color: @color-theme-d;
                    }
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-favorite {
                    color: @color-sub-theme;
                }
            }
        }
        &.normal-enter-active,
        &.normal-leave-active {
            transition: all 0.4s;
            .top,
            .bottom {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }
        &.normal-enter,
        &.normal-leave-to {
            opacity: 0;
            .top {
                transform: translate3d(0, -100px, 0);
            }
            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: @color-highlight-background;
        &.mini-enter-active,
        &.mini-leave-active {
            transition: all 0.4s;
        }
        &.mini-enter,
        &.mini-leave-to {
            opacity: 0;
        }
        .icon {
            flex: 0 0 40px;
            width: 40px;
            height: 40px;
            padding: 0 10px 0 20px;
            .imgWrapper {
                height: 100%;
                width: 100%;
                img {
                    border-radius: 50%;
                    animation: rotate 10s linear infinite;
                    &.stop {
                        animation-play-state: paused;
                    }
                }
            }
        }
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name {
                margin-bottom: 2px;
                font-size: @font-size-medium;
                color: @color-text;
            }
            .desc {
                font-size: @font-size-small;
                color: @color-text-d;
            }
        }
        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-play-mini,
            .icon-pause-mini,
            .icon-playlist {
                font-size: 30px;
                color: @color-theme-d;
            }
            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
            .progress-circle {
                width: 32px;
                height: 32px;
            }
        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>

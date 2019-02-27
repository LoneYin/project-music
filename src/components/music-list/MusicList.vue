<template>
	<div class="music-list">
		<div class="back" @click="$router.go(-1)">
			<i class="icon-back"></i>
		</div>
		<h2 class="title" v-html="title"></h2>
		<div class="bg-image" ref="bgImage">
			<div class="play-wrapper" ref="btnPlay" v-if="songs.length > 0 && showBtnPlay">
				<div class="play">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" :style="bgStyle" ref="blur"></div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<Scroll
			ref="scrollWrapper"
			class="list"
			:probeType="probeType"
			:scrollEvent="scrollEvent"
			@onScroll="onScroll"
		>
			<div class="song-list-wrapper">
				<song-list :songs="songs"></song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<Loading></Loading>
			</div>
		</Scroll>
	</div>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import SongList from './SongList'
import Loading from 'components/loading/Loading'

const RESERVED_HEIGHT = 42

export default {
	props: {
		bgImage: {
			type: String,
			default: ''
		},
		songs: {
			type: Array,
			default: () => []
		},
		title: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			scrollY: 0,
			probeType: 3,
			scrollEvent: true,
			showBtnPlay: true
		}
	},
	components: {
		Scroll,
		SongList,
		Loading
	},
	computed: {
		bgStyle() {
			return `background-image: url(${this.bgImage})`
		},
		bgImageStyle() {
			return this.$refs.bgImage.style
		}
	},
	methods: {
		onScroll(position) {
			this.scrollY = position.y
		}
	},
	watch: {
		scrollY(newVal) {
			let zIndex = 0
			let scale = 1
			let blur = 0

			// layer层同步滚动
			let translateY = Math.max(this.minTranslateY, newVal)
			this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
			this.$refs.layer.style.webkitTransform = `translate3d(0, ${translateY}px, 0)`

			const percent = Math.abs(newVal / this.imageHeight) // 计算缩放比和模糊度系数

			if (newVal > 0) {
				// 下拉时
				scale = 1 + percent
				zIndex = 10
			} else {
				// 向上滚动时
				blur = Math.min(5 * percent, 5)
				if (newVal < this.minTranslateY) {
					// 已经滚动到顶部
					zIndex = 10
					this.showBtnPlay = false
					this.bgImageStyle.paddingTop = 0
					this.bgImageStyle.height = `${RESERVED_HEIGHT}px`
				} else {
					// 未滚动到顶部
					this.showBtnPlay = true
					this.bgImageStyle.paddingTop = '70%'
					this.bgImageStyle.height = 0
				}
			}

			// 高斯模糊
			this.$refs.blur.style.webkitFilter = `blur(${blur}px)`
			this.$refs.blur.style.filter = `blur(${blur}px)`

			// 缩放以及调整zIndex关系
			this.bgImageStyle.zIndex = zIndex
			this.bgImageStyle.transform = `scale(${scale})`
			this.bgImageStyle.webkitTransform = `scale(${scale})`
		}
	},
	mounted() {
		this.imageHeight = this.$refs.bgImage.clientHeight
		this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
		this.$refs.scrollWrapper.$el.style.top = `${
			this.$refs.bgImage.clientHeight
		}px`
	}
}
</script>

<style lang="less">
@import '~assets/style/variable';
.music-list {
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: @color-background;
	width: 100%;
	height: 100%;
	.back {
		position: absolute;
		top: 0;
		left: 6px;
		z-index: 50;
		.icon-back {
			display: block;
			padding: 10px;
			font-size: @font-size-large-x;
			color: @color-theme;
		}
	}
	.title {
		position: absolute;
		top: 0;
		left: 10%;
		z-index: 40;
		width: 80%;
		text-align: center;
		line-height: 42px;
		font-size: @font-size-large;
		color: @color-text;
	}
	.bg-image {
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 70%;
		transform-origin: top;
		overflow: hidden;
		background: @color-background;
		z-index: 1;
		.play-wrapper {
			position: absolute;
			bottom: 20px;
			z-index: 50;
			width: 100%;
		}
		.play {
			box-sizing: border-box;
			width: 135px;
			padding: 7px 0;
			margin: 0 auto;
			text-align: center;
			border: 1px solid @color-theme;
			color: @color-theme;
			border-radius: 100px;
			font-size: 0;
			.icon-play {
				display: inline-block;
				vertical-align: middle;
				margin-right: 6px;
				font-size: @font-size-medium-x;
			}
			.text {
				display: inline-block;
				vertical-align: middle;
				font-size: @font-size-small;	
			}
		}
		.filter {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(7, 17, 27, 0.4);
			background-size: cover;
		}
	}
	.bg-layer {
		position: relative;
		height: 100%;
		background: @color-background;
	}
	.list {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		background: @color-background;
		.song-list-wrapper {
			padding: 20px 30px;
		}
		.loading-container {
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
}
</style>

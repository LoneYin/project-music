<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<ul class="dots">
			<span
				v-for="(item, index) in dots"
				:key="index"
				:class="currentIndex === index ? 'dot active' : 'dot'"
			></span>
		</ul>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'utils/dom'

export default {
	data() {
		return {
			dots: [],
			currentIndex: 0
		}
	},
	props: {
		loop: {
			type: Boolean,
			default: true
		},
		autoPlay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 3000
		}
	},
	mounted() {
		setTimeout(() => {
			this.setSliderWidth()
			this.initDots()
			this.initSlider()
		}, 20)

		this.autoPlay && this.play()

		window.addEventListener('resize', () => {
			if (!this.slider) return
			this.setSliderWidth(true)
			this.slider.refresh()
		})
	},
	methods: {
		initSlider() {
			this.slider = new BScroll(this.$refs.slider, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: {
					loop: this.loop,
					threshold: 0.3,
					speed: 400
				}
			})

			this.slider.on('scrollEnd', () => {
				let pageIndex = this.slider.getCurrentPage().pageX
				this.currentIndex = pageIndex
				this.autoPlay && this.play()
			})
		},
		initDots() {
			this.dots = new Array(this.children.length)
		},
		setSliderWidth(isResize) {
			this.children = this.$refs.sliderGroup.children

			let width = 0
			let sliderWidth = this.$refs.slider.clientWidth
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i]
				addClass(child, 'slider-item')
				child.style.width = sliderWidth + 'px'
				width += sliderWidth
			}

			if (this.loop && !isResize) {
				width += 2 * sliderWidth
			}

			this.$refs.sliderGroup.style.width = width + 'px'
		},
		play() {
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				this.slider.next()
			}, this.interval)
		}
	}
}
</script>
<style lang="less" scoped>
@import '~assets/style/variable.less';
.slider {
	width: 100%;
	overflow: hidden;
	margin-top: 10px;
	position: relative;
}
.slider-group {
	overflow: hidden;
}
.slider-item {
	float: left;
	a {
		display: block;
		width: 100%;
		overflow: hidden;
		text-decoration: none;
	}
	img {
		width: 100%;
	}
}
.dots {
	position: absolute;
	right: 0;
	left: 0;
	bottom: 12px;
	transform: translateZ(1px);
	text-align: center;
	font-size: 0;
	.dot {
		transition: width 0.3s ease;
		display: inline-block;
		margin: 0 4px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: @color-text-n;
		&.active {
			width: 20px;
			border-radius: 5px;
			background: @color-text-l;
		}
	}
}
</style>

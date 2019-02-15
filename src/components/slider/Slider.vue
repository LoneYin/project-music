<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<ul class="dots"></ul>
	</div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from '../../utils/dom'

export default {
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
			this.initSlider()
		}, 20)
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
				},
				click: true
			})
		},
		setSliderWidth() {
			this.children = this.$refs.sliderGroup.children

			let width = 0
			let sliderWidth = this.$refs.slider.clientWidth
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i]
				addClass(child, 'slider-item')
				child.style.width = sliderWidth + 'px'
				width += sliderWidth
			}

			if (this.loop) {
				width += 2 * sliderWidth
			}

			this.$refs.sliderGroup.style.width = width + 'px'
		}
	}
}
</script>
<style lang="less" scoped>
.slider {
	width: 100%;
	overflow: hidden;
	margin-top: 10px;
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
</style>

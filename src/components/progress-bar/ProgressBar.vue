<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div
				class="progress-btn-wrapper"
				ref="progressBtn"
				@touchstart.prevent="progressTouchStart"
				@touchmove.prevent="progressTouchMove"
				@touchend="progressTouchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { prefixStyle } from 'utils/prefix'
const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
	props: {
		percent: {
			type: Number,
			default: 0
		}
	},
	watch: {
		percent(newVal) {
			if (newVal >= 0 && !this.touch.status) {
				const barWidth =
					this.$refs.progressBar.clientWidth - progressBtnWidth
				const offsetWidth = newVal * barWidth
				this.offset(offsetWidth)
			}
		}
	},
	created() {
		this.touch = {}
	},
	methods: {
		progressTouchStart(e) {
			this.touch.status = true
			this.touch.startX = e.touches[0].pageX
			this.touch.left = this.$refs.progress.clientWidth
		},
		progressTouchMove(e) {
			if (!this.touch.status) {
				return
			}
			const deltaX = e.touches[0].pageX - this.touch.startX
			const offsetWidth = Math.min(
				this.$refs.progressBar.clientWidth - progressBtnWidth,
				Math.max(0, this.touch.left + deltaX)
			)
			this.offset(offsetWidth)
		},
		progressTouchEnd(e) {
			this.touch.status = false
			this.triggerPercent()
		},
		triggerPercent() {
			const barWidth =
				this.$refs.progressBar.clientWidth - progressBtnWidth
			const percent = this.$refs.progress.clientWidth / barWidth
			this.$emit('percentChange', percent)
		},
		offset(offsetWidth) {
			this.$refs.progress.style.width = `${offsetWidth}px`
			this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
		},
		progressClick(e) {
			const rect = this.$refs.progressBar.getBoundingClientRect()
			const offsetWidth = e.pageX - rect.left
			this.offset(offsetWidth)
			this.triggerPercent()
		}
	}
}
</script>

<style lang="less">
@import '~assets/style/variable.less';
.progress-bar {
	height: 30px;
	.bar-inner {
		position: relative;
		top: 13px;
		height: 4px;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.3);
		.progress {
			position: absolute;
			height: 100%;
			border-radius: 2px;
			background: @color-theme;
		}
		.progress-btn-wrapper {
			position: absolute;
			left: -8px;
			top: -13px;
			width: 30px;
			height: 30px;
			.progress-btn {
				position: relative;
				top: 7px;
				left: 7px;
				box-sizing: border-box;
				width: 16px;
				height: 16px;
				border: 3px solid @color-text;
				border-radius: 50%;
				background: @color-theme;
			}
		}
	}
}
</style>

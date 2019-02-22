<template>
	<div ref="scrollWrapper">
		<slot></slot>
	</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
	props: {
		probeType: {
			type: Number,
			default: 1
		},
		click: {
			type: Boolean,
			default: true
		},
		scrollEvent: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		setTimeout(() => {
			this.initScroll()
		}, 20)
	},
	methods: {
		initScroll() {
			const { probeType, click } = this
			if (!this.$refs.scrollWrapper) return
			this.scroll = new BScroll(this.$refs.scrollWrapper, {
				probeType,
				click
			})
			if (this.scrollEvent) {
				this.scroll.on('scroll', position => {
					this.$emit('onScroll', position)
				})
			}
		},
		enable() {
			this.scroll && this.scroll.enable()
		},
		disable() {
			this.scroll && this.scroll.disable()
		},
		refresh() {
			this.scroll && this.scroll.refresh()
		},
		scrollTo() {
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
		},
		scrollToElement() {
			this.scroll &&
				this.scroll.scrollToElement.apply(this.scroll, arguments)
		}
	}
}
</script>

<style>
</style>

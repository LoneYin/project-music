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
        },
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        }
	}
}
</script>

<style>
</style>

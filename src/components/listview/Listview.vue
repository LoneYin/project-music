<template>
	<Scroll
		class="listview"
		ref="scrollWrapper"
		:probeType="3"
		:scrollEvent="true"
		@onScroll="onScroll"
	>
		<ul>
			<li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
				<h2 class="list-group-title">{{ group.title }}</h2>
				<ul>
					<li
						@click="selectItem(item)"
						v-for="(item, index) in group.items"
						class="list-group-item needsClick"
						:key="index"
					>
						<img v-lazy="item.avatar" class="avatar" alt>
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div
			class="list-shortcut"
			@touchstart="onShortcutTouchStart"
			@touchmove.stop.prevent="onShortcutTouchMove"
		>
			<ul>
				<li
					v-for="(item, index) in shortcutList"
					class="item"
					:key="index"
					:data-index="index"
					:class="{'current': currentIndex == index}"
				>{{item}}</li>
			</ul>
		</div>
		<div class="list-fixed" v-show="fixedTitle" ref="fixed">
			<h2 class="fixed-title">{{fixedTitle}}</h2>
		</div>
		<div v-show="data.length <= 0" class="loading-container">
			<Loading></Loading>
		</div>
	</Scroll>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import Loading from 'components/loading/Loading'
import { getNodeData } from 'utils/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
const touch = {}
const listHeight = []
let lastFixedTop

export default {
	props: {
		data: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			scrollY: -1,
			currentIndex: 0,
			offset: -1
		}
	},
	components: {
		Scroll,
		Loading
	},
	computed: {
		shortcutList() {
			return this.data.map(group => group.title.substr(0, 1))
		},
		fixedTitle() {
			if (this.scrollY > 0) {
				return ''
			} else {
				return this.data[this.currentIndex]
					? this.data[this.currentIndex].title
					: ''
			}
		}
	},
	watch: {
		data() {
			this.$refs.scrollWrapper.refresh()
			setTimeout(() => {
				this.calculateHeight()
			}, 20)
		},
		scrollY(newVal) {
			// 下拉
			if (newVal > 0) {
				this.currentIndex = 0
				return
			}

			// 滚动
			for (let i = 0; i < listHeight.length - 1; i++) {
				let height1 = listHeight[i]
				let height2 = listHeight[i + 1]
				if (-newVal >= height1 && -newVal < height2) {
					this.currentIndex = i
					this.offset = height2 + newVal
					return
				}
			}

			// 触底
			this.currentIndex = listHeight.length - 2
		},
		offset(newVal) {
			let fixedTop =
				(newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
			if (lastFixedTop === fixedTop) {
				return
			}
			lastFixedTop = fixedTop
			this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
		}
	},
	methods: {
		onShortcutTouchStart(e) {
			let anchorIndex = getNodeData(e.target, 'index')
			touch.y1 = e.touches[0].pageY
			touch.anchorIndex = anchorIndex
			this.scrollTo(anchorIndex)
		},
		onShortcutTouchMove(e) {
			touch.y2 = e.touches[0].pageY
			let delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
			let anchorIndex = Number.parseInt(touch.anchorIndex) + delta
			this.scrollTo(anchorIndex)
		},
		scrollTo(index) {
			if (!index && index !== 0) {
				return
			}
			this.$refs.scrollWrapper.scrollToElement(
				this.$refs.listGroup[index],
				0
			)
		},
		calculateHeight() {
			const list = this.$refs.listGroup
			let height = 0
			listHeight.push(height)
			for (let i = 0; i < list.length; i++) {
				height += list[i].clientHeight
				listHeight.push(height)
			}
		},
		onScroll(position) {
			this.scrollY = position.y
		},
		selectItem(item) {
			this.$emit('select', item)
		}
	}
}
</script>

<style lang="less">
@import '~assets/style/variable.less';

.listview {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: @color-background;
	.list-group-title {
		text-align: left;
		text-indent: 20px;
		background: @color-highlight-background;
		font-size: @font-size-small;
		line-height: 30px;
		font-weight: normal;
	}
	.list-group-item {
		display: flex;
		align-items: center;
		padding-top: 20px;
		padding-left: 30px;
		.avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
		}
		.name {
			margin-left: 20px;
			color: @color-text-l;
			font-size: @font-size-medium;
		}
		&:last-child {
			padding-bottom: 20px;
		}
	}
	.list-shortcut {
		position: absolute;
		z-index: 30;
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		padding: 20px 0;
		border-radius: 10px;
		text-align: center;
		background: @color-background-d;
		font-family: Arial, Helvetica, sans-serif;
		.item {
			padding: 3px;
			line-height: 1;
			color: @color-text-l;
			font-size: @font-size-small;
			&.current {
				color: @color-theme;
			}
		}
	}
	.list-fixed {
		position: absolute;
		top: -1px;
		left: 0;
		width: 100%;
		.fixed-title {
			text-align: left;
			text-indent: 20px;
			background: @color-highlight-background;
			font-size: @font-size-small;
			line-height: 30px;
			font-weight: normal;
		}
	}
}
</style>

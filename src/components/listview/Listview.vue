<template>
	<Scroll class="listview" ref="scrollWrapper">
		<ul>
			<li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
				<h2 class="list-group-title">{{ group.title }}</h2>
				<ul>
					<li v-for="(item, index) in group.items" class="list-group-item" :key="index">
						<img v-lazy="item.avatar" class="avatar" alt>
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onShortcutTouchStart">
			<ul>
				<li v-for="(item, index) in shortcutList" class="item" :key="index" :data-index="index">
					{{item}}
				</li>
			</ul>
		</div>
	</Scroll>
</template>

<script>
import Scroll from 'components/scroll/Scroll'
import { getNodeData } from 'utils/dom'

export default {
	props: {
		data: {
			type: Array,
			default: () => []
		}
	},
	components: {
		Scroll
	},
	computed: {
		shortcutList() {
			return this.data.map((group) => group.title.substr(0, 1))
		}
	},
	watch: {
		data() {
			this.$refs.scrollWrapper.refresh()
		}
	},
	methods: {
		onShortcutTouchStart(e) {
			let anchorIndex = getNodeData(e.target, 'index')
			this.$refs.scrollWrapper.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
			console.log(anchorIndex)
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
		top: 0;
		left: 0;
		width: 100%;
		.fixed-title {
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			font-size: @font-size-small;
			color: @color-text-l;
			background: @color-highlight-background;
		}
	}
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>

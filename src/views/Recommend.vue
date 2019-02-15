<template>
	<div class="recommend">
		<div class="recommend-content">
			<div class="slider-wrapper"></div>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
				<ul class="list-body"></ul>
			</div>
		</div>
	</div>
</template>

<script>
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'

export default {
	data() {
		// recommendData: []
		return {}
	},
	created() {
		this._getRecommend()
	},
	methods: {
		_getRecommend() {
			getRecommend().then(res => {
				if (res.code === ERR_OK) {
					console.log(res.data)
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
.list-title {
	font-size: 16px;
}
</style>

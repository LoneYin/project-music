<template>
	<div class="recommend">
		<div class="recommend-content">
			<div class="slider-wrapper" v-if="recommendData.length > 0">
				<div class="slider-content">
					<Slider>
						<div v-for="item in recommendData" :key="item.id">
							<a :href="item.linkUrl">
								<img :src="item.picUrl" alt>
							</a>
						</div>
					</Slider>
				</div>
			</div>
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
import Slider from 'components/slider/Slider'

export default {
	data() {
		return {
			recommendData: []
		}
	},
	components: {
		Slider
	},
	created() {
		this.getRecommendAction()
	},
	methods: {
		getRecommendAction() {
			getRecommend().then(res => {
				if (res.code === ERR_OK) {
					console.log(res.data)
					this.recommendData = res.data.slider
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
.list-title {
	margin-top: 20px;
}
</style>

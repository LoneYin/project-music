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
				<ul class="list-body">
					<li v-for="item in songsheetsData" :key="item.dissid" class="item">
						<div class="icon">
							<img width="60" height="60" :src="item.imgurl">
						</div>
						<div class="text">
							<p class="name" v-html="item.creator.name"></p>
							<p class="desc" v-html="item.dissname"></p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { getRecommend, getSongsheets } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'components/slider/Slider'

export default {
	data() {
		return {
			recommendData: [],
			songsheetsData: []
		}
	},
	components: {
		Slider
	},
	created() {
		this.getRecommendAction()
		this.getSongsheetsAction()
	},
	methods: {
		getRecommendAction() {
			getRecommend().then(res => {
				if (res.code === ERR_OK) {
					console.log(res.data)
					this.recommendData = res.data.slider
				}
			})
		},
		getSongsheetsAction() {
			getSongsheets().then(res => {
				if (res.code === ERR_OK) {
					console.log(res.data.list)
					this.songsheetsData = res.data.list
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
@import '~assets/style/variable.less';

.recommend {
	position: fixed;
	width: 100%;
	top: 104px;
	bottom: 0;
	.recommend-content {
		height: 100%;
		overflow: hidden;
		background: @color-background;
	}
	.slider-wrapper {
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 40%;
		overflow: hidden;
	}
	.slider-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
}

.recommend-list {
	.list-title {
		height: 65px;
		line-height: 65px;
		text-align: center;
		font-size: @font-size-medium-x;
	}
	.item {
		display: flex;
		box-sizing: border-box;
		text-align: left;
		align-items: center;
		padding: 0 20px 20px 20px;
		.icon {
			flex:  0 0 60px;
			width: 60px;
			height: 60px;
			padding-right: 20px;
		}
		.text {
			height: 60px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			font-size: @font-size-medium;
		}
		.name {
			margin-bottom: 10px;
			color:  @color-text-l;
			line-height: 1
		}
		.desc {
			color: @color-text-d;
		}
	}
}
</style>

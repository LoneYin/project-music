<template>
	<div class="singer">singer</div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'

const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10
const singerItem = (id, name) => {
	return {
		id,
		name,
		avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
	}
}

export default {
	data() {
		return {
			singerList: []
		}
	},
	created() {
		this.getSingerListAction()
	},
	methods: {
		getSingerListAction() {
			getSingerList().then(res => {
				if (res.code === ERR_OK) {
					console.log(this.formatSingerList(res.data.list))
				}
			})
		},
		formatSingerList(data) {
			const map = {
				hot: {
					title: HOT_NAME,
					items: []
				}
			}
			data.forEach((item, index) => {
				if (index < HOT_SINGER_LENGTH) {
					map.hot.items.push(
						singerItem(item.Fsinger_mid, item.Fsinger_name)
					)
				}
				const findKey = item.Findex
				if (!map[findKey]) {
					map[findKey] = {
						title: findKey,
						items: []
					}
				}
				map[findKey].items.push(
					singerItem(item.Fsinger_mid, item.Fsinger_name)
				)
			})
			return map
		}
	}
}
</script>

<style lang="less">
.singer {
	position: fixed;
	top: 88px;
	bottom: 0;
	width: 100%;
}
</style>

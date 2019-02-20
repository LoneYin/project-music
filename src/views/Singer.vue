<template>
	<div class="singer">
		<Listview :data="singerList"></Listview>
	</div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Listview from 'components/listview/Listview'

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
	components: {
		Listview
	},
	created() {
		this.getSingerListAction()
	},
	methods: {
		getSingerListAction() {
			getSingerList().then(res => {
				if (res.code === ERR_OK) {
					this.singerList = this.formatSingerList(res.data.list)
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

			const hot = []
			const rest = []
			for (let key in map) {
				const val = map[key]
				if (val.title.match(/[a-zA-Z]/)) {
					rest.push(val)
				} else if (val.title === HOT_NAME) {
					hot.push(val)
				}
			}
			rest.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))

			return hot.concat(rest)
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

<template>
	<transition name="slide">
		<template v-if="singer">
			<MusicList :songs="songs" :title="singer.name || ''" :bg-image="singer.avatar || ''"></MusicList>
		</template>
	</transition>
</template>

<script>
import { mapState } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'utils/song'
import MusicList from 'components/music-list/MusicList'
export default {
	data() {
		return {
			songs: []
		}
	},
	components: {
		MusicList
	},
	computed: {
		...mapState({
			singer: state => state.singer.currentSinger
		})
	},
	methods: {
		getSingerDetailAction() {
			getSingerDetail(this.singer.id).then(res => {
				if (res.code === ERR_OK) {
					this.songs = this.formatingSongs(res.data.list)
					console.log(this.songs)
				}
			})
		},
		formatingSongs(list) {
			const result = []
			list.forEach(item => {
				const { musicData } = item
				if (musicData.songid && musicData.albummid) {
					result.push(createSong(musicData))
				}
			})
			return result
		}
	},
	created() {
		if (!this.singer || !this.singer.id) {
			this.$router.push('/singer')
			return
		}
		this.getSingerDetailAction()
	}
}
</script>

<style lang="less">
@import '~assets/style/variable.less';
.singer-detail {
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: @color-background;
	width: 100%;
	height: 100%;
}
.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
	transform: translate3d(100%, 0, 0);
}
</style>

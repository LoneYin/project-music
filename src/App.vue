<template>
	<div id="app">
		<CommonHeader></CommonHeader>
		<CommonNavigator></CommonNavigator>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
import CommonHeader from 'components/common/CommonHeader.vue'
import CommonNavigator from 'components/common/CommonNavigator.vue'
export default {
	components: {
		CommonHeader,
		CommonNavigator
	}
}
</script>

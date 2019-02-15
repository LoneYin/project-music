<template>
	<div id="app">
		<CommonHeader></CommonHeader>
		<CommonNavigator></CommonNavigator>
		<router-view></router-view>
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

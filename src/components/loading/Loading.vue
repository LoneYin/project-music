<template>
    <div class="loading">
        <img width="24" height="24" src="./loading.gif" alt="">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '加载中...'
        }
    }
}
</script>

<style lang="less">
@import '~assets/style/variable.less';
.loading {
    width: 100%;
    min-height: 100px;
    padding-top: 50px;
    text-align: center;
    .desc {
        line-height: 20px;
        font-size: @font-size-medium;
        color: @color-text-l;
    }
}
</style>

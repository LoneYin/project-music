<template>
    <div class="navigator">
        <router-link tag="div" class="nav-item" to="/recommend">
            <span class="nav-link">推荐</span>
        </router-link>
        <router-link tag="div" class="nav-item" to="/singer">
            <span class="nav-link">歌手</span>
        </router-link>
        <router-link tag="div" class="nav-item" to="/rank">
            <span class="nav-link">排行</span>
        </router-link>
        <router-link tag="div" class="nav-item" to="/search">
            <span class="nav-link">搜索</span>
        </router-link>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
@import '~assets/style/variable.less';
.navigator {
    display: flex;
    justify-content: space-around;
    .nav-item {
        width: 25%;
        text-align: center;
    }
    .router-link-active {
        .nav-link {
            color: #48cbff;
            display: inline-block;
            padding-bottom: 5px;
            border-bottom: 2px solid #48cbff;
        }
    }
    .nav-link {
        color: @color-text-n;
    }
}
</style>

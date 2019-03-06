<template>
    <div class="song-list">
        <ul>
            <li v-for="(song, index) in songs" class="item" :key="song.id" @click="selectItem(song, index)">
                <div class="content">
                    <h2 :class="song.url ? 'name ellipsis' : 'no-source name ellipsis'">
                        {{song.name}}
                    </h2>
                    <p class="desc ellipsis">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        songs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer} - ${song.album}`
        },
        selectItem(song, index) {
            if (song.url) {
                this.$emit('select', song, index)
            } else {
                console.log('没有资源')
            } 
        }
    }
}
</script>

<style lang="less">
@import '~assets/style/variable.less';

.song-list {
    .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: @font-size-medium;
        .rank {
            flex: 0 0 25px;
            width: 25px;
            margin-right: 30px;
            text-align: center;
        }
        .icon {
            display: inline-block;
            width: 25px;
            height: 24px;
            background-size: 25px 24px;
            &.icon0 {
                background-image: url("./first@2x.png");
                @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
                    background-image: url("./first@3x.png")
                }
            }
            &.icon0 {
                background-image: url("./second@2x.png");
                @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
                    background-image: url("./second@3x.png")
                }
            }
            &.icon0 {
                background-image: url("./third@2x.png");
                @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
                    background-image: url("./third@3x.png")
                }
            }
        }
        .text {
            color: @color-theme;
            font-size: @font-size-large;
        }
    }
    .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
            color: @color-text;
            font-size: @font-size-medium-x;
            &.no-source {
                color: @color-text-d;
            }
        }
        .desc {
            margin-top: 4px;
            color: @color-text-d;
        }
    }
}
</style>

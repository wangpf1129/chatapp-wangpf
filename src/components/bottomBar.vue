<template>
	<view class="bottom-bar">
		<view class="bottom-btn">
			<slot name="text"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};

		}
	}
</script>

<style lang="scss" scoped>
	.bottom-bar {
		position: fixed;
		bottom: 20rpx;
		width: 100%;
		height: 104rpx;

		.bottom-btn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			width: 684rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: $uni-text-color;
			background: $uni-color-primary;
			border-radius: $uni-border-radius-sm;
		}
	}
</style>

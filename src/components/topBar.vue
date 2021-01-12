<template>
	<view class="top-bar">
		<view class="top-bar-left">
			<slot name="left"></slot>
		</view>
		<view class="top-bar-mid">
			<slot name="mid"></slot>
		</view>
		<view class="top-bar-right">
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'topBar',
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		text-align: center;
		align-items: center; // 垂直居中
		z-index: 1001;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		// background-color: $uni-bg-color;
		// border: 1px solid red;

		.top-bar-left {
			flex: 17%;
		}

		.top-bar-mid {
			flex: 63%;
		}

		.top-bar-right {
			flex: 20%;

		}
	}
</style>

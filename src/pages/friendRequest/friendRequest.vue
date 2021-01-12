<template>
	<view id="frinedRequest">
		<view class="content">
			<top-bar>
				<view slot="left" class="left" @tap="backOne">
					<image src="~@/static/images/common/back.png" mode=""></image>
				</view>
				<view slot="mid">好友请求</view>
			</top-bar>
			<view class="main">
				<view class="request" v-for="(item,index) in requestData" :key='index'>
					<view class="request-top">
						<view class="reject btn">拒绝</view>
						<view class="header-img">
							<image :src="item.imgUrl"></image>
						</view>
						<view class="aggree btn">同意</view>
					</view>
					<view class="request-center">
						<view class="title">{{item.name}}</view>
						<view class="time">{{showTime(item.time)}}</view>
					</view>
					<view class="notic">
						<text>留言：</text>
						{{item.news}}
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'

	import datas from "@/common/datas";
	import myfun from "@/common/myfun";

	export default {
		components: {
			topBar
		},
		data() {
			return {
				requestData: {},
			}
		},
		onLoad() {
		  this.getRequestData();
		},
		methods: {
			// 返回上一级页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			getRequestData: function () {
			  this.requestData = datas.users();
			  for (let i = 0; i < this.requestData.length; i++) {
			    this.requestData[i].imgUrl =
			      "../../static/images/test/" + this.requestData[i].imgUrl;
			  }
			  console.log(this.requestData);
			},
			showTime: function (date) {
			  return myfun.dateTime(date);
			},
		}
	}
</script>

<style lang="scss" scoped>
	#frinedRequest {
		.content {
			.top-bar {
				background: rgba(255, 255, 255, 0.96);
				border-bottom: 1px solid $uni-border-color;

				.left {
					width: 48rpx;
					height: 48rpx;
					padding: 15rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.right {
					height: 48rpx;

					.close {
						padding-left: 80rpx;
						width: 48rpx;
						height: 48rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.main {
				padding: 108rpx $uni-spacing-col-base;

				.request {
					margin-top: 132rpx;
					padding: $uni-spacing-col-base;
					background-color: rgba(255, 255, 255, 1);
					box-shadow: 0rpx 24rpx 64rpx -8rpx rgba(0, 0, 0, .1);
					border-radius: $uni-border-radius-base;

					.request-top {
						display: flex;
						flex-direction: row;
						align-items: flex-end;

						.btn {
							flex: none;
							text-align: center;
							width: 160rpx;
							height: 64rpx;
							background-color: rgba(255, 93, 91, .1);
							border-radius: 40rpx;
							font-size: $uni-font-size-lg;
							line-height: 64rpx;
						}

						.reject {
							color: $uni-color-warning;
							background-color: rgba(255, 93, 91, .1);
						}

						.aggree {
							color: $uni-text-color;
							background-color: $uni-color-primary;
						}

						.header-img {
							margin-top: -104rpx;
							flex: auto;
							text-align: center;

							image {
								width: 144rpx;
								height: 144rpx;
								border-radius: 50%;
								background-color: $uni-bg-color-grey;
							}
						}
					}

					.request-center {
						text-align: center;
						padding-top: 20rpx;
						padding-bottom: 40rpx;

						.title {
							font-size: 36rpx;
							font-weight: 600;
							color: $uni-text-color;
							line-height: 50rpx;
						}

						.time {
							font-size: $uni-font-size-sm;
							color: $uni-text-color-disable;
							line-height: 34rpx;
						}
					}

					.notic {
						padding: $uni-spacing-row-sm $uni-spacing-col-base;
						border-radius: $uni-border-radius-base;
						background-color: $uni-bg-color-grey;
						font-size: $uni-font-size-base;
						color: $uni-text-color;
						line-height: 40rpx;
					}
				}
			}
		}

	}
</style>

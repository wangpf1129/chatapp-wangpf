<template>
	<view class="content">
		<top-bar class="top-bar">
			<navigator :url="`../userProfile/userProfile?id=${uID}`" slot="left" class="left">
				<image :src="imgUrl"></image>
			</navigator>
			<view slot="mid" class="mid">
					<image src="~@/static/images/index/火@2x.png"></image>
			</view>
			<view slot="right" class="right">
				<view class="search" @tap="toSearch">
					<image src="~@/static/images/index/search@2x.png"></image>
				</view>
				<view class="add">
					<image src="~@/static/images/index/add group@2x.png"></image>
				</view>
			</view>
		</top-bar>
		<view class="main">
			<view class="friends">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tips">12</text>
						<image src="~@/static/images/index/apply.svg"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">15:10</view>
						</view>
						<view class="news">沧海茫茫，相聚便是缘。</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="item in friendsData" :key="item.id">
					<view class="friends-list-l">
						<text class="tips" v-if="item.tips>0">{{ item.tips }}</text>
						<image :src="item.imgUrl"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ showTime(item.time) }}</view>
						</view>
						<view class="news">{{ item.news }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import topBar from "@/components/topBar.vue"

	import datas from "@/common/datas";
	import myfun from "@/common/myfun";

	export default {
		data() {
			return {
				friendsData: {},
				uID: '',
				imgUrl: '',
				token: ''
			};
		},
		components: {
			topBar,
		},
		onLoad() {
			this.getFriends();
			this.getStorages()
		},
		computed:{
	
		},
		methods: {
			// 获取缓存信息
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						// console.log(value);
						this.uID = value.id
						this.imgUrl = this.serverUrl + '/user/' + value.imgUrl
						this.token = value.token
					}else{
						// 如果没有用户缓存，则跳转到登陆页面
						uni.navigateTo({
							url:'../login/login'
						})
					}
				} catch (e) {
					// error
				}
			},
			getFriends: function() {
				this.friendsData = datas.users();
				for (let i = 0; i < this.friendsData.length; i++) {
					this.friendsData[i].imgUrl =
						"../../static/images/test/" + this.friendsData[i].imgUrl;
				}
				// console.log(this.friendsData);
			},
			showTime: function(date) {
				return myfun.dateTime(date);
			},
			// 去搜索页面
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			// 去用户信息页面
			toUserProfile: function() {
				uni.navigateTo({
					url: '../userProfile/userProfile'
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.top-bar {
			border-bottom: 1px solid $uni-border-color;

			.left {
				padding-top: 10rpx;

				image {
					width: 68rpx;
					height: 68rpx;
					border-radius: 16rpx;
				}
			}

			.mid {

				image {
					width: 88rpx;
					height: 42rpx;
				}
			}

			.right {
				display: flex;
				align-items: center; // 垂直居中

				.search {
					// border: 1px solid red;
					flex: 1;

					image {
						width: 52rpx;
						height: 52rpx;
					}
				}

				.add {
					// border: 1px solid red;
					flex: 1;

					image {
						width: 48rpx;
						height: 48rpx;
					}
				}

			}
		}

		.main {
			padding: 104rpx $uni-spacing-row-sm 0;
		}

		.friends-list {
			display: flex;
			align-items: center;
			height: 96rpx;
			padding: 16rpx 0;

			// border: 1px solid red;
			&:active {
				background-color: $uni-bg-color-grey;
			}

			.friends-list-l {
				// flex: 1;   // 部给 左边设置 flex 让它自动铺满
				position: relative;

				.tips {
					position: absolute;
					z-index: 10;
					top: -6rpx;
					left: 68rpx;
					min-width: 24rpx;
					padding: 0 6rpx;
					height: 36rpx;
					line-height: 36rpx;
					text-align: center;
					color: $uni-text-color-inverse;
					font-size: $uni-font-size-sm;
					background-color: $uni-color-error;
					border-radius: 18rpx;
				}

				image {
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
					background-color: $uni-color-primary;
				}
			}

			.friends-list-r {
				flex: 1;
				padding-left: $uni-spacing-col-base;

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.name {
						flex: 1;
						font-size: 36rpx;
						font-weight: 400;
						color: $uni-text-color;
						line-height: 50rpx;
					}

					.time {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						line-height: 34rpx;
					}
				}

				.news {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					font-size: $uni-font-size-base;
					color: $uni-text-color-grey;
					// padding-top: 10rpx;
					line-height: 40rpx;
				}
			}
		}
	}
</style>

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
						<view class="reject btn" @tap='refuseFriends(item.id)'>拒绝</view>
						<view class="header-img">
							<image :src="item.imgUrl"></image>
						</view>
						<view class="aggree btn" @tap='agreeFriend(item.id)'>同意</view>
					</view>
					<view class="request-center">
						<view class="title">{{item.name}}</view>
						<view class="time">{{showTime(item.lastTime)}}</view>
					</view>
					<view class="notic">
						<text>留言：</text>
						{{item.message}}
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'

	import myfun from "@/common/myfun";

	export default {
		components: {
			topBar
		},
		data() {
			return {
				requestData: {},
				uID:'',
				token:'',
				myName:'',
				
			}
		},
		onLoad() {
		  this.getStorages()
		  this.firendApply()
		},
		methods: {
			// 获取缓存信息
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						// console.log(value);
						this.uID = value.id
						this.token = value.token
						this.myName = value.name
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
			// 返回上一级页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			showTime: function (date) {
			  return myfun.dateTime(date);
			},
			// 好友申请
			firendApply:function(){
				uni.request({
					url: this.serverUrl + "/index/getFriendList",
					data: {
						uID: this.uID,
						state:1,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let result = data.data.result
							for(let i =0;i<result.length;i++){
								result[i].imgUrl  = this.serverUrl + '/user/' + result[i].imgUrl
								this.friendLeaveMessage(result,i)
							}
							this.requestData = result
							console.log(this.requestData )
						} else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						}else if(status === 300){
								// token 过期了 需要重新登录再次生成token
								uni.navigateTo({
									url: '../login/login?name=' + this.myName
								});
							}
					}
				})
			},
			// 获取好友请求内容
			friendLeaveMessage:function(arr,i){
				uni.request({
					url: this.serverUrl + "/index/getLastMessage",
					data: {
						uID: this.uID,
						fID:arr[i].id,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let result = data.data.result
							let friendInfo = arr[i]
							friendInfo.message = result.message
							arr.splice(i,1,friendInfo)
						} else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						}else if(status === 300){
								// token 过期了 需要重新登录再次生成token
								uni.navigateTo({
									url: '../login/login?name=' + this.myName
								});
							}
					}
				})
			},
			requestState:function(fID,url){
				uni.request({
					url: this.serverUrl + url,
					data: {
						uID: this.uID,
						fID:fID,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						console.log(data.data)
						// 访问后端成功
						if (status === 200) {
							let result = data.data.result
							for(let i =0;i<this.requestData.length;i++){
								this.requestData.splice(i,1)
							}
						} else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						}else if(status === 300){
								// token 过期了 需要重新登录再次生成token
								uni.navigateTo({
									url: '../login/login?name=' + this.myName
								});
							}
					}
				})
			},
			//  拒绝好友
			refuseFriends:function(fID){
				this.requestState(fID,"/friend/deleteFriend")
				uni.showToast({
					title: '已拒绝该好友！',
					icon: 'none',
					duration: 1500
				})
			},
			agreeFriend:function(fID){
				this.requestState(fID,"/friend/updateFriendState")
				uni.showToast({
					title: '已同意该好友！',
					icon: 'none',
					duration: 1500
				})
			}
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
							padding-top: 20rpx;
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

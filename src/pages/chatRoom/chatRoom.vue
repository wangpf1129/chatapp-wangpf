<template>
		<view class="content">
			<top-bar class="top-bar">
				<view slot="left" class="left" @tap="backOne">
					<image src="~@/static/images/common/back.png" mode=""></image>
				</view>
				<view slot="mid" >再努力点</view>
				<view slot="right" class="right" @click="toUserDeatils">
					<view class="close">
						<image src="../../static/images/test/six.jpeg" mode=""></image>
					</view>
				</view>
			</top-bar>
			<view>
				<scroll-view class="chat" scroll-y="true" scroll-with-animation="true">
					<view class="chat-main">
						<view class="chat-ls">
							<view class="chat-time">22:27</view>
							<view class="msg-m  msg-left">
								<image src="../../static/images/test/four.jpeg" class="user-img"></image>
								<view class="message">
									<view class="msg-text">你好啊。我叫电脑赛娜</view>
								</view>
							</view>
						</view>
						<view class="chat-ls">
							<view class="chat-time">22:27</view>
							<view class="msg-m  msg-right">
								<image src="../../static/images/test/six.jpeg" class="user-img"></image>
								<view class="message">
									<view class="msg-text">啊哈哈哈哈哈哈是的呢！</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'
	
	export default {
		components:{
			topBar,
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	page{
		height: 100%;
	};
	.content{
		height: 100%;
		background: rgba(244, 244, 244, 1);
		
		
		.top-bar {
			background: rgba(244, 244, 244, 0.96);
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
		            padding-left: 40rpx;
		            width: 68rpx;
		            height: 68rpx;
		
		            image {
		                width: 100%;
		                height: 100%;
						border-radius: 16rpx;
						margin-top: -12rpx;
		            }
		        }
		    }
		}
		
		.chat{
			height: 100%;	
			
			.chat-main{
				padding-left: $uni-spacing-col-base;
				padding-right: $uni-spacing-col-base;
				padding-top: 100rpx;
				padding-bottom: 120rpx;
				display: flex;
				flex-direction: column;
			}
			
			.chat-ls{
				.chat-time{
					font-size: $uni-font-size-sm;
					color: rgab(39,40,50,.3);
					line-height: 34rpx;
					padding: 20rpx 0;
					text-align: center;
				}
				
				.msg-m{
					display: flex;
					padding: 20rpx 0;
					
					.user-img{
						flex: none;
						width: $uni-img-size-sm;
						height: $uni-img-size-sm;
						border-radius: $uni-border-radius-base;
					}
					
					.message{
						max-width: 480rpx;
						
						.msg-text{
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx;
							border-radius: 20rpx;
						}
					}
				}
				
				.msg-left{
					flex-direction: row;
					
					.msg-text{
						margin-left: 16rpx;
						background-color: #e4e4e4;
					}
				}
				
				.msg-right{
					flex-direction: row-reverse;
					
					.msg-text{
						text-align: center;
						margin-right: 16rpx;
						background-color: #9eea6a;
					}
				}
			}
		}
	}
	
	

</style>

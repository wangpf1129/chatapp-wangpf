<template>
	<view class="content">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/common/back.png" mode=""></image>
			</view>
			<view slot="mid">再努力点</view>
			<view slot="right" class="right" @click="toUserDeatils">
				<view class="close">
					<image src="../../static/images/test/two.jpeg" mode=""></image>
				</view>
			</view>
		</top-bar>
		<view>
			<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="srcollToView">
				<view class="chat-main" :style="{paddingBottom:inputHeight+'px'}">
					<view class="chat-ls" v-for="(item,index) in messages" :key='index' :id="'message'+item.tip">
						<view class="chat-time" v-if="item.time !== '' ">{{changeTime(item.time)}}</view>
						<view class="msg-m  msg-left" v-if="item.id == 'a' ">
							<image :src="item.imgUrl" class="user-img"></image>
							<view class="message" v-if="item.types === 0">
								<view class="msg-text">{{item.message}}</view>
							</view>
							<view class="message" v-if="item.types === 1">
								<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImage(item.message)"></image>
							</view>
						</view>
						<view class="msg-m  msg-right" v-if="item.id == 'b' ">
							<image :src="item.imgUrl" class="user-img"></image>
							<view class="message" v-if="item.types === 0">
								<view class="msg-text">{{item.message}}</view>
							</view>
							<view class="message" v-if="item.types === 1">
								<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImage(item.message)"></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<chat-input-box @getInputContent="getInputContent" @getBoxHeight="getBoxHeight"></chat-input-box>
		<view class="box"></view>
	</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'
	import chatInputBox from '../../components/chatInputBox/chatInputBox.vue'

	import datas from '../../common/datas.js'
	import myfun from '../../common/myfun.js'

	export default {
		components: {
			topBar,
			chatInputBox
		},
		data() {
			return {
				messages: [], // 发送的所有消息 （头像，时间，消息内容及类型等）
				imageMessage: [], // 图片类型的消息
				oldTime: new Date(), // 进入聊天室的时间
				srcollToView: '', // 定位聊天位置
				inputHeight: '60', // 输入高度 动态获取
			}
		},
		onLoad: function() {
			this.getMessage()
		},
		methods: {
			// 返回首页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 处理时间
			changeTime: function(date) {
				return myfun.chatTime(date)
			},
			// 聊天数据
			getMessage: function() {
				let msg = datas.message()
				// 处理头像链接
				let i // 在这里定义 i,是为了下边获取定位聊天位置的
				for (i = 0; i < msg.length; i++) {
					// 处理头像地址
					msg[i].imgUrl = '../../static/images/test/' + msg[i].imgUrl
					// 处理时间间隔
					if (i < msg.length - 1) {
						let interval = myfun.spaceTime(this.oldTime, msg[i].time)
						if (interval) {
							this.oldTime = interval
						}
						msg[i].time = interval
					}
					// 处理图片地址
					if (msg[i].types === 1) {
						msg[i].message = '../../static/images/test/' + msg[i].message
						this.imageMessage.unshift(msg[i].message)
					}
					this.messages.unshift(msg[i])
				}
				this.$nextTick(function() {
					this.srcollToView = 'message' + this.messages[i - 1].tip
				})
				console.log(this.messages)
			},
			previewImage: function(e) {
				// 预览图片时  定位
				let index = 0
				for (let i = 0; i < this.imageMessage.length; i++) {
					if (this.imageMessage[i] === e) {
						index = i
					}
				}
				// 预览图片
				uni.previewImage({
					current: index,
					urls: this.imageMessage,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 获取输入的内容
			getInputContent: function(e) {
				let length = this.messages.length
				let data = {
				id: 'b', //用户id
				imgUrl: '../../static/images/test/two.jpeg',
				message: e,
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date(), // 发送时间
				tip: length

				}
				this.messages.push(data)
				this.$nextTick(function() {
					this.srcollToView = 'message' + length
				})
			},
			// 获取输入框高度
			getBoxHeight: function(e) {
				this.inputHeight = e
				// 获取高度的同时去滚动页面到底部
				this.toBottom()
			},
			// 滚到到底部
			toBottom: function() {
				// 先清空 再执行
				this.srcollToView = ''
				this.$nextTick(function() {
					let length = this.messages.length -1 
					this.srcollToView = 'message' + this.messages[length].tip
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	;

	.content {
		height: 100vh;
		background: rgba(244, 244, 244, 1);

		.box {
			width: 100%;
			height: var(--status-bar-height);
		}

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

		.chat {
			height: 100vh;

			.chat-main {
				padding-left: $uni-spacing-col-base;
				padding-right: $uni-spacing-col-base;
				padding-top: 100rpx;
				display: flex;
				flex-direction: column;
			}

			.chat-ls {
				.chat-time {
					font-size: $uni-font-size-sm;
					color: rgab(39, 40, 50, .3);
					line-height: 34rpx;
					padding: 20rpx 0;
					text-align: center;
				}

				.msg-m {
					display: flex;
					padding: 20rpx 0;

					.user-img {
						flex: none;
						width: $uni-img-size-sm;
						height: $uni-img-size-sm;
						border-radius: $uni-border-radius-base;
					}

					.message {
						max-width: 480rpx;

						.msg-text {
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx;
							border-radius: 20rpx;
						}
					}

					.msg-img {
						max-width: 400rpx;
						border-radius: $uni-border-radius-base;
					}
				}

				.msg-left {
					flex-direction: row;

					.msg-text {
						margin-left: 16rpx;
						background-color: #e4e4e4;
					}

					.msg-img {
						margin-left: 16rpx;
					}
				}

				.msg-right {
					flex-direction: row-reverse;

					.msg-text {
						text-align: center;
						margin-right: 16rpx;
						background-color: #9eea6a;
					}

					.msg-img {
						margin-right: 16rpx;
					}
				}
			}
		}
	}
</style>

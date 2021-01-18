<template>
	<view class="content">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/common/back.png" mode=""></image>
			</view>
			<view slot="mid">{{fName}}</view>
	   <!-- <view slot="right" class="right" v-if="type == 0">
				<navigator :url="`../userProfile/userProfile?id=${fID}`">
				<view class="close">
					<image :src="fImgUrl" mode=""></image>
				</view>
				</navigator>
			</view> -->
			<view slot="right" class="right" v-if="type == 0">
				<navigator :url="`../groupHome/groupHome?gID=${fID}&gImgUrl=${fImgUrl}`">
				<view class="close">
					<image :src="fImgUrl" mode=""></image>
				</view>
				</navigator>
			</view>
		</top-bar>
		<view>
			<scroll-view class="chat" scroll-y="true" :scroll-with-animation="isScroll" :scroll-into-view="srcollToView"
			 @scrolltoupper="loadingNextPage">
				<view class="chat-main" :style="{paddingBottom:inputHeight+'px'}">
					<view class="loading" :class="{displaynone:isLoading}">
						<image src="../../static/images/common/loading.png" class="loading-img" :animation="animationData"></image>
					</view>
					<view class="chat-ls" v-for="(item,index) in messages" :key='index' :id="'message'+item.id">
						<view class="chat-time" v-if="item.sendTime != '' ">{{changeTime(item.sendTime)}}</view>
						<view class="msg-m  msg-left" v-if="item.fromID != uID ">
							<image :src="item.imgUrl" class="user-img"></image>
							<!-- 文字 -->
							<view class="message" v-if="item.messageTypes == 0">
								<view class="msg-text">{{item.message}}</view>
							</view>
							<!-- 图片 -->
							<view class="message" v-if="item.messageTypes == 1">
								<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImage(item.message)"></image>
							</view>
							<!-- 音频 -->
							<view class="message" v-if="item.messageTypes == 2">
								<view class="msg-text voice" :style="{width:item.message.time*4 + 'px'}" @tap="playVoice(item.message)">
									<image src="../../static/images/chatRoom/voice.png" class="voice-img"></image>
									{{item.message.time}}″
								</view>
							</view>
							<!-- 位置 -->
							<view class="message" v-if="item.messageTypes == 3">
								<view class="msg-map" @tap="openLocation(item.message)">
									<view class="map-name">{{item.message.name}}</view>
									<view class="map-address">{{item.message.address}}</view>
									<image src="../../static/images/chatRoom/dt.jpg" mode="aspectFill" class="map-img"></image>
									<!-- <map class="map" 
									:longitude="item.message.longitude" 
									:latitude="item.message.latitude"
									:markers="covers(item.message)"></map> -->
								</view>
							</view>
						</view>
						<view class="msg-m  msg-right" v-if="item.fromID == uID ">
							<image :src="item.imgUrl" class="user-img"></image>
							<!-- 文字 -->
							<view class="message" v-if="item.messageTypes == 0">
								<view class="msg-text">{{item.message}}</view>
							</view>
							<!-- 图片 -->
							<view class="message" v-if="item.messageTypes == 1">
								<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImage(item.message)"></image>
							</view>
							<!-- 音频 -->
							<view class="message" v-if="item.messageTypes == 2">
								<view class="msg-text voice" :style="{width:item.message.time*4 + 'px'}" @tap="playVoice(item.message)">
									{{item.message.time}}″
									<image src="../../static/images/chatRoom/voice.png" class="voice-img"></image>
								</view>
							</view>
							<!-- 位置 -->
							<view class="message" v-if="item.messageTypes == 3">
								<view class="msg-map" @tap="openLocation(item.message)">
									<view class="map-name">{{item.message.name}}</view>
									<view class="map-address">{{item.message.address}}</view>
									<image src="../../static/images/chatRoom/dt.jpg" mode="aspectFill" class="map-img"></image>
									<!--<map class="map" 
									:longitude="item.message.longitude" 
									:latitude="item.message.latitude"
									:markers="covers(item.message)"></map> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<chat-input-box @getInputContent="getInputContent" @getBoxHeight="getBoxHeight"></chat-input-box>
		<!-- <view class="box"></view> -->
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
				uID: '',
				uImgUrl: '',
				token: '',
				uName: '',
				fID: '',
				fImgUrl: '',
				fName: '',
				type: '', // 0为好友 、 1 为 群
				pageSize: 10, // 假数据 一页条数
				messages: [], // 发送的所有消息 （头像，时间，消息内容及类型等）
				imageMessage: [], // 图片类型的消息
				oldTime: 0, // 进入聊天室的时间
				srcollToView: '', // 定位聊天位置
				inputHeight: '60', // 输入高度 动态获取
				animationData: {}, // 加载动画
				nowPage: 0, // 页码 
				loading: '', // 加载动画定时器
				isLoading: true,
				isScroll: true, // 是否有滑动动画
				beginLoading: true, // 开启加载 (避免重复加载)
			}
		},
		onLoad: function(e) {
			this.fID = e.id
			this.fImgUrl = e.img
			this.fName = e.name
			this.type = e.type
			this.getStorages()
			this.getMessage()
			//this.loadingNextPage()
			this.receiveSocketMessage()
		},
		methods: {
			// 获取缓存信息
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						// console.log(value);
						this.uID = value.id
						this.uImgUrl = this.serverUrl + value.imgUrl
						this.token = value.token
						this.uName = value.name
					} else {
						// 如果没有用户缓存，则跳转到登陆页面
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {
					// error
				}
			},
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
			// 滚到到顶部加载上一页
			loadingNextPage: function() {
				if (this.nowPage > 0 && this.beginLoading) {
					// 显示loading图标
					this.isLoading = false
					// 禁止重复加载
					this.beginLoading = false
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})

					this.animation = animation

					let i = 1
					this.loading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++;
						//获取聊天数据
						if (i > 20) {
							this.getMessage(this.nowPage)
						}
					}.bind(this), 100)
				}
			},
			// 聊天数据
			getMessage: function() {
				uni.request({
					url: this.serverUrl + "/chat/getPageMessage",
					data: {
						uID: this.uID,
						fID: this.fID,
						nowPage: this.nowPage,
						pageSize: this.pageSize,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let msg = data.data.result
							//将消息倒序
							msg.reverse()
							if (msg.length > 0) {
								let oldTime = msg[0].sendTime
								let imgArr = []
								// 处理头像链接
								// 在这里定义 i,是为了下边获取定位聊天位置的
								for (var i = 1; i < msg.length; i++) {
									// 处理头像地址 
									msg[i].imgUrl = this.serverUrl + msg[i].imgUrl
									// 处理时间间隔
									if (i < msg.length - 1) {
										let interval = myfun.spaceTime(oldTime, msg[i].sendTime)
										if (interval) {
											oldTime = interval
										}
										msg[i].sendTime = interval
									}
									// 匹配最大时间
									if (this.nowPage == 0) {
										if (msg[i].sendTime > this.oldTime) {
											this.oldTime = msg[i].sendTime
										}
									}
									// 处理图片地址
									if (msg[i].messageTypes == 1) {
										msg[i].message = this.serverUrl + msg[i].message
										imgArr.push(msg[i].message)
									}
									// 地图数据类型转换
									// JSON字符串还原
									if(msg[i].messageTypes == 3 ){
										msg[i].message = JSON.parse(msg[i].message)
									}								
									//this.messages.unshift(msg[i])
								}
								this.messages = msg.concat(this.messages)
								this.imageMessage = imgArr.concat(this.imageMessage)
							}
							if (msg.length == 10) {
								// 页码加一
								this.nowPage++
							} else {
								// 数据全部获取完毕
								this.nowPage = -1
								// uni.showToast({
								// 	title: '已经拖到顶部啦~',
								// 	icon: 'none',
								// 	duration: 1500
								// })
								console.log('已经拖到顶部啦~')
							}
							// 页数+1
							this.$nextTick(function() {
								this.isScroll = false
								this.srcollToView = 'message' + this.messages[msg.length - 1].id
							})
							clearInterval(this.loading)
							// 隐藏loading图标
							this.isLoading = true
							// 开启加载
							this.beginLoading = true
							
						} else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						} else if (status === 300) {
							// token 过期了 需要重新登录再次生成token
							uni.navigateTo({
								url: '../login/login?name=' + this.myName
							});
						}
					}
				})
			},
			// 聊天数据
			getMessage1: function(page) {
				let msg = datas.message()
				let maxPages = msg.length
				if (msg.length > (page + 1) * 10) {
					maxPages = (page + 1) * 10
					// 页码加一
					this.nowPage++
				} else {
					// 数据全部获取完毕
					this.nowPage = -1000
					uni.showToast({
						title: '已经拖到顶部啦~',
						icon: 'none',
						duration: 1500
					})
					console.log('已经拖到顶部啦~')
				}
				// 处理头像链接 
				// 在这里定义 i,是为了下边获取定位聊天位置的
				for (var i = page * 10; i < maxPages; i++) {
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
				// 页数+1
				this.$nextTick(function() {
					this.isScroll = false
					this.srcollToView = 'message' + this.messages[maxPages - page * 10 - 1].tip
				})
				clearInterval(this.loading)
				// 隐藏loading图标
				this.isLoading = true
				// 开启加载
				this.beginLoading = true
				// console.log(this.messages)
			},
			// 播放录音
			playVoice: function(e) {
				console.log(e)
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = e;
				innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
			},
			// 预览图片
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
			// 地图定位
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatRoom/wz.png'
				}]
				return (map)
			},
			// 导航
			openLocation: function(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					}
				});
			},
			// 获取输入的内容
			getInputContent: function(e) {
				this.receiveMessage(e, this.uID, this.uImgUrl, 0)
			},
			// 接收消息
			receiveMessage: function(e, id, img, tip) {
				// socket 提交
				// 文字提交/地图提交
				if (e.messageTypes === 0 || e.messageTypes === 3) {
					// 发送给后端
					this.sendSocket(e)
				}
				// 提交图片
				if (e.messageTypes === 1) {
					this.judgeMessageTypes(e,e.message) 
				}
				// 提交音频
				if (e.messageTypes === 2) {
					console.log(e)
					this.judgeMessageTypes(e,e.message.voice)
				}
				
				// tip = 0 为自己发的， 
				// 滑动动画
				this.isScroll = true
				let length = this.messages.length
				// 处理时间间隔
				let nowTime = new Date()
				let interval = myfun.spaceTime(this.oldTime, nowTime)
				if (interval) {
					this.oldTime = interval
				}
				nowTime = interval
				
				//如果为地图消息类型，需要转换为JSON
				if(e.messageTypes === 3){
					e.message = JSON.parse(e.message)
				}
				let data = {
					fromID: id, // 发送者ID
					imgUrl: img,
					message: e.message,
					messageTypes: e.messageTypes, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
					sendTime: nowTime, // 发送时间
					id: length

				}
				this.messages.push(data)
				this.$nextTick(function() {
					this.srcollToView = 'message' + length
				})


			},
			
			// 消息类型封装发送给后端
			judgeMessageTypes:function(e,filePath){
				this.imageMessage.push(e.message)
				// 当前日期文件夹
				let url = myfun.fileNmae(new Date())
				const uploadTask = uni.uploadFile({
					url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					filePath: filePath,
					name: 'file',
					formData: {
						url: url,
						name: this.uID + new Date().getTime() + Math.ceil(Math.random() * 20),
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes)
						let data = {
							message: uploadFileRes.data,
							messageTypes: e.messageTypes
						}
						// 发送给后端
						this.sendSocket(data)
					}
				});
			},
			
			// socket 聊天数据接收
			receiveSocketMessage:function(){
				this.socket.on('message',(msg,fromID,tip)=>{
					if(fromID === this.fID && tip == 0){
						// console.log('消息')
						// console.log(msg)
						// console.log('发送者ID')
						// console.log(fromID)
						// tip = 0 为自己发的，
						// 滑动动画
						this.isScroll = true
						let length = this.messages.length
						// 处理时间间隔
						let nowTime = new Date()
						let interval = myfun.spaceTime(this.oldTime, nowTime)
						if (interval) {
							this.oldTime = interval
						}
						nowTime = interval
						if(msg.messageTypes ==1 || msg.messageTypes==2){
							msg.message = this.serverUrl + msg.message
						}
						let data = {
							fromID: fromID, // 发送者ID
							imgUrl: this.fImgUrl,
							message: msg.message,
							messageTypes: msg.messageTypes, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
							sendTime: nowTime, // 发送时间
							id: length
						
						}
						this.messages.push(data)
						if(msg.messageTypes == 1){
							this.imageMessage.push(msg.message)
						}
						this.$nextTick(function() {
							this.srcollToView = 'message' + length
						})
					}
				})
			},
			// 聊天数据发送后端
			sendSocket: function(e) {
				if (this.type == 0) {
					// 一对一聊天
					this.socket.emit('message', e, this.uID, this.fID)

				} else {
					// 群聊
					this.socket.emit('groupMessage', e, this.uID, this.fID)
				}
			},
			// 获取输入框高度
			getBoxHeight: function(e) { 
				this.inputHeight = e
				// 获取高度的同时去滚动页面到底部
				this.toBottom()
			},
			// 滚到到底部
			toBottom: function() {
				// 滑动动画
				this.isScroll = true
				// 先清空 再执行
				this.srcollToView = ''
				this.$nextTick(function() {
					let length = this.messages.length - 1
					this.srcollToView = 'message' + this.messages[length].id
				})
			}
		}
	}
</script>

<style scoped lang="scss" scoped>
	page {
		height: 100%;
	}

	;

	.content {
		height: 100%;
		background: rgba(244, 244, 244, 1);
		padding-top: var(--status-bar-height);

		.box {
			width: 100%;
			height: env(safe-area-inset-bottom);
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

			.loading {
				text-align: center;

				.loading-img {
					width: 60rpx;
					height: 60rpx;
				}
			}

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

					.msg-map {
						background-color: #fff;
						width: 464rpx;
						height: 284rpx;
						overflow: hidden;
						border-radius: 20rpx;

						.map-name {
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx 0 24rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}

						.map-address {
							font-size: $uni-font-size-sm;
							color: $uni-text-color-disable;
							padding: 0rpx 24rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}

						.map-img {
							padding-top: 8rpx;
							width: 464rpx;
							height: 190rpx;
						}
					}

					.voice {
						min-width: 100rpx;
						max-width: 400rpx;
					}

					.voice-img {
						width: 28rpx;
						height: 36rpx;
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

					.msg-map {
						margin-left: 16rpx;
					}

					.voice {
						text-align: right;
					}

					.voice-img {
						padding-top: 4rpx;
						float: left;
						width: 28rpx;
						height: 36rpx;
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

					.msg-map {
						margin-right: 16rpx;
					}

					.voice {
						text-align: left;
					}

					.voice-img {
						padding-bottom: 4rpx;
						float: right;
						transform: rotate(180deg);
						width: 28rpx;
						height: 36rpx;
					}
				}
			}
		}
	}

	.displaynone {
		display: none;
	}
</style>

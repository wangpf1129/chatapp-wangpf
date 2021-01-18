<template>
	<view class="inputBox">
		<view class="submit-chat">
			<view class="bt-img" @tap='toggleRecore'>
				<image :src="toggleImg"></image>
			</view>
			<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" @input='getInputContent' v-model="inputContent"
			 @focus="focusInput"></textarea>
			<view class="record btn" 
			:class="{displaynone:!isrecord}"
			@touchstart="voiceStart"
			@touchend="voiceEnd"
			@touchmove="cancelVoice"
			>按住说话</view>
			<view class="bt-img" @tap='toggleEmoji'>
				<image src="../../static/images/chatInput/emoji.png"></image>
			</view>
			<view class="bt-img" @tap="toggleOptions">
				<image src="../../static/images/chatInput/add.png"></image>
			</view>
		</view>
		<view class="emoji" :class="{displaynone:isEmoji}">
			<view class="emoji-send">
				<view class="emoji-send-det" @tap="emojiBack">
					<image src="../../static/images/chatInput/delete.png"></image>
				</view>
				<view class="emoji-send-bt" @tap="emojiSend">发送</view>
			</view>
			<emoji @getEmoji="getEmoji" :height="230"></emoji>
		</view>
		<view class="moreOptions" :class="{displaynone:isOptions}">
			<view class="option-list" @tap="snedImage('album')">
				<image src="../../static/images/chatInput/photo.png"></image>
				<view class="option-list-title">相册</view>
			</view>
			<view class="option-list" @tap="snedImage('camera')">
				<image src="../../static/images/chatInput/carmera2.png"></image>
				<view class="option-list-title">拍摄</view>
			</view>
			<view class="option-list">
				<image src="../../static/images/chatInput/camera.png"></image>
				<view class="option-list-title">视频通话</view>
			</view>
			<view class="option-list" @tap="chooseLocation">
				<image src="../../static/images/chatInput/position.png"></image>
				<view class="option-list-title">位置</view>
			</view>
			<view class="option-list">
				<image src="../../static/images/chatInput/file.png"></image>
				<view class="option-list-title">文件</view>
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:isShowVoiceBg}" @touchmove.stop.prevent="moveHandle">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:voiceLength / 0.6 + '%'}">{{voiceLength}}″</view>
			</view>
			<view class="voice-del">上滑取消录音</view>
		</view>
	</view>
</template>

<script>
	import emoji from '../emoji/emoji.vue'
	// 录音
	const recorderManager = uni.getRecorderManager()
	
	export default {
		data() {
			return {
				isrecord: false, // 是否点击了语音说话按钮
				isEmoji: true, // 是否点击了表情按钮
				toggleImg: '../../static/images/chatInput/voice.png', // 切换 语音，键盘 
				inputContent: '', // 输入的内容
				isOptions: true, //是否点击了更多选项
				voiceTimer:'',  // 录音计时
				voiceLength:'0',  // 录音时长
				isShowVoiceBg:true, // 显示录音时背景
				startPageY:0, // 点击开始语音时的位置
			};

		},
		components: {

		},
		methods: {
			// 获取该组件的高度
			getElementHeight: function() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.inputBox').boundingClientRect(data => {
					this.$emit('getBoxHeight', data.height)
				}).exec()
			},
			// 切换语音键盘类型
			toggleRecore: function() {
				// 关闭其他按钮
				this.isEmoji = true
				this.isOptions = true
				setTimeout(() => {
					this.getElementHeight()
				}, 10)
				if (this.isrecord) {
					this.isrecord = false
					this.toggleImg = '../../static/images/chatInput/voice.png'
				} else {
					this.isrecord = true
					this.toggleImg = '../../static/images/chatInput/keyboard.png'
				}
			},
			// 音频处理
			// 开始录音
			voiceStart:function(e){
				// 获取开始录音时手指的位置
				this.startPageY = e.changedTouches[0].pageY
				console.log('开始')
				this.isShowVoiceBg = false
				let i = 1
				this.voiceTimer = setInterval(()=>{
					this.voiceLength = i
					i++
					if(i > 60){
						// 结束计时
						clearInterval(this.voiceTimer)
						this.voiceEnd()
					}
				},1000)
				try{
					recorderManager.start();
				}catch(err){
					// console.log(err)
				}
			},
			// 结束录音
			voiceEnd:function(){
				console.log('结束')
				clearInterval(this.voiceTimer)
				
				try{
					recorderManager.stop();
					recorderManager.onStop((res) => {
						let data  = {
							voice:res.tempFilePath,
							time:this.voiceLength
						}
						if(!this.isShowVoiceBg){	
							this.sendContent(data,2)
						}
						// 时长归为
						this.voiceLength = 0
						this.isShowVoiceBg = true
					});
				}catch(err){
					// console.log(err)
				}
			},
			// 取消录音
			cancelVoice:function(e){
				if(this.startPageY - e.changedTouches[0].pageY > 100){
					// console.log('取消录音')
					// 关闭录音控件
					this.isShowVoiceBg = true
				}
			},
			// 切换表情按钮
			toggleEmoji: function() {
				this.isEmoji = !this.isEmoji
				// 关闭其他项
				this.isOptions = true
				this.isrecord = false
				this.toggleImg = '../../static/images/chatInput/voice.png'
				setTimeout(() => {
					this.getElementHeight()
				}, 10)
			},
			// 获取表情
			getEmoji: function(e) {
				this.inputContent = this.inputContent + e
			},
			// 获取输入内容并发送
			getInputContent: function(e) {
				let chatContent = e.detail.value
				
				let pos = chatContent.indexOf('\n')
				if (pos !== -1 && chatContent.length > 1) {
					this.sendContent(this.inputContent, 0)
				}
			},
			// 输入框聚焦
			focusInput: function() {
				// 关闭其他按钮
				this.isEmoji = true
				this.isOptions = true
				setTimeout(() => {
					this.getElementHeight()
				}, 0)
			},
			//  表情发送按钮
			emojiSend: function() {
				if (this.inputContent.length > 0) {
					this.sendContent(this.inputContent, 0)
				}
			},
			// 表情撤销
			emojiBack: function() {
				if (this.inputContent.length > 0) {
					this.inputContent = this.inputContent.substring(0, this.inputContent.length - 1)
				}

			},
			// 点击切换显示更多功能
			toggleOptions: function() {
				this.isOptions = !this.isOptions
				// 关闭其他项
				this.isEmoji = true
				this.isrecord = false
				this.toggleImg = '../../static/images/chatInput/voice.png'
				setTimeout(() => {
					this.getElementHeight()
				}, 10)
			},
			// 发送图片功能
			snedImage: function(type) {
				let conut = 9
				conut = type == 'album' ? 9 : 1
				uni.chooseImage({
					count: conut, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [type], //从相册选择
					success: (res) => {
						const filePaths = res.tempFilePaths
						for (let i = 0; i < filePaths.length; i++) {
							this.sendContent(filePaths[i], 1)
						}
					}
				});
			},
			// 发送位置
			chooseLocation:function(){
				uni.chooseLocation({
				    success:  (res) => {
						let data = {
							name:res.name,
							address:res.address,
							latitude:res.latitude,
							longitude:res.longitude
						}
					   // console.log('位置名称：' + res.name);
					   // console.log('详细地址：' + res.address);
					   // console.log('纬度：' + res.latitude);
					   // console.log('经度：' + res.longitude);
					   // 由于地图消息data为JSON数据，而我们数据库存的消息是String
					   // 需要转换一下
					   let stringData = JSON.stringify(data)
					   this.sendContent(stringData,3)
				    }
				});
			}, 
			// 发送内容及类型
			sendContent: function(message, messageTypes) {
				let data = {
					message,
					messageTypes,
				}
				this.$emit('getInputContent', data)
				setTimeout(() => {
					this.inputContent = ''
				}, 10)
			},

		}
	}
</script>

<style lang="scss" scoped>
	.inputBox {
		background-color: rgba(244, 244, 244, .96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 1002;
		padding-bottom: env(safe-area-inset-bottom);

	}


	.submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;

		image {
			z-index: 10;
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}

		.btn {
			flex: auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin: 0 10rpx;
			max-height: 160rpx;
		}

		.chat-send {
			line-height: 41rpx;
		}

		.record {
			text-align: center;
			line-height: 41rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
		}

	}


	.emoji {
		width: 100%;
		height: 460rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, .1);

		.emoji-send {
			width: 300rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236, 237, 238, .9);
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;

			.emoji-send-bt {
				flex: 1;
				margin: 0 32rpx 0 20rpx;
				height: 80rpx;
				background-color: rgba(255, 228, 49, 1);
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 12rpx;
			}

			.emoji-send-det {
				flex: 1;
				margin-left: 24rpx;
				height: 80rpx;
				background-color: #fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 12rpx;

				image {
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
	}

	.moreOptions {
		width: 100%;
		height: 460rpx;
		background-color: rgba(236, 237, 238, 1);
		box-shadow: 0px -1rpx 0px 0px rgba(0, 0, 0, .1);
		bottom: env(safe-area-inset-bottom);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 8rpx 20rpx;
		box-sizing: border-box;

		.option-list {
			width: 25%;
			padding-top: 32rpx;
			text-align: center;

			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background-color: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
			}

			.option-list-title {
				font-size: 24rpx;
				color: rgba(39, 40, 50, .5);
				line-height: 34rpx;
			}
		}
	}
	
	.voice-bg{
		height: calc(100% - 108rpx);
		width: 100%;
		background-color: rgba(0,0,0,.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1000;
			
		.voice-bg-len{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,.2);
			border-radius: 42rpx;
			text-align: center;
			
			.voice-bg-time{
				display: inline-block;
				min-width: 120rpx;
				width: 120rpx;
				line-height: 84rpx;
				background-color: rgba(158, 234, 106,1);
				border-radius: 42rpx;
			}
		}
		
		.voice-del{
			position: absolute;
			bottom: 40rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
		}				
	}
	
	
	
	
	
	
	
	
	
	
	.displaynone {
		display: none;
	}

</style>

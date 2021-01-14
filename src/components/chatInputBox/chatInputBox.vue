<template>
	<view class="inputBox">
		<view class="submit-chat">
			<view class="bt-img" @tap='toggleRecore'>
				<image :src="toggleImg"></image>
			</view>
			<textarea auto-height="true" 
			class="chat-send btn"  
			:class="{displaynone:isrecord}"
			@input='getInputContent'
			v-model="inputContent"
			@focus="focusInput"
			></textarea>
			<view class="record btn" :class="{displaynone:!isrecord}">按住说话</view>
			<view class="bt-img" @tap='toggleEmoji'>
				<image src="../../static/images/chatInput/表情.png"></image>
			</view>
			<view class="bt-img">
				<image src="../../static/images/chatInput/添加.png"></image>
			</view>
		</view>
		<view class="emoji" :class="{displaynone:isEmoji}">
			<view class="emoji-send">
				<view class="emoji-send-det" @tap="emojiBack">
					<image src="../../static/images/chatInput/退格.png"></image>
				</view>
				<view class="emoji-send-bt" @tap="emojiSend">发送</view>
			</view>
			<emoji @getEmoji="getEmoji" :height="230"></emoji>
		</view>
	</view>
</template>

<script>
	import emoji from '../emoji/emoji.vue'
	
	export default {
		data() {
			return {
				isrecord:false, 	// 是否点击了语音说话按钮
				isEmoji:true, 		// 是否点击了表情按钮
				toggleImg:'../../static/images/chatInput/语音.png',// 切换 语音，键盘 
				inputContent:'', // 输入的内容
				
			};
			
		},
		components:{
			
		},
		methods:{
			// 获取该组件的高度
			getElementHeight:function(){
				const query = uni.createSelectorQuery().in(this)
				query.select('.inputBox').boundingClientRect(data => {
				this.$emit('getBoxHeight',data.height)
				}).exec()
			},
			// 切换语音键盘类型
			toggleRecore:function(){
				if(this.isrecord){
					this.isrecord = false
					this.toggleImg = '../../static/images/chatInput/语音.png'
				}else{
					this.isrecord = true
					this.toggleImg = '../../static/images/chatInput/键盘.png'
				}
			},
			// 切换表情按钮
			toggleEmoji:function(){
				this.isEmoji = !this.isEmoji
				setTimeout(()=>{
					this.getElementHeight()
				},0)
			},
			// 获取表情
			getEmoji:function(e){
				this.inputContent = this.inputContent +e
			},
			// 获取输入内容并发送
			getInputContent:function(e){
				let chatContent = e.detail.value
				let pos = chatContent.indexOf('\n')
				if(pos!== -1 && chatContent.length > 1){
					this.$emit('getInputContent',this.inputContent)
					setTimeout(()=>{
						this.inputContent = ''
					},0)
				}
			},
			// 输入框聚焦
			focusInput:function(){
				this.isEmoji = true
				setTimeout(()=>{
					this.getElementHeight()
				},0)
			},
			//  表情发送按钮
			emojiSend:function(){
				if(this.inputContent.length > 0){
					this.$emit('getInputContent',this.inputContent)
					setTimeout(()=>{
						this.inputContent = ''
					},0)
				}
			},
			// 表情撤销
			emojiBack:function(){
				if(this.inputContent.length>0){
					this.inputContent = this.inputContent.substring(0,this.inputContent.length-1)
				}
				
			}
			
		}
	}
</script>

<style lang="scss" scoped>
 .inputBox{
	 background-color: rgba(244,244,244,.96);
	 border-top: 1px solid $uni-border-color;
	 width: 100%;
	 position: fixed;
	 bottom: 0;
	 left: 0;
	 right: 0;
	 z-index: 100;
	 padding-bottom: var(--status-bar-height);
	 
 }
 .submit-chat{
	 width: 100%;
	 display: flex;
	 align-items: flex-end;
	 box-sizing: border-box;
	 padding: 14rpx 14rpx;
	 
	 image{
		 width: 56rpx;
		 height: 56rpx;
		 margin: 0 10rpx;
		 flex: auto;
	 }
	 
	 .btn{
		 flex: auto;
		 background-color: #fff;
		 border-radius: 10rpx;
		 padding: 20rpx;
		 margin: 0 10rpx;
		 max-height: 160rpx;
	 }
	 .chat-send{
		 line-height: 41rpx;
	 }
	 .record{
		 text-align: center;
		 line-height: 41rpx;
		 font-size: $uni-font-size-lg;
		 color: $uni-text-color-grey;
	 }

 }	
 .displaynone{
	display: none;
 }

 .emoji{
 	 width: 100%;
 	 height: 460rpx;
 	 background-color: rgba(236,237,238,1);
 	 box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,.1);
	 
	 .emoji-send{
		 width: 280rpx;
		 height: 104rpx;
		 padding-top: 24rpx;
		 background-color: rgba(236,237,238,.9);
		 position: fixed;
		 bottom: 0;
		 right: 0;
		 display: flex;
		 
		 .emoji-send-bt{
			 flex: 1;
			 margin: 0 32rpx 0 20rpx;
			 height: 80rpx;
			 background-color: rgba(255,228,49,1);
			 font-size: 32rpx;
			 text-align: center;
			 line-height: 80rpx;
			 border-radius: 12rpx;
		 }
		 
		 .emoji-send-det{
		 	 flex: 1;
			 margin-left: 24rpx;
		 	 height: 76rpx;
		 	 background-color: #fff;
		 	 font-size: 32rpx;
			 padding-top: 8rpx;
		 	 text-align: center;
		 	 line-height: 80rpx;
		 	 border-radius: 12rpx;
			 
			 image{
				 width: 42rpx;
				 height: 42rpx;
			 }
		 }
	 }
 }
	 
</style>

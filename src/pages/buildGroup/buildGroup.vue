<template>
	<view class="content">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/common/back.png" mode=""></image>
			</view>
			<view slot="mid">创建群聊</view>
		</top-bar>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload" ></image>
				</view>
				<!-- 群名 -->
				<view class="group-name">
					<input type="text" class="group-name-input"
					 placeholder="请给群取个名字!" 
					 placeholder-style="color:#999;font-weight:400"
					 v-model="groupName"/>
				</view>
				<view class="title">用户</view>
			</view>
			
			<!-- 选择用户 -->
			<view class="friends">
				<view class="user" v-for="(item,index) in user" :key="index">
					<view class="selected" :class="{isSelected:item.selected}" @tap="selectFriend(index)">
						<image 
						class="selected-img"
						src="../../static/images/group/choose.png" 
						v-if="item.selected"></image>
					</view>
					<image class="user-img" :src="item.imgUrl"></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>
		<bottom-bar class="bottom-bar">
			<view slot="text" class="bottom-btn" :class="{isSelect:showBtnStyle && groupName.length > 0}">创建({{selectedNum}})</view>
		</bottom-bar>
	</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'
	import bottomBar from '../../components/bottomBar.vue'
	
	// 头像裁剪
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components:{
			topBar,
			bottomBar,
			ImageCropper
		},
		data() {
			return {
				tempFilePath:"",
				headimg:"",
				cropFilePath:"../../static/images/group/groupImg.png",
				selectedNumber:0,
				groupName:'', //群名
				user:[
					{
						selected:false,
						imgUrl:'../../static/images/test/five.jpeg',
						name:'熊出没'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/six.jpeg',
						name:'酸奶'
					},
					{
						selected:false,
						imgUrl:'../../static/images/test/eight.jpeg',
						name:'迷哦'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/seven.jpeg',
						name:'当模大沙漠i的那艘i都会把送i的比赛哦i是大宋i百八十'
					},
					{
						selected:false,
						imgUrl:'../../static/images/test/five.jpeg',
						name:'熊出没'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/six.jpeg',
						name:'酸奶'
					},
					{
						selected:false,
						imgUrl:'../../static/images/test/eight.jpeg',
						name:'迷哦'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/seven.jpeg',
						name:'当模大沙漠i的那艘i都会把送i的比赛哦i是大宋i百八十'
					},
					{
						selected:false,
						imgUrl:'../../static/images/test/five.jpeg',
						name:'熊出没'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/six.jpeg',
						name:'酸奶'
					},
					{
						selected:false,
						imgUrl:'../../static/images/test/eight.jpeg',
						name:'迷哦'
					},
					{
						selected:true,
						imgUrl:'../../static/images/test/seven.jpeg',
						name:'当模大沙漠i的那艘i都会把送i的比赛哦i是大宋i百八十'
					},
				],
			}
		},
		computed:{
			selectedNum:function(){
				this.selectedNumber = 0
				for(let i =0;i<this.user.length;i++){
					if(this.user[i].selected){
						this.selectedNumber ++
					}
				}
				return this.selectedNumber
			},
			showBtnStyle:function(){
				if(this.selectedNumber > 0 ){
					return true
				}else{
					return	false
				}
			}
		},
		methods: {
			// 返回上一级页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 头像裁剪
			upload:function() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album","camera"], //从相册选择 [0]  拍照选择[1]
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			confirm:function(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;			
			},
			cancel:function() {
				console.log("canceled");
				// this.tempFilePath = "";
			},
			// 是否选中
			selectFriend:function(index){
				if(this.user[index].selected){
					this.user[index].selected = false
					this.selectedNumber --
				}else{
					this.user[index].selected = true
					this.selectedNumber ++
				}
			},
			Aconfirm:function(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
			
				uni.uploadFile({
					url: this.serverUrl + '/files/upload', //   后端地址上传图片接口地址
					filePath: this.headimg,
					name: "file",
					fileType: "image",
					formData:{
						url:'user',
						name: new Date().getTime() + this.uID,
						token:this.token
					},		// 传递参数
					success: (uploadFileRes) => {
						let backstr = uploadFileRes.data;
						console.log(backstr)
						// 本地存储用户信息修改
						try {
							uni.setStorageSync('user', {
								'id': this.uID,
								'userName': this.userName,
								'imgUrl': backstr,
								'token': this.token
							});
						} catch (error) {
							console.log('数据存储出错:' + error)
						}
						// 更换头像
						this.updateUser(backstr,'imgUrl',undefined)
					},
			
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
			
			},
		}
	}
</script>

<style lang="scss" scoped>
.content{
	
	.top-bar {
		background: rgba(255, 255, 255, 1);
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
	
	}
	
	.main{
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height);
		.top{
			padding-top: 148rpx;
			position: fixed;
			background-color: #fff;
			width: 100%;
			z-index: 100;
		}
		
		.group-img{
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			background-color:$uni-color-primary;
			box-shadow: 0 36rpx 40rpx 0 rgba(39,40,50,0.10);
			border-radius: 40rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.group-name{
			padding: 62rpx $uni-spacing-col-base 0;
		}
		
		.group-name-input{
			text-align: center;
			height: 92rpx;
			background-color: $uni-bg-color-grey;
			border-radius: 46rpx;
			font-size: 32rpx;
			color: $uni-text-color;
		}
		
		.title{
			padding: $uni-spacing-row-base $uni-spacing-col-base 20rpx;
			font-size: 44rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 60rpx;
		}
		
		.friends{
			padding:600rpx $uni-spacing-col-base 140rpx ;
			
			.title{
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}	
			.user{
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 120rpx;
				
				.selected{
					flex: none;
					margin-right: 30rpx;
					width: 48rpx;
					height: 48rpx;
					background-color: $uni-bg-color-grey;
					border-radius: 24rpx;
					position: relative;
					
					.selected-img{
						width: 30rpx;
						height: 30rpx;
						position: absolute;
						left: 10rpx;
						top:10rpx;
					}
					
				}
				
				.isSelected{
					background-color: $uni-color-primary;
				}
				
				
				
				.user-img{
					width: 80rpx;
					height: 80rpx;
					flex: none;
					border-radius: $uni-border-radius-base;
				}
				
				.name{
					padding-left: 32rpx;
					font-size: 36rpx;
					color: $uni-text-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
			
		}
	}
	
	.bottom-bar{
		.bottom-btn{
			background-color: $uni-bg-color-grey ;
		}
		.isSelect{
			background-color: $uni-color-primary;
		}
		
	}
	


}
</style>

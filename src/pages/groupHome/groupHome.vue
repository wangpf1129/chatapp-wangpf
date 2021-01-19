<template>
	<view class="content">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/group/back1.png" mode=""></image>
			</view>
			<view slot="right" class="right">
				<view class="close">
					<image src="~@/static/images/group/more1.png" mode=""></image>
				</view>
			</view>
		</top-bar>
		<view class="bg">
			<image :src="gImgUrl" class="bg-img" mode="aspectFill"></image>
			
		</view>
		
		<view class="main">
			<view class="main-inner">
				<view class="info"> 
					<view class="name">开发交流群</view>
					<view class="time">2021/1/18</view>
					<view class="notice">公告：欢迎大家来到这个开发交流群，我们可以在这里分析自己的技术，以便促进群里的各位共同进步！</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">管理群成员</view>
						<image src="~@/static/images/group/more1.png" mode="aspectFill" class="more-img"></image>
					</view>
					<view class="member-list">
						<view class="member-li" v-for="(item,index) in groupMember" :key="index">
							<view class="imgs">
								<image src="../../static/images/group/delete.png" mode="aspectFill" class="delete"></image>
								<image :src="item.imgUrl" mode="aspectFill" class="user-img"></image>
							</view>
							<view class="name">{{item.name}}</view>
						</view>
						<view class="member-li">
							<view class="imgs">
								<image src="../../static/images/group/add.png" mode="aspectFill" class="user-add"></image>
							</view>
							<view class="name">邀请</view>
						</view>
					</view>
				</view>
				<view class="groupInfo">
					<view class="row" @tap="modifyfBox('groupName','群名称','开发交流群')">
						<view class="title">群名称</view>
						<view class="cont">开发交流群</view>
						<view class="more">
							<image src="~@/static/images/group/more1.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title" >群头像</view>
						<view class="cont">
							<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
							<image :src="gImgUrl" @tap="upload" class="group-img" mode="aspectFill"></image>
						</view>
						<view class="more">
							<image src="~@/static/images/group/more1.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modifyfBox('groupNotice','群公告','欢迎大家来到这个开发交流群，我们可以在这里分析自己的技术，以便促进群里的各位共同进步！')">
						<view class="title">群公告</view>
						<view class="cont">欢迎大家来到这个开发交流群，我们可以在这里分析自己的技术，以便促进群里的各位共同进步！</view>
						<view class="more">
							<image src="~@/static/images/group/more1.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modifyfBox('groupInnerName','群内名','王鹏飞')">
						<view class="title">群内名</view>
						<view class="cont">王鹏飞</view>
						<view class="more">
							<image src="~@/static/images/group/more1.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">消息免打扰</view>
						<view class="cont"></view>
						<view class="more">
							<switch :checked='isSwitch' @change="switchChange" color="rgba(255,228,49,1)" class="switch"/>
						</view>
					</view>
					 
				</view>
			</view>
		</view>
		<view class="bottomBtn">解散该群</view>
		<view class="modify" :style="{bottom: - + modiyfBoxHeight +'px'}" :animation="animationModifyBox">
			<view class="modify-header">
				<div class="close" @tap="modifyfBox(type,modifyTitle,modifyData)">取消</div>
				<div class="title">{{modifyTitle}}</div>
				<div class="define" @tap="modifySure">确定</div>
			</view>
			<view class="modify-main">
				<textarea v-model="modifyData" class="modify-content" />
				</view>
		</view>
	</view>
	
	
</template>

<script>
	import topBar from '../../components/topBar.vue'
	
	import datas from '../../common/datas.js'
	// 头像裁剪
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components:{
			topBar,
			ImageCropper,
		},
		data() {
			return {
				gID:'', // 群ID
				gImgUrl:'', // 群头像
				groupMember:[], // 群成员
				isSwitch:false,  // 消息免打扰开关
				tempFilePath:"",
				headimg:"",
				modifyTitle:'',				//  被修改的标题
				modifyData:'',				 //  修改的内容
				oldData:'',					// 原始数据
				isModify:false,				// 判断是否要 弹出 修改框
				modiyfBoxHeight:'1500',        // 弹出框 高度
				animationModifyBox:'',      // 弹出框 动画
			}
		},
		onLoad:function(e){
			this.gID = e.gID
			this.gImgUrl = e.gImgUrl
			this.getGroupMember()
		},
		methods: {
			// 返回上一级页面
			backOne: function () {
				uni.navigateBack({
				delta: 1
				});
			},
			// 获取群成员
			getGroupMember:function(){
				let members = datas.users()
				for(let i =0 ;i<members.length;i++){
					members[i].imgUrl = '../../static/images/test/' + 	members[i].imgUrl 
					this.groupMember.push(members[i])
				}
				console.log(this.groupMember)
			},
			switchChange: function (e) {
			          console.log('switch1 发生 change 事件，携带值为', e.target.value)
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
			 	this.gImgUrl = e.detail.tempFilePath;
			 	this.headimg = e.detail.tempFilePath;			
			 },
			 cancel:function() {
			 	console.log("canceled");
			 	// this.tempFilePath = "";
			 },
			 modifyfBox:function(type,typeChinese,data){
			 	this.type = type
			 	this.modifyTitle = typeChinese
			 	this.modifyData = data
			 	this.oldData = data
			 	if(this.modifyTitle === '密码'){
			 		this.isOldPwd = true
			 	}else{
			 		this.isOldPwd = false
			 		this.oldPwd = undefined
			 	}
			 	this.isModify = !this.isModify
			 	 // 设置弹出框的动画
			 	let animationModifyBox = uni.createAnimation({
			 	  duration: 300,
			 	  timingFunction: 'ease',
			 	})
			 	
			 	if(this.isModify){
			 		  animationModifyBox.bottom(0).step()
			 	}else{
			 		animationModifyBox.bottom(- this.modiyfBoxHeight).step()
			 	}
			 	 this.animationModifyBox = animationModifyBox.export()
			 },
			 //  弹出修改框 修改后确定操作
			 modifySure:function(){
			 	// 做一些操作后在 调用modifyfBox
			 	if(this.modifyData.length > 0 && this.modifyData !== this.oldData){
			 		if(this.type === 'markName'){
			 			this.updateFriendName()
			 			// 前端替换修改
			 			this.markName = this.modifyData
			 		}else{
			 			this.updateUser(this.modifyData,this.type,this.oldPwd)
			 			// 前端替换修改
			 			this.user[this.type] = this.modifyData
			 		}
			 	}
			 	// 访问成功后关闭弹出框
			 	this.modifyfBox()
			 },
		},
	}
</script>

<style lang="scss" scoped>
.content{
	.top-bar {
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
	
	
	.bg{
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		
		.bg-img{
			width: 100%;
			height: 750rpx;
		}
	}
	
	.main{
		margin-top: 360rpx;
	
		.main-inner{
			width: 100%;
			min-height: 720rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
			
			.info{
				padding: $uni-spacing-row-base $uni-spacing-col-base 40rpx;
				box-sizing: border-box;
				border-bottom: 1px solid #eee;
				
				.name{
					float: left;
					font-size: 48rpx;
					font-weight: 600;
					line-height: 66rpx;
					color: #272832;
				}
				
				.time{
					float: right;
					font-size: 28rpx;
					color: rgba(39,40,50,.5);
					line-height: 66rpx;
				}
				
				.notice{
					padding-top: 20rpx;
					font-size: 28rpx;
					color: #272832;
					line-height: 40rpx;
					clear: both;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}
		
		
		.member{
			border-bottom: 1px solid #eee;
			
			.top{
				padding: $uni-spacing-row-base $uni-spacing-col-base 0;
				padding-bottom: 40rpx;
				box-sizing: border-box;
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.title{
					flex:1;
					font-size: 36rpx;
					font-weight: 600;
					color: #272832;
				}
				
				.more{
					float: right;
					padding-right: 20rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(39,40,50,.6);
				}
				
				.more-img{
					width: 32rpx;
					height: 32rpx;
				}
				
				
			}
		}
		
		.member-list{
			width: 100%;
			padding: 20rpx 16rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
		}
		
		.member-li{
			padding-bottom: 32rpx;
			width: 20%;
			text-align: center;
			
			.imgs{
				display: inline-block;
				position: relative;
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
				background-color: $uni-color-primary;
				
				.delete{
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: -16rpx;
					right: -16rpx;
					z-index: 10;
				}
				
				.user-img{
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}
				
				
			}
			
			.name{
				padding: 0 8rpx;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
			
			.user-add{
				width: 104rpx;
				height: 104rpx;
				padding: 32rpx;
				box-sizing: border-box;
			}
		}
		
		
		.groupInfo{
			display: flex;
			flex-direction: column;
			padding-top: 12rpx;
			border-bottom: 1px solid $uni-border-color;
			
			.row {
				display: flex;
				flex-direction: row;
			}
			
			
			.title {
				display: flex;
				align-items: center;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}
					
			.cont {
				flex: 1;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				height: 112rpx;
				line-height: 112rpx; 
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;	
		    }
			
			.group-img{
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				margin-top: 16rpx;
			}
			
			.more {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80rpx;
			
				image {
					width: 28rpx;
					height: 28rpx;
				}
			}
			
			.switch{
				margin-right: 42rpx;
			}
		}

	}
	
	.bottomBtn {
		margin-top: 160rpx;
		text-align: center;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 88rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}
}

		// 修改内容
		.modify{
			position: fixed;
			z-index: 1002;
			// top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background-color: #fff;
			
			.modify-header{
				width: 100%;
				height: 88rpx;
				padding-top: var(--status-bar-height);
				display: flex;
				align-items: center;
				border-bottom: 1px solid $uni-border-color;
				.close{
					padding-left: 32rpx;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 88rpx;
				}
				.title{
					flex: 1;
					text-align: center;
					color: $uni-text-color;
					font-size: 40rpx;
					line-height: 88rpx;
				}
				.define{
					padding-right: $uni-spacing-col-base;
					color:$uni-color-success;
					font-size: $uni-font-size-lg;
					line-height: 88rpx;
				}
			}
			
			.modify-main{
				display: flex;
				padding: $uni-spacing-col-base;
				flex-direction: column;
				
				.modify-password{
					margin-bottom: $uni-spacing-col-base;
					padding: 0 20rpx;
					box-sizing: border-box;
					flex: auto;
					width: 100%;
					height: 88rpx;
					background-color: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 88rpx;
				}
				.modify-content{
					padding: 16rpx 22rpx;
					box-sizing: border-box;
					flex:auto;
					width: 100%;
					height: 386rpx;
					background-color: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
				}
			}
		}
</style>

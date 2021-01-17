<template>
	<view id="search">
		<view class="top-bar">
			<view class="search-div">
				<input class="search-input" type="search" placeholder="请输入用户名/邮箱" placeholder-style="color:#999;font-weight:400"
				 @input="toSearch" />
				<image src="~@/static/images/search/search.png" mode=""></image>
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne">取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user">
				<view class="title" v-show="userArr.length > 0">用户</view>
				<view class="list" v-for="(item,index) in userArr" :key="index">
					<navigator :url="'../userProfile/userProfile?id='+item._id">
						<image :src="item.imgUrl"></image>

						<view class="names">
							<view class="name" v-html="item.userName"></view>
							<view class="email" v-html="item.email"></view>
						</view>
					</navigator>
					<view class="right-btn add" v-if="item.friendType===0" @tap="modifyfBox('添加好友',myName+' 请求添加好友！',item._id)">加好友</view>
					<view v-if="item.friendType === -1"></view>
					<view class="right-btn send" v-if="item.friendType === 1">发消息</view>
				</view>
			</view>
			<view class="search-user">
				<view class="title">群组</view>
				<view class="list">
					<image src="~@/static/images/test/four.jpeg"></image>
					<view class="names group-name">
						<view class="name">讨论群</view>
					</view>
					<view class="right-btn send">发送</view>
				</view>
			</view>
			<view class="modify" :style="{bottom: - + modiyfBoxHeight +'px'}" :animation="animationModifyBox">
				<view class="modify-header">
					<div class="close" @tap="modifyfBox(modifyTitle,modifyData)">取消</div>
					<div class="title">{{modifyTitle}}</div>
					<div class="define" @tap="modifySure">确定</div>
				</view>
				<view class="modify-main">
					<textarea v-model="modifyData" class="modify-content" />
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import datas from '@/common/datas.js' // 获取静态数据的
	import myfun from '@/common/myfun.js'

	export default {
		data() {
			return {
				userArr: [],
				searchval: '',
				uID: '',
				token: '',
				myName: '',
				fID:'',         //  点击请求好友的用户ID
				modiyfBoxHeight:'',
				modifyTitle:'添加好友',				//  被修改的标题
				modifyData:'',		 //  修改的内容
				animationModifyBox:'',      // 弹出框 动画
			}
		},
		onReady(){
			this.getElementStyle()
		},
		onLoad: function() {
			this.getStorages()
		},
		methods: {
			// 获取缓存信息
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uID = value.id
						this.token = value.token
						this.myName = value.userName
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
			// 获取搜索关键词
			toSearch: myfun.debounce(function(e) {
				//搜索后 每次清空 
				this.userArr = []
				// 将搜索的内容存起来
				this.searchval = e.detail.value
				if (this.searchval.length > 0) {
					// 把搜索的内容放入这个方法里
					this.toSearchUser(this.searchval)
				}
			}),
			// 获取关键词匹配的用户
			toSearchUser: function(user) {
				uni.request({
					url: this.serverUrl + "/search/user",
					data: {
						data: user,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let arr = data.data.result
							// 利用正则获取搜索到的
							for (let i = 0; i < arr.length; i++) {
								// 判断是否为好友
								this.isFriend(arr[i])
							}
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
			// 判断是否为好友
			isFriend: function(user,e) {
				// 默认不是好友
				let friendType = 0;
				let exp = eval("/" + e + "/g")
				if (user._id === this.uID) {
					friendType = -1 // 表示是自己
					user.friendType = friendType
					// 将头像也存起来
					user.imgUrl = this.serverUrl  + user.imgUrl;
					// 利用正则将搜索到的内容的字体变个样式
					user.userName = user.userName.replace(exp, `<span style="color:#4AAAFF">${user}</span>`)
					user.email = user.email.replace(exp, `<span style="color:#4AAAFF">${user}</span>`)
					this.userArr.push(user)
				} else {
					uni.request({
						url: this.serverUrl + "/search/isFriend",
						data: {
							uID: this.uID,
							fID: user._id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							// console.log(data)
							let status = data.data.status
							// 访问后端成功
							if (status === 200) {
								// 是好友
								friendType = 1

							} else if (status === 400) {
								// 不是好友
								friendType = 0
							} else if (status === 500) {
								uni.showToast({
									title: '服务器出错了！',
									icon: 'none',
									duration: 1500
								})
							}
							user.friendType = friendType
							// 将头像也存起来
							user.imgUrl = this.serverUrl  + user.imgUrl;
							
							// 利用正则将搜索到的内容的字体变个样式
							user.userName = user.userName.replace(exp, `<span style="color:#4AAAFF">${user}</span>`)
							user.email = user.email.replace(exp, `<span style="color:#4AAAFF">${user}</span>`)
							this.userArr.push(user)
						}
					})
				}
			},
			// 获取高度
			getElementStyle: function () {
			  const query = uni.createSelectorQuery().in(this)
			  query.select('.modify').boundingClientRect(data => {
				this.modiyfBoxHeight = data.height
			  }).exec()
			
			},
			// 弹出 修改框
			modifyfBox:function(type,data,fID){
				this.modifyTitle = type
				this.modifyData = data
				this.fID = fID
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
			if(this.modifyData.length>0){
				uni.request({
							url: this.serverUrl + "/friend/applyFriend",
							data: {
								uID:this.uID,
								fID:this.fID,
								msg:this.modifyData,
								token:this.token
							},
							method: 'POST',
							success: (data) => {
								let status = data.data.status
								// 访问后端成功
								if (status === 200) {
									// 发送好友请求成功					
									uni.showToast({
										title: '好友请求发送成功！',
										icon: 'none',
										duration: 1500
									})
								} else if (status === 300) {
									// token 过期了 需要重新登录再次生成token
									uni.navigateTo({
										url: '../login/login?name=' + this.myName
									});
								} else if (status === 500) {
									uni.showToast({
										title: '服务器出错了！',
										icon: 'none',
										duration: 1500
									})
								}
							}
						})
			}		
				// 要放在请求后边， 这样才能获得 请求内容
				this.modifyfBox()			
			},
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	#search {
		padding-top: var(--status-bar-height);
		.top-bar {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			align-items: center; // 垂直居中
			z-index: 1001;
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			background-color: $uni-bg-color;
			border-bottom: 1px solid #ccc;

			// border: 1px solid red;
			.search-div {
				flex: 1;
				padding: 14rpx 64rpx 14rpx 32rpx;
				position: relative;

				.search-input {
					background-color: $uni-bg-color-grey;
					height: 60rpx;
					width: 100%;
					padding: 0 60rpx 0 12rpx;
					border-radius: 10rpx;
				}

				image {
					position: absolute;
					top: 22rpx;
					right: 10rpx;
					height: 40rpx;
					width: 40rpx;
				}

			}

			.top-bar-right {
				.text {
					font-size: 32rpx;
					padding: 10rpx 24rpx;
					color: #000;
				}
			}

		}

		.main {
			margin-top: 88rpx;

			.title {
				display: inline-block;
				line-height: 60rpx;
				margin-top: 44rpx;
				padding-bottom: 20rpx;
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				padding-left: $uni-spacing-col-base;
			}

			.search-user {

				.list {
					navigator {
						flex: 1;
						display: flex;
					}

					display: flex;
					padding: 20rpx $uni-spacing-col-base;

					image {
						width: 80rpx;
						height: 80rpx;
						background-color: $uni-bg-color-grey;
						border-radius: $uni-border-radius-base;
					}

					.names {
						flex: 1;
						padding-left: $uni-spacing-col-base;

						.email {
							color: $uni-text-color;
							font-size: $uni-font-size-sm;
							line-height: 28rpx;
						}
					}

					.group-name {
						display: flex;
						align-items: center;
					}
				}

				.right-btn {
					width: 120rpx;
					height: 48rpx;
					line-height: 48rpx;
					border-radius: 24rpx;
					font-size: $uni-font-size-sm;
					margin-top: 16rpx;
					text-align: center;
				}

				.send {
					background-color: $uni-color-primary;
					color: $uni-text-color;
				}

				.add {
					background-color: rgba(74, 170, 255, .1);
					color: $uni-color-success;
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
		}
	}
</style>

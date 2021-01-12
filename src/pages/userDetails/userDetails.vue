<template>
	<view id='userDetails'>
		<view class="content">
			<top-bar>
				<view slot="left" class="left" @tap="backOne">
					<image src="~@/static/images/common/back.png" mode=""></image>
				</view>
				<view slot="mid">个人信息</view>
			</top-bar>
			<view class="main">
				<view class="column heads">
					<view class="row head">
						<view class="title">头像</view>
						<view class="cont first-cont">
							<view v-if='ID === uID'>
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image :src="cropFilePath" @tap="upload" class="user-img"></image>
								<canvas id="myCanvas" canvas-id="myCanvas" class="meslist_canvas" crop-width="200" crop-height="200"></canvas>
							</view>
							<image :src="cropFilePath" class="user-img friendImg" v-if='ID !== uID'></image>
						</view>
						<view class="more" v-if='ID === uID'>
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modifyfBox('explain','个性签名',user.explain)" v-if="ID === uID">
						<view class="title">个性签名</view>
						<view class="cont">
							<span>
								{{user.explain}}
							</span>
						</view>
						<view class="more">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" v-if="ID !== uID">
						<view class="title">个性签名</view>
						<view class="cont">
							<span>
								{{user.explain}}
							</span>
						</view>
					</view>
					<view class="row">
						<view class="title">邮箱</view>
						<view class="cont">
							<span>
								{{user.email}}
							</span>
						</view>
					</view>
					<view class="row">
						<view class="title">注册</view>
						<view class="cont">
							<span>
								{{showTime(user.registerDate)}}
							</span>
						</view>
					</view>
				</view>
				<view class="column">
					<view class="row" @tap="modifyfBox('userName','用户名',user.userName)" v-if="ID === uID">
						<view class="title">昵称</view>
						<view class="cont">
							<span>{{user.userName}}</span>
						</view>
						<view class="more">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modifyfBox('markName','备注',markName)" v-if="ID !== uID">
						<view class="title">备注</view>
						<view class="cont">
							<span>{{markName}}</span>
						</view>
						<view class="more">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">性别</view>
						<view class="cont">
							<span>
								<picker @change="bindPickerChange" :value="index" :range="array" v-if="ID === uID">
									<view class="uni-input">{{array[index]}}</view>
								</picker>
								<view class="uni-input" v-if="ID !== uID">{{array[index]}}</view>
							</span>
						</view>
						<view class="more" v-if="ID === uID">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">生日</view>
						<view class="cont">
							<span>
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="ID === uID">
									<view class="uni-input">{{date}}</view>
								</picker>
								<view class="uni-input" v-if="ID !== uID">{{date}}</view>
							</span>
						</view>
						<view class="more" v-if="ID === uID">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modifyfBox('phone','电话',user.phone)" v-if="ID === uID">
						<view class="title">电话</view>
						<view class="cont">
							<span>
								{{user.phone}}
							</span>
						</view>
						<view class="more" v-if="ID === uID">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" v-if="ID !== uID">
						<view class="title">电话</view>
						<view class="cont">
							<span>
								{{user.phone}}
							</span>
						</view>
					</view>
				</view>
				<view class="column" v-if="ID === uID">
					<view class="row" @tap="modifyfBox('password','密码','')">
						<view class="title">密码</view>
						<view class="cont">
							<span>
								*********
							</span>
						</view>
						<view class="more">
							<image src="~@/static/images/userDetails/more.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="bottomBtn" v-if="ID === uID" @tap='quitSigin'>退出登录</view>
				<view class="bottomBtn" v-if="ID !== uID" @tap='deleteFriend'>删除好友</view>
			</view>
			<view class="modify" :style="{bottom: - + modiyfBoxHeight +'px'}" :animation="animationModifyBox">
				<view class="modify-header">
					<div class="close" @tap="modifyfBox(type,modifyTitle,modifyData)">取消</div>
					<div class="title">{{modifyTitle}}</div>
					<div class="define" @tap="modifySure">确定</div>
				</view>
				<view class="modify-main">
					<input v-if="isOldPwd" type="text" v-model="oldPwd" class="modify-password" placeholder="请输入原密码" placeholder-style="color:#999;font-weight:400" />
					<textarea v-model="modifyData" class="modify-content" />
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	import topBar from '../../components/topBar.vue'
	import myfun from  '../../common/myfun.js'

	// 头像裁剪
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		components: {
			topBar,
			ImageCropper
		},
		data() {
			//  format 方法格式化日期
			const currentDate = this.getDate({
				format: true
			})
			return {
				tempFilePath: "",
				cropFilePath: "",
				headimg:"",
				array: ['男', '女', '未知'],
				index: 0,
				ID:'',            //  自己的ID
				uID:'',           //  用户ID
				myName:'',		  //  自己的 userName
				markName:'',      //  给好友取得别称
				token:'',
				user: '' ,     // 存储 数据信息
				genderMap:{
					'male': 0,
					'female': 1,
					'asexual': 2,
				},
				type:'',  // 类型  phone 、 email 等
				date: currentDate,             // 生日日期
				modifyTitle:'',				//  被修改的标题
				modifyData:'',				 //  修改的内容
				oldData:'',					// 原始数据
				isOldPwd:false,				// 是否需要密码
				oldPwd:undefined , 				 // 原始密码
				isModify:false,				// 判断是否要 弹出 修改框
				modiyfBoxHeight:'1500',        // 弹出框 高度
				animationModifyBox:'',      // 弹出框 动画
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(e) {
			this.ID = e.id
			this.getStorages()
			this.getUser()
			this.getMarkName()
		},
		onReady(){
			this.getElementStyle()		
		},
		
		methods: {
			// 获取缓存信息
				
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uID = value.id
						this.token = value.token
						this.myName= value.userName
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
			
			// 获取用户信息	
			getUser :function(){
				uni.request({
					url: this.serverUrl + "/user/detail",
					data: {
						id: this.ID,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let result = data.data.result
							// 处理头像链接
							this.cropFilePath = this.serverUrl + '/user/' + result.imgUrl
							// 处理简介
							if(result.explain === undefined){
								result.explain = '这个人很懒，什么都没有留下...'
							}
							// 处理生日日期
							if(result.birth=== undefined){
								this.date = 'xxxx-xx-xx'
							}else{
								this.date = myfun.birthTime(result.birth)
							}
							// 处理电话
							if(result.phone=== undefined){
								result.phone = 'xxxxxxxxxxx'
							}
							// 处理markName
							if(this.markName.length === 0){
								this.markName = result.userName
							}
							this.genderJudeg(result.gender)
							this.user = result
						//	console.log(this.user)
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
				
			// 获取好友昵称
			getMarkName : function(){
				if(this.ID !== this.uID){
					uni.request({
						url: this.serverUrl + "/user/getFriendMarkName",
						data: {
							uID:this.uID,
							fID:this.ID,
							token:this.token,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							// 访问后端成功
							if (status === 200) {
								let result = data.data.result
								// 如果存在 就显示 markName
								if(result.markName !== undefined){
									this.markName = result.markName
								}
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
			},
					
			// 判断性别
			genderJudeg:function(gender){
				this.index = this.genderMap[gender]
			},
					
			// 返回上一级页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},

			// 选择性别
			bindPickerChange: function(e) {
				// 保存旧值
				let oldIndex = this.index
				const genderSelect = {
					0 : 'male',
					1 : 'female',
					2 : 'asexual'
				}
				// console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
				if(this.index !== oldIndex){
					let gender = genderSelect[this.index]
					this.updateUser(gender,'gender',undefined)
				}
			},
			// 日期选择器
			bindDateChange: function(e) {
				// 保存旧值
				let oldDate = this.date
				
				this.date = e.target.value
				if(this.date !== oldDate){
					this.updateUser(this.date,'birth',undefined)
				}
				
			},
			getDate:function(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
				// this.cropFilePath = e.detail.tempFilePath;
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

				// #endif
			},
			cancel:function() {
				console.log("canceled");
				// this.tempFilePath = "";
			},
			// 修改用户数据
			updateUser :function(data,type,password){
				uni.request({
					url: this.serverUrl + "/user/update",
					data: {
						id:this.uID,
						data: data,
						type:type,
						password:password,
						token:this.token
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
					
						// 访问后端成功
						if (status === 200) {
							uni.showToast({
								title: '修改成功！',
								icon: 'none',
								duration: 1500
							})
							if(type === 'password'){
								// 清除缓存
								uni.removeStorage({
									key:'user',
									success:function(res){
										console.log(res)
									}
								})
								// 用户需要重新登录
								uni.navigateTo({
									url: '../login/login?cgpwd=' + this.myName
								})
							}
						} else if (status === 400) {
							uni.showModal({
							    title: '密码错误',
							    content: '原始密码错误，请重新输入！',
								showCancel:false
							});
						}else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						}
					}
				})
			},
		
			// 获取高度
			getElementStyle: function () {
				  const query = uni.createSelectorQuery().in(this)
				  query.select('.modify').boundingClientRect(data => {
						this.modiyfBoxHeight = data.height
				  }).exec()
				},
			// 弹出 修改框
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
			updateFriendName:function(){
				if(this.modifyData.length > 0 && this.modifyData !== this.oldData){
					uni.request({
						url: this.serverUrl + "/user/modifyFriendMarkName",
						data: {
							uID:this.uID,
							fID: this.ID,
							name:this.modifyData,
							token:this.token
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							// 访问后端成功
							if (status === 200) {
								let result = data.data.result
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
				}
			},
			// 显示注册日期
			showTime: function (date) {
			  return myfun.detailTime(date);
			},
			deleteFriend:function(){
				uni.showModal({
				    content: '确定要删除该好友吗？',
					cancelColor:'#000000',
					confirmColor:'#dd5246',
				    success:  (res) => {
				        if (res.confirm) {
				       uni.request({
				       	url: this.serverUrl + "/friend/deleteFriend",
				       	data: {
				       		uID:this.uID,
				       		fID: this.ID,
				       		token:this.token
				       	},
				       	method: 'POST',
				       	success: (data) => {
				       		let status = data.data.status
				       		// 访问后端成功
				       		if (status === 200) {
				       			let result = data.data.result
								uni.navigateTo({
									url: '../index/index'
								});
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
				        } 
				    }
				});		
			},
			quitSigin:function(){
				uni.showModal({
				    content: '退出登录可能会使你接收不到信息，确定退出？',
					cancelColor:'#000000',
					confirmColor:'#dd5246',
				    success: function (res) {
				        if (res.confirm) {
				          // 清除缓存
				          uni.removeStorage({
				          	key:'user',
				          	success:function(res){
				          		console.log(res)
				          	}
				          })
				          // 用户需要重新登录
				          uni.navigateTo({
				          	url: '../login/login'
				          })
				        } 
				    }
				});				
			}
		}
	}
	
</script>

<style scoped lang="scss">
	#userDetails {
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
			padding-top: 118rpx;
			display: flex;
			flex-direction: column;

			.column {
				display: flex;
				flex-direction: column;
				padding-top: 12rpx;
				border-bottom: 1px solid $uni-border-color;

				.row {
					display: flex;
					flex-direction: row;
				}

				.head {
					height: 148rpx;
				}

				.title {
					display: flex;
					align-items: center;
					padding: 0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}

				.first-cont {
					display: flex;
					align-items: center;
					

					.meslist_canvas {
						position: fixed;
						top: 0;
						width: 200px;
						height: 200px;
						text-align: center;
						visibility: hidden;
					}
					.user-img {
						margin-top: 37rpx;
						width: $uni-img-size-lg;
						height: $uni-img-size-lg;
						border-radius: $uni-border-radius-base;
					}
					.friendImg{
						margin-top: 0;
					}
					
				}

				.cont {

					flex: 1;
					font-size: $uni-font-size-lg;
					color: $uni-text-color-grey;
					line-height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					
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
			}

			.bottomBtn {
				margin-top: 160rpx;
				text-align: center;
				font-size: $uni-font-size-lg;
				color: $uni-color-warning;
				line-height: 88rpx;
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
	}
</style>

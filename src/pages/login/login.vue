<template>
	<view id="login">
		<top-bar>
			<view slot="right">
				<view class="top-right" @tap="toSignup">
					<view class="text">注册</view>
				</view>
			</view>
		</top-bar>
		<view class="logo">
			<image src="~@/static/images/login/logo1.png" @tap="testToken"></image>
		</view>
		<form>
			<view class="main">
				<view class="title">登录</view>
				<view class="login-text">您好，欢迎来到 yike ！</view>
				<view class="inputs">
					<input class="user" type="text" placeholder="请输入用户名/邮箱" placeholder-style="color:#999;font-weight:400"
					 v-model.trim="user" />
					<input class="psw" type="password" placeholder="请输入密码" placeholder-style="color:#999;font-weight:400" v-model.trim="password" />
				</view>
			</view>
			<view class="submit" @tap="login">登录</view>
		</form>
	</view>

</template>

<script>
	import topBar from '@/components/topBar.vue'

	export default {
		name: "login",
		components: {
			topBar,
		},
		data() {
			return {
				user: '',
				password: '',
				token: ''
			}
		},
		onLoad: function(e) {
			if (e.user) {
				this.user = e.user
			} else if (e.name) {
				this.user = e.name
				uni.showModal({
					title: '登录过期',
					content: '请重新登录',
					showCancel: false
				});
			}
			else if (e.cgpwd) {
				this.user = e.cgpwd
				uni.showModal({
					title: '密码修改成功',
					content: '请重新登录',
					showCancel: false
				});
			}
		},
		methods: {
			// 跳转到注册页面
			toSignup: function() {
				uni.navigateTo({
					url: '../signup/signup'
				});
			},
			// 登陆提交
			login: function() {
				uni.request({
					url: this.serverUrl + "/signIn/match",
					data: {
						data: this.user,
						pwd: this.password
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							// 登陆成功
							let result = data.data.back
							// 本地存储用户信息
							try {
								uni.setStorageSync('user', {
									'id': result.id,
									'userName': result.userName,
									'imgUrl': result.imgUrl,
									'token': result.token,
								});
							} catch (error) {
								console.log('数据存储出错:' + error)
							}
							uni.showLoading({
								title: '登录中....'
							});

							setTimeout(function() {
								uni.hideLoading();
								uni.navigateTo({
									url: '../index/index',
								})
							}, 1000);

						} else if (status === 400) {
							uni.showModal({
								title: '登录失败',
								content: '账号或密码错误，请重新输入。',
								showCancel: false
							});
							this.password = ''
						} else if (status === 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 1500
							})
						}
					}
				})
			},
			// 测试token
			testToken: function() {
				uni.request({
					url: "http://192.168.1.107:3000/friend/updateFriendState",
					data: {
						uID: '5ffd3c0cca0c7244e0063d2f',
						fID:'5ff2af82425e1833240defc4'
						// token :this.token
					},
					method: 'POST',
					success: (data) => {
						console.log(data)
					}
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	#login {
		.logo {
			width: 192rpx;
			height: 92rpx;
			padding-top: 176rpx;
			padding-bottom: 54rpx;
			margin-left: auto;
			margin-right: auto;
		}

		.logo image {
			width: 100%;
			height: 100%;
		}

		.main {
			display: flex;
			flex-direction: column;
			padding-left: $uni-spacing-row-lg;
			padding-right: $uni-spacing-row-lg;

			.title {
				font-size: 56rpx;
				color: $uni-text-color;
				font-weight: 500;
				line-height: 80rpx;
			}

			.login-text {
				font-size: 40rpx;
				color: $uni-text-color-grey;
				line-height: 80rpx;
				padding: 14rpx 0;
			}

			.inputs {
				padding-top: $uni-spacing-col-lg;

				input {
					height: 88rpx;
					font-weight: 600;
					color: $uni-text-color;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					padding: 8rpx 0;
					line-height: 88rpx;
					border-bottom: 1px solid $uni-border-color;
				}
			}


		}

		.submit {
			width: 520rpx;
			height: 96rpx;
			margin-top: 120rpx;
			margin-left: auto;
			margin-right: auto;
			line-height: 96rpx;
			background-color: $uni-color-primary;
			box-shadow: 0 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
			border-radius: $uni-border-radius-lg;
			font-size: $uni-font-size-lg;
			font-weight: 600;
			text-align: center;
			color: $uni-text-color;
		}
	}
</style>

<template>
	<view id="signup">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/common/back.png" mode=""></image>
			</view>
			<view slot="right" class="right">
				<view class="close">
					<image src="~@/static/images/signup/colse.png" mode=""></image>
				</view>
			</view>
		</top-bar>
		<view class="logo">
			<image src="~@/static/images/login/logo1.png"></image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input class="email" type="text" placeholder="请取个用户名" placeholder-style="color:#999;font-weight:400" @blur="matchUser" />
					<view class="emloy" v-if="isUserEmloy">用户名已占用</view>
					<image src="~@/static/images/signup/Group.png" mode="" v-if="isUser"></image>
				</view>
				<view class="inputs-div">
					<input class="user" type="text" placeholder="请输入邮箱" placeholder-style="color:#999;font-weight:400" @blur="checkEmail" />
					<view class="emloy" v-if="isEmailEmloy">邮箱已占用</view>
					<view class="invalid" v-if="isInvalid">邮箱无效</view>
					<image src="~@/static/images/signup/Group.png" mode="" v-if="isEmail"></image>
				</view>
				<view class="inputs-div">
					<input class="pwd" :type="type" placeholder="设置您的密码" placeholder-style="color:#999;font-weight:400" @input="getPwd" />
					<image :src="lookUrl" @tap="toggleShow"></image>
				</view>
			</view>
		</view>
		<view class="submit" :class="{noSubmit:isSubmit}" @tap='signUp'>注册</view>
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
				type: "password",
				isUser: false, // 用户名是否可用
				isUserEmloy: false, //用户名是否已占有
				isEmail: false, //  邮箱是否可用
				isEmailEmloy: false, // 邮箱是否已占用
				emailName: '', //  邮箱名
				isInvalid: false, // 邮箱是否无效
				isShow: false, // 是否显示密码
				lookUrl: "../../static/images/signup/hide.png", // 密码图标切换
				isSubmit: true, // 提交注册样式
				userName: '', // 用户名
				password: '', // 密码

			}
		},
		computed: {
			// 注册样式
			isSignup: function() {
				if (this.isUser && this.isEmail && this.password.length > 5) {
					this.isSubmit = false
				} else {
					this.isSubmit = true
				}
				return this.isSubmit
			}
		},
		methods: {
			toggleShow: function() {
				if (!this.isShow) {
					this.type = "password"
					this.isShow = !this.isShow
					this.lookUrl = "../../static/images/signup/hide.png"
				} else {
					this.type = "text"
					this.isShow = !this.isShow
					this.lookUrl = "../../static/images/signup/show.png"
				}
			},
			// 检查邮箱
			checkEmail: function(e) {
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				// console.log(e.detail.value)
				this.emailName = e.detail.value
				// 先判断是否有长度
				if (this.emailName.length > 0) {
					// 使用正则判断邮箱格式
					if (reg.test(this.emailName)) {
						// console.log('邮箱正确')
						this.isInvalid = false
						this.matchEmail()
					} else {
						// console.log('邮箱不正确')
						this.isInvalid = true
						this.isEmailEmloy = false
						this.isEmail = false
					}
				} else {
					this.isInvalid = false
					this.isEmailEmloy = false
					this.isEmail = false
				}
				this.isSignup
			},

			// 匹配用户名   (接口)
			matchUser: function(e) {
				this.userName = e.detail.value
				if (this.userName.length > 0) {
					uni.request({
						url: this.serverUrl + "/signUp/judge",
						data: {
							data: this.userName,
							type: 'userName'
						},
						method: 'POST',
						success: (data) => {
							// console.log(data)
							let status = data.data.status
							// 访问后端成功
							if (status === 200) {
								let result = data.data.result
								if (result > 0) {
									// 表示用户已存在
									this.isUserEmloy = true
									this.isUser = false
								} else {
									// 表示用户不存在
									this.isUserEmloy = false
									this.isUser = true
								}
								this.isSignup
							} else if (status === 500) {
								uni.showToast({
									title: '服务器出错了！',
									icon: 'none',
									duration: 1500
								})
							}
						}
					})
				} else {
					this.isUserEmloy = false
					this.isUser = false
					this.isSignup
				}
			},
			// 匹配邮箱    (接口)
			matchEmail: function() {
				uni.request({
					url: this.serverUrl + "/signUp/judge",
					data: {
						data: this.emailName,
						type: 'email'
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							let result = data.data.result
							if (result > 0) {
								// 表示邮箱已存在
								this.isEmailEmloy = true
								this.isEmail = false
							} else {
								// 表示邮箱不存在
								this.isEmailEmloy = false
								this.isEmail = true
							}
							this.isSignup
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
			// 获取密码
			getPwd: function(e) {
				this.password = e.detail.value
				this.isSignup
			},
			// 完成注册
			signUp: function() {
				uni.request({
					url: this.serverUrl + "/signUp/add",
					data: {
						name: this.userName,
						email: this.emailName,
						pwd: this.password
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							// 注册成功后挑战到登录页
							uni.showToast({
								title: '注册成功,即将跳转到登陆页面！',
								icon: 'none',
								duration: 1500,
							})
							setTimeout(() => {
								uni.navigateTo({
									url: '../login/login?user=' + this.userName
								});
							}, 1500)

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
			// 返回到登陆页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	#signup {
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

				.inputs-div {
					position: relative;

					.emloy,
					.invalid {
						position: absolute;
						right: 0;
						top: 40rpx;
						font-size: $uni-font-size-base;
						font-weight: 500;
						color: $uni-color-warning;
					}

					image {
						position: absolute;
						padding: 10rpx;
						right: 10rpx;
						top: 30rpx;
						width: 40rpx;
						height: 40rpx;
					}
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

		.noSubmit {
			background-color: rgba(39, 40, 50, .2);
			box-shadow: none;
			color: $uni-text-color-inverse;
		}
	}
</style>

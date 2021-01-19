<template>
	<view id="userProfile">
		<top-bar class="top-bar">
			<view slot="left" class="left" @tap="backOne">
				<image src="~@/static/images/common/back.png" mode=""></image>
			</view>
			<view slot="right" class="right" @click="toUserDeatils" v-if="relation === 0 || relation === 1">
				<view class="close">
					<image src="~@/static/images/userProfile/more.png" mode=""></image>
				</view>
			</view>
		</top-bar>

		<view class="main">
			<view class="bg">
				<image :src="user.imgUrl" mode="aspectFill"></image>
			</view>
			<view class="user-header">
				<view class="gender">
					<image :src="genderImg" mode="aspectFill" :animation="animationGender"></image>
				</view>
				<image class="user-img" :src="user.imgUrl" mode="aspectFill" :animation="animationImg"></image>
			</view>
			<view class="user-profile">
				<view class="name">{{markName}}</view>
				<view class="nick">昵称: {{user.userName}}</view>
				<view class="tags">{{user.explain}}</view>
			</view>

		</view>

		<bottom-bar v-if="relation !== 0">
			<view slot="text" @tap="addFriendAnimation(' 请求添加好友！')" v-if="relation === 2">加为好友</view>
			<view slot="text" v-if="relation === 1" @tap="toChatRomm">发消息</view>
		</bottom-bar>

		<view class="add-req" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}" :animation="animationContent">
			<view class="name">{{user.name}}</view>
			<textarea class="req-content" v-model="modifyData" maxlength="120" />
			</view>
        <view class="add-btn" :animation="animationBtn">
            <view class="close" @tap="addFriendAnimation()">取消</view>
            <view class="send" @tap="addSumbit">发送</view>
        </view>
    </view>
</template>

<script>
  import topBar from '@/components/topBar.vue'
  import bottomBar from '@/components/bottomBar.vue'

  export default {
    name: 'userProfile',
    components: {
      topBar,
      bottomBar
    },
    data() {
      return {
		ID:'' , 
		uID:'',
		token:'',
        myName: '',
		markName : '',
        user: {},
		genderImg: '../../static/images/userProfile/asexual.png',
		genderMap:{
			'asexual': '../../static/images/userProfile/asexual.png',
			'male': '../../static/images/userProfile/male.png',
			'female': '../../static/images/userProfile/female.png',
		},
		relation:'',   // 用户关系 0表示你自己， 1表示好友 ， 2 表示陌生人
		modifyData:'',  // 请求内容
        addHeight: '1500',
        windowHeight: '',
        btnHeight: '',
        animationContent: {},  // 动画  (内容区域)
        animationBtn: {}, // 动画1  (按钮区域)
        animationImg: {}, // 动画2  (缩小头像)
        animationGender: {}, // 动画3  (隐藏性别)
        isClose: false,   // 取消按钮 动画
      }
    },
    onReady() {
      this.getElementStyle()

    },
	onLoad(e) {
		this.ID = e.id
		this.getStorages()
		this.getUser()
		this.friendJudeg()
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
					// console.log(data)
					let status = data.data.status
					// 访问后端成功
					if (status === 200) {
						let result = data.data.result
						// console.log(result)
						// 处理头像链接
						result.imgUrl = this.serverUrl  + result.imgUrl  
						// 处理简介
						if(result.explain == ''){
							result.explain = '这个人很懒，什么都没有留下...'
						}
						// 处理markName
						if(this.markName.length === 0){
							this.markName = result.userName
						}
						this.genderJudeg(result.gender)
						this.user = result
						// console.log(this.user)
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
	
		// 判断性别
		genderJudeg:function(gender){
			this.genderImg = this.genderMap[gender]
		},
		
		// 判断用户关系 来显示相应的用户
		
		friendJudeg:function(){
			if(this.ID === this.uID){
				this.relation = 0
			}else {
				// 如果不是自己， 需要进行后端验证
				uni.request({
					url: this.serverUrl + "/search/isFriend",
					data: {
						uID: this.uID,
						fID:this.ID,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status
						// 访问后端成功
						if (status === 200) {
							// 是 好友关系
							this.relation = 1
							this.getMarkName()
						}else if(status === 400){
							//  陌生人关系
							this.relation = 2
							// console.log(this.relation)
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
		
		// 获取好友昵称
		getMarkName : function(){
		  uni.request({
		  	url: this.serverUrl + "/user/getFriendMarkName",
		  	data: {
		  		uID: this.uID,
				fID:this.ID,
		  		token:this.token,
		  	},
		  	method: 'POST',
		  	success: (data) => {
		  		// console.log(data)
		  		let status = data.data.status
		  		// 访问后端成功
		  		if (status === 200) {
		  			let result = data.data.result
		  			if(result.markName !== undefined){
						// 如果存在 就显示 markName
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
	  },
		
		// 返回首页面
		backOne: function () {
			uni.navigateBack({
			delta: 1
			});
		},
		
		// 获取高度
		getElementStyle: function () {
			const query = uni.createSelectorQuery().in(this)
			query.select('.bg').boundingClientRect(data => {
			this.windowHeight = data.height
			this.addHeight = data.height - 186
			}).exec()

		},
		// 添加动画， 具体代码参考uni-app 动画API
		addFriendAnimation: function (data) {
			this.modifyData = data
			this.isClose = !this.isClose
			// 设置内容区域的动画
			let animationContent = uni.createAnimation({
			duration: 300,
			timingFunction: 'ease',
			})
			// 设置按钮区域的动画
			let animationBtn = uni.createAnimation({
			duration: 600,
			timingFunction: 'ease',
			})
			let animationImg = uni.createAnimation({
			duration: 500,
			timingFunction: 'ease',
			})
			let animationGender = uni.createAnimation({
			duration: 200,
			timingFunction: 'ease',
			})

			// 判断是否有取消按钮，， 如果有就点击让它隐藏，
			if (this.isClose) {
			animationContent.top(186).step()
			animationBtn.top(this.windowHeight - 64).step()
			animationImg.width('240rpx').height('240rpx').top('20%').right('30%').step()
			animationGender.opacity(0).step()
			} else {
			animationContent.top(this.windowHeight).step()
			animationBtn.top(this.windowHeight).step()
			animationImg.width('400rpx').height('400rpx').top(0).right(0).step()
			animationGender.opacity(1).step()
			}
			this.animationContent = animationContent.export()
			this.animationBtn = animationBtn.export()
			this.animationImg = animationImg.export()
			this.animationGender = animationGender.export()
		},
	  
		addSumbit:function(){
				// 做一些操作后在 调用modifyfBox
			if(this.modifyData.length>0){
				uni.request({
							url: this.serverUrl + "/friend/applyFriend",
							data: {
								uID:this.uID,
								fID:this.ID,
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
				this.addFriendAnimation()			
			} ,
			// 跳转用户详情页面
			toUserDeatils:function(){
				uni.navigateTo({
					url: '../userDetails/userDetails?id=' + this.ID
				});
			},
			// 跳转聊天页面
			toChatRomm:function(){
				let name = this.user.userName
				if(this.markName){
					name = this.markName
				}else{
					name = this.user.userName
				}	
				uni.navigateTo({
					url: `../chatRoom/chatRoom?id=${this.user._id}&name=${name}&img=${this.user.imgUrl}&type=${0}`
				});
			},
    },
		
 
  }
</script>

<style lang="scss" scoped>
    #userProfile {
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


        .main {
            padding-top: 168rpx;

            .bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -2;

                image {
                    position: absolute;
                    z-index: -1;
                    left: -10rpx;
                    top: -10rpx;
                    width: 100%;
                    height: 100%;
                    filter: blur(32rpx);
                    opacity: .6;
                }
            }

            .user-header {
                margin: 0 auto;
                position: relative;
                width: 412rpx;
                height: 412rpx;

                .gender {
                    position: absolute;
                    bottom: 16rpx;
                    right: 16rpx;
                    z-index: 11;
                    width: 64rpx;
                    height: 64rpx;
                    border-radius: $uni-border-radius-circle;

                    image {
                        width: 100%;
                        height: 100%;
                    }
                }

                .user-img {
                    z-index: 10;
                    top: 0;
                    right: 0;
                    width: 400rpx;
                    height: 400rpx;
                    border-radius: 48rpx;
                    border: 6rpx solid rgba(255, 255, 255, 1);
                    box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, .2);
                }
            }

            .user-profile {
				display: flex;
				flex-direction: column;
				align-items: center;
                padding-top: 48rpx;
                text-align: center;

                .name {
                    height: 74rpx;
                    line-height: 74rpx;
                    font-size: 52rpx;
                    color: $uni-text-color;
                }

                .nick {
                    font-size: $uni-font-size-base;
                    color: $uni-text-color;
                }

                .tags {
                    padding: 20rpx 100rpx;
                    font-size: $uni-font-size-base;
                    
                }
            }


        }

        .add-req {

            position: fixed;
            // top: 0;
            width: 100%;
            // height: 1252rpx;
            box-sizing: border-box;
            z-index: 9;
            padding: 0 56rpx;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 40rpx 40rpx 0 0;

            .name {
                padding: 198rpx 0 40rpx;
                font-size: 52rpx;
                line-height: 74rpx;
                color: $uni-text-color;
            }

            .req-content {
                padding: 18rpx 22rpx;
                box-sizing: border-box;
                width: 100%;
                height: 420rpx;
                background-color: $uni-bg-color-grey;
                border-radius: $uni-border-radius-base;
                font-size: $uni-text-color;
                line-height: 44rpx;
            }
        }


        .add-btn {
            position: fixed;
            bottom: -164rpx;
            width: 100%;
            height: 124rpx;
            box-sizing: border-box;
            padding: 12rpx $uni-spacing-col-base;
            z-index: 100;
            display: flex;

            .close {
                width: 127rpx;
                text-align: center;
                line-height: 80rpx;
                height: 80rpx;
                font-size: $uni-font-size-lg;
                color: $uni-text-color;
                background-color: $uni-bg-color-grey;
                border-radius: $uni-border-radius-sm;
            }

            .send {
                flex: 1;
                text-align: center;
                line-height: 80rpx;
                height: 80rpx;
                margin-left: $uni-spacing-col-base;
                font-size: $uni-font-size-lg;
                color: $uni-text-color;
                background-color: $uni-color-primary;
                border-radius: $uni-border-radius-sm;
            }
        }

    }
</style>

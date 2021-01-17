<template>
	<view>
		<view class="upload">
			<button @click="upload">上传测试专利</button>
			<image v-for="(item,index) in img" :key='index' :src="item"></image>
		</view>
	</view>
</template>

<script>
	import myfun from '../../common/myfun.js'
	
	export default {
		data() {
			return {
				id: 'hsdiadhanyxgd',
				img: []
			}
		},
		methods: {
			upload: function() {
				let url = myfun.fileNmae(new Date())
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
								url: this.serverUrl +'/files/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								name: 'file',
								formData: {
									url: url,
									name: this.id + new Date().getTime() + i,
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes)
									let path = this.serverUrl + uploadFileRes.data
									this.img.push(path)
									// console.log(uploadFileRes.data);
								}
							});
							// uploadTask.onProgressUpdate((res) => {
							// 	console.log('上传进度' + res.progress);
							// 	console.log('已经上传的数据长度' + res.totalBytesSent);
							// 	console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

							// });
						}
					}
				});
			}
		}
	}
</script>

<style lang='scss' scoped>
	.upload {
		padding-top: 80rpx;
		text-align: center;
		margin-bottom: 30rpx;

		button {
			width: 300rpx;
			padding: 10rpx;
			font-size: 18rpx;
			background-color: #4fdbfd;
			color: #fff;
			outline: none;
			border: none;
		}
	}
</style>

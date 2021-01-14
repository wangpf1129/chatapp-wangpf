export default {
	// 用户
	users: function() {
		let friendsData = [{
				id: 1,
				tips: 1,
				imgUrl: 'one.jpeg',
				name: '张三',
				email: 'zhangsan@163.com',
				time: new Date(),
				news: '布会上，喀什地区疾病预防控制中心副主任王希江通报，24'
			},
			{
				id: 2,
				tips: 123,
				imgUrl: 'two.jpeg',
				name: '李四',
				email: 'lisi@163.com',
				time: new Date(),
				news: '我们立即启动全员免费核酸检测，经过3天'
			},
			{
				id: 3,
				tips: 14,
				imgUrl: 'three.jpeg',
				name: '斯内克',
				email: 'sineike@qq.com',
				time: new Date(),
				news: '相信现在有好多小伙伴们拿这手机都在看中国首次发掘北魏皇家祭天遗址事情吧'
			},
			{
				id: 4,
				tips: 0,
				imgUrl: 'four.jpeg',
				name: '王五',
				email: 'wangwu@qq.com',
				time: new Date(),
				news: '成喀什地区全员核酸检测，除已报告的疏附县18'
			},
			{
				id: 5,
				tips: 32,
				imgUrl: 'five.jpeg',
				name: '克风',
				email: 'kefeng@163.com',
				time: new Date(),
				news: '日报讯（文/记者 记者 康颢严 图/记者 '
			},
			{
				id: 6,
				tips: 15,
				imgUrl: 'six.jpeg',
				name: '灭星',
				email: 'meixing@163.com',
				time: new Date(),
				news: '相信现机都在看中国首次发掘北魏皇家祭天遗址事情吧'
			},

		]
		return friendsData
	},
	// 好友关系
	isFriend: function() {
		let isfriend = [{
				userID: 1,
				friendID: 2
			},
			{
				userID: 1,
				friendID: 4
			},
			{
				userID: 1,
				friendID: 6
			}

		]
		return isfriend;
	},

	// 聊天信息
	message: function() {
		let msgs = [{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '拜拜~~~',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000, // 发送时间
				tip: 0

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '拜拜~',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 5, // 发送时间
				tip: 2

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '嗯嗯，你去把',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 16, // 发送时间
				tip: 1

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '我去吃饭了，有空再聊',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60, // 发送时间
				tip: 2

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '厉害啊，',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 36, // 发送时间
				tip: 3

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: 'eight.jpeg',
				types: 1, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 40, // 发送时间
				tip: 4

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: 'three.jpeg',
				types: 1, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 57, // 发送时间
				tip: 5

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '瞧瞧我在做什么，嘻嘻',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 57 * 20, // 发送时间
				tip: 5

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '01.png',
				types: 1, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 40, // 发送时间
				tip: 4
			
			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '02.jpg',
				types: 1, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 57 * 50, // 发送时间
				tip: 5
			
			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '很好啊，',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 57 * 60*2, // 发送时间
				tip: 5

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '最近还好吗？',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 57 * 60 * 10, // 发送时间
				tip: 4

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '哦哦，原来是你啊',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 57 * 60 * 20, // 发送时间
				tip: 5

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: 'one.jpeg',
				types: 1, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 57 * 60 * 30, // 发送时间
				tip: 4

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: '我是都帝啊，给你看看我的照片',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 57 * 60 * 40, // 发送时间
				tip: 3

			},
			{
				id: 'b', //用户id
				imgUrl: 'two.jpeg',
				message: '你是？',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 57 * 60 * 50, // 发送时间
				tip: 5

			},
			{
				id: 'a', //用户id
				imgUrl: 'one.jpeg',
				message: 'hello，在吗',
				types: 0, // 内容类型 （0文字，1图片链接，2音频链接，3位置链接）
				time: new Date() - 1000 * 60 * 57 * 60 * 60 , // 发送时间
				tip: 3

			},

		]
		return msgs
	}

}

export default {
	// 用户
    users: function () {
        let friendsData = [{
            id: 1,
            tips: 1,
            imgUrl: 'one.jpeg',
            name: '张三',
			email:'zhangsan@163.com',
            time: new Date(),
            news: '布会上，喀什地区疾病预防控制中心副主任王希江通报，24'
        },
            {
                id: 2,
                tips: 123,
                imgUrl: 'two.jpeg',
                name: '李四',
				email:'lisi@163.com',
                time: new Date(),
                news: '我们立即启动全员免费核酸检测，经过3天'
            },
            {
                id: 3,
                tips: 14,
                imgUrl: 'three.jpeg',
                name: '斯内克',
				email:'sineike@qq.com',
                time: new Date(),
                news: '相信现在有好多小伙伴们拿这手机都在看中国首次发掘北魏皇家祭天遗址事情吧'
            },
            {
                id: 4,
                tips: 0,
                imgUrl: 'four.jpeg',
                name: '王五',
				email:'wangwu@qq.com',
                time: new Date(),
                news: '成喀什地区全员核酸检测，除已报告的疏附县18'
            },
            {
                id: 5,
                tips: 32,
                imgUrl: 'five.jpeg',
                name: '克风',
				email:'kefeng@163.com',
                time: new Date(),
                news: '日报讯（文/记者 记者 康颢严 图/记者 '
            },
            {
                id: 6,
                tips: 15,
                imgUrl: 'six.jpeg',
                name: '灭星',
				email:'meixing@163.com',
                time: new Date(),
                news: '相信现机都在看中国首次发掘北魏皇家祭天遗址事情吧'
            },

        ]
        return friendsData
    },
	// 好友关系
	isFriend:function(){
		let isfriend = [
			{
				userID:1,
				friendID:2
			},
			{
				userID:1,
				friendID:4
			},
			{
				userID:1,
				friendID:6
			}

		]
		return isfriend;
	}
}
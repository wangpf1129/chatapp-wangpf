export default {
  dateTime(time) {
    let old = new Date(time)
    let now = new Date()
    // 获得 传入参数的 时间
    let d = old.getTime()
    let h = old.getHours()
    let m = old.getMinutes()
    let D = old.getDate()
    let M = old.getMonth() + 1
    let Y = old.getFullYear()

    // 获得现在的时间
    let nd = now.getTime()
    let nh = now.getHours()
    let nm = now.getMinutes()
    let nD = now.getDate()
    let nM = now.getMonth() + 1
    let nY = now.getFullYear()

    // 显示当天的时间  00:00
    if (D === nD && M === nM && Y === nY) {
      if (m < 10) {
        m = '0' + m
      }
      if (h < 10) {
        h = '0' + h
      }
      return h + ':' + m
    }

    // 显示 昨天的时间  昨天 00:00
    if (D + 1 === nD && M === nM && Y === nY) {
      if (m < 10) {
        m = '0' + m
      }
      if (h < 10) {
        h = '0' + h
      }
      return '昨天' + h + ':' + m
    } else {
      return Y + '/' + M + '/' + D
    }
  },
  
  
  
  // 详细时间
  detailTime(time) {
    let old = new Date(time)
    let now = new Date()
    // 获得 传入参数的 时间
    let d = old.getTime()
    let h = old.getHours()
    let m = old.getMinutes()
    let D = old.getDate()
    let M = old.getMonth() + 1
    let Y = old.getFullYear()
	
	// 处理时间
	if(M<10){
		M = '0' + M
	}
	if(D<10){
		D = '0' + D
	}
	if(h<10){
		h = '0' + h
	}
	if(m<10){
		m = '0' + m
	}
	return Y + '-' + M + '-' + D + ' ' + h + ':' + m
  },
  
  
  // 生日日处理
  birthTime(time) {
    let old = new Date(time)
    let now = new Date()
    // 获得 传入参数的 时间
    let D = old.getDate()
    let M = old.getMonth() + 1
    let Y = old.getFullYear()
  	
  	// 处理时间
  	if(M<10){
  		M = '0' + M
  	}
  	if(D<10){
  		D = '0' + D
  	}
  	return Y + '-' + M + '-' + D 
  },
  
  //搜索用户  （防抖节流）
  debounce(fn,delay = 500){
	  let timer
	  return function(){
		  let args = arguments
		  if(timer){
			 clearTimeout(timer)
		  }
		  timer = setTimeout(()=>{
			  timer = null
			  fn.apply(this,args)
		  },delay)
	  }
  }
}
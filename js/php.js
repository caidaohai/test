$(function(){
	//解析并设置白天还是黑夜
	 var style = localStorage.getItem("style");
	 if(style == null){
		 style = 'light';
	 }

	var main_toggle_style = $('.chose-color').find('.main-toggle-style');
	if(style == 'light'){
		$('.chose-color').addClass('light').removeClass('dark');
		if(main_toggle_style.length > 0){
			main_toggle_style.find('.light').removeClass('btn-default').addClass('btn-primary');
			main_toggle_style.find('.dark').attr('title','切换成夜间模式');
		}
	}else{
		$('.chose-color').addClass('dark').removeClass('light');
		if(main_toggle_style.length > 0){
			main_toggle_style.find('.dark').removeClass('btn-default').addClass('btn-primary');
			main_toggle_style.find('.light').attr('title','切换成白天模式');
		}
	}
	//结束
	
	//点击切换白天/晚上设置
	$('.main-toggle-style .light').click(function(){
		if($(this).hasClass('btn-primary')){
			return false;
		}else{
			$('.chose-color').addClass('light').removeClass('dark');
			$(this).removeClass('btn-default').addClass('btn-primary');
			$(this).next().removeClass('btn-primary').addClass('btn-default');
			localStorage.setItem("style",'light');
		}
	})
	
	$('.main-toggle-style .dark').click(function(){
		if($(this).hasClass('btn-primary')){
			return false;
		}else{
			$('.chose-color').addClass('dark').removeClass('light');
			$(this).removeClass('btn-default').addClass('btn-primary');
			$(this).prev().removeClass('btn-primary').addClass('btn-default');
			localStorage.setItem("style",'dark');
		}
	})
	//结束
	
	//读取xml 内容
	var content_list = $('.chose-color').find('.content-list');
	if(content_list.length > 0 ){
		$.ajax({  
			url: 'data.xml',  
			type: 'GET',  
			dataType: 'xml',  
			timeout: 1000,  //设定超时  
			cache: false,   //禁用缓存  
			error: function(xml) {  
				alert("加载XML文档出错!");  
			},  
			success: function(data) {
				var chapter_title = $(data).find('chapter>title');
				var title_count = chapter_title.length;
				var html = '';
				if(title_count > 0){
					for(var i =0 ;i < title_count;i++){
						html += '<div class="col-sm-12 col-xs-12">'+chapter_title.eq(i).text()+'</div>';
					}
				}
				content_list.append(html);
			}
		}); 
	}
	
	
})
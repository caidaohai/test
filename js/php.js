$(function(){
	//初始化
	$('.chose-color').height($(window).height());
	//结束
	
	//解析并设置白天还是黑夜
	 style = localStorage.getItem("style");
	 if(style == null){
		 style = 'light';
	 }

	var main_toggle_style = $('.chose-color').find('.main-toggle-style');
	if(style == 'light'){
		$('.chose-color').addClass('light').removeClass('dark');
		$('body').removeClass('dark').removeClass('light').addClass('light');
		if(main_toggle_style.length > 0){
			main_toggle_style.find('.light').removeClass('btn-default').addClass('btn-primary');
			main_toggle_style.find('.dark').attr('title','切换成夜间模式');
		}
	}else{
		$('.chose-color').addClass('dark').removeClass('light');
		$('body').removeClass('dark').removeClass('light').addClass('dark');
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
			$('body').addClass('light').removeClass('dark');
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
			$('body').addClass('dark').removeClass('light');
			localStorage.setItem("style",'dark');
		}
	})
	//结束
	
	//读取xml 内容,获取各章节的标题
	var content_list = $('.chose-color').find('.content-list');
	if(content_list.length > 0 ){
		chapter_title =  localStorage.getItem("chapter_title");
		if(chapter_title == null){
			get_chapter_title();
			chapter_title =  localStorage.getItem("chapter_title");
		}
		chapter_title = JSON.parse(chapter_title);
		var title_count = chapter_title.length;
		var html = '';
		if(title_count > 0){
			for(var i =0 ;i < title_count;i++){
					var flag = Number(i) + 1;
					html += '<div class="col-sm-12 col-xs-12 sub-content-list"  data-num = "'+i+'"><span class="title">'+flag+'.&nbsp;'+chapter_title[i]+'</span><div class="c-title"></div></div>';
			}
		}
		content_list.append(html);
	}
	//结束
	
	//点击获取子章节题目
	$(document).on('click','.sub-content-list .title',function(){
		if($(this).parent().find('.c-title').is(":hidden")){
			var list_num = $(this).parent().attr('data-num');
			sub_chapter_title =  localStorage.getItem("sub_chapter_title");
			if(sub_chapter_title == null){
				get_sub_chapter_title();
				sub_chapter_title =  localStorage.getItem("sub_chapter_title");
			}	
			sub_chapter_title = JSON.parse(sub_chapter_title);
			var title_count = sub_chapter_title[list_num].length;
			var html = '';
			if(title_count > 0){
				for(var i =0 ;i < title_count;i++){
						var flag = Number(i) + 1;
						html += '<div class="col-sm-12 col-xs-12 sub-sub-content-list"  data-num = "'+i+'">'+flag+'.&nbsp;'+sub_chapter_title[list_num][i]+'</div>';
				}
			}
			$(this).parent().find('.c-title').empty().append(html).show();
		}else{
			$(this).parent().find('.c-title').hide();
		}
	})
	//结束
	
	$('.clearall').click(function(){
		localStorage.clear();
	})
	
	//加载详细的学习页
    $(document).on('click','.sub-sub-content-list',function(){
		var chapter_num = $(this).parent().parent().attr('data-num');
		var sub_chapter_num = $(this).attr('data-num');
		var sub_chapter_content =  localStorage.getItem("sub_chapter_content_"+chapter_num+"_"+"_"+sub_chapter_num); 
		if(sub_chapter_content ==  null){
			get_chapter_content(chapter_num,sub_chapter_num);
			sub_chapter_content =  localStorage.getItem("sub_chapter_content_"+chapter_num+"_"+"_"+sub_chapter_num); 
		}
		sub_chapter_content = JSON.parse(sub_chapter_content);
		var html = '';
		var content_count = sub_chapter_content.length;
		if(content_count > 0){
			for(var i =0 ;i < content_count;i++){
				var flag = Number(i) + 1;
				html += '<div class="col-sm-12 col-xs-12 sub-sub-content"  data-num = "'+i+'">'+sub_chapter_content[i]+'</div>';
			}
		}
		$('.list').hide();
		$('.top_content h2').html($(this).text());
		$('.content-main').empty().append(html);
		$('.content').show();
	})
	//结束
	
	//返回列表页
	$(document).on('click','.top_content_button button',function(){
		$('.list').show();
		$('.content').hide();
	})
})
//获取各子章节的标题
function get_sub_chapter_title(){
	var subchapter_title_save = [];
	var subchapter_title_obj = '';
	var subchapter_title_count = '';
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
				var subchapter_obj = $(data).find('chapter');
				var subchapter_count = subchapter_obj.length;
				if(subchapter_count > 0){
					for(var i =0 ;i < subchapter_count;i++){
						subchapter_title_save[i] = [];
						subchapter_title_obj = subchapter_obj.eq(i).find('subchapter>title');
						subchapter_title_count = subchapter_title_obj.length;
						for(var j =0 ;j < subchapter_title_count;j++){
							subchapter_title_save[i][j] =  subchapter_title_obj.eq(j).text();
						}
					}
					 localStorage.setItem("sub_chapter_title",JSON.stringify(subchapter_title_save));
				}
			}
		}); 
}

//获取各章节的标题
function get_chapter_title(){
	var chapter_title_save = [];
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
				var chapter_title_obj = $(data).find('chapter>title');
				var title_count = chapter_title_obj.length;
				if(title_count > 0){
					for(var i =0 ;i < title_count;i++){
						chapter_title_save[i] = chapter_title_obj.eq(i).text();
					}
					 localStorage.setItem("chapter_title",JSON.stringify(chapter_title_save));
				}
			}
		}); 
}

//获取第chapter_num章,sub_chapter_num子章的内容
function get_chapter_content(chapter_num,sub_chapter_num){
	var chapter_content_save = [];
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
				var content_obj = $(data).find('chapter').eq(chapter_num).find('subchapter').eq(sub_chapter_num).find('data');
				var content_obj_count = content_obj.length;
				if(content_obj_count > 0){
					for(var i =0 ;i < content_obj_count;i++){
						chapter_content_save[i] = content_obj.eq(i).html();
					}
					 localStorage.setItem("sub_chapter_content_"+chapter_num+"_"+"_"+sub_chapter_num,JSON.stringify(chapter_content_save));
				}
			}
		}); 
}
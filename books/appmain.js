$(function(){
	var bookModal = $('#bookModaldialog');
	var book_template = null;
	var book_modal_template = null;
	var searchResult = null;
	var advancedSearchResult = [];
	/*fetch book result template - starts */
	$.ajax({
		url:'book-template',
		success : function(response){
			book_template = Handlebars.compile(response);
		},
		error : function(){
			console.log('Error in fetching book template');
		}
	});
	/*fetch book result template - ends */
	/*fetch template for book modal dialog*/
	$.ajax({
		url:'book-modal-template',
		success : function(response){
			book_modal_template = Handlebars.compile(response);
		},
		error : function(){
			console.log('Error in fetching book modal template');
		}
	});
	/*fetch template for book modal - ends */


	var clearSearchResult = function(){
		$('#resultDIV').empty();
		$('#showMore').css('display','none');
	}

	var showBookModal = function(e){
		e.preventDefault();
		var modalDiv = $(e.target).closest('div.resultItem');
		var clickedBookID = modalDiv.attr('bookid');
		pega.utils.spinner.show('Wait_spinner');
		$.ajax({
			url : searchResult.getDomain()+"book/"+clickedBookID,
			success : function(response){
				bookModal.find('.modal-align-cell').empty().append(book_modal_template(response));
				bookModal.css('display','block');
			},
			error : function(){
				var msgDiv = $('<div class="error-div">');
				msgDiv.append($('<p>').text('Error is fetching book details'))
				$('<div class="modal-content">').append(msgDiv);
			},
			complete : function(){
				if(pega.utils.spinner.isSpinnerVisible('Wait_spinner')){
					pega.utils.spinner.hide('Wait_spinner');
				}
			}
		});
		
		
	}

	var showResult = function(){
		if(searchResult.hasNextPage() && !($('#advOpt').is(":checked"))){
			searchResult.getNextPage(displaySearchResults);
		}else if(searchResult.hasNextPage() && ($('#advOpt').is(":checked"))){
			searchResult.getNextPage(prepareSearchResult);
		}else{
			alert('That\'s all folks');
		}
	}

	var prepareSearchResult = function(pageResult){
		var title = searchResult.getSearchText().toLowerCase();
		$.each(pageResult,function(index, value){
			if(value.Title.toLowerCase().indexOf(title) != -1){
				advancedSearchResult.push(value);
			}
		});
		if(advancedSearchResult.length >= 10 || !searchResult.hasNextPage()){
			displaySearchResults(advancedSearchResult);
			advancedSearchResult = [];
		}else{
			searchResult.getNextPage(prepareSearchResult);
		}
	}

	var displaySearchResults = function(pageResult){
		var ShowMore = $('#showMore');
		pageResult["CurrentPage"] = searchResult.currentPage();
		pageResult["TotalPages"] = searchResult.totalPages();
		$('#resultDIV').append(book_template(pageResult));
		ShowMore.css('display','block');
		if(!searchResult.hasNextPage()){
			ShowMore.find('.msgonfind').text('No More Result');
		}else{
			var msg = 'Show '+(searchResult.currentPage()+1)+" of "+searchResult.totalPages();
			ShowMore.find('.msgonfind').text(msg);
		}
	}

	$('#searchbtn').on('click',function(){		
		searchtext = $('#searchtext').val();
		if(!searchtext){
			return;
		}	
		clearSearchResult();
		searchResult = new pega.search(searchtext,searchReady);
		
	});

	var searchReady = function(){
		if(searchResult.totalPages() == 0){
			alert('No Result found!');
		}
		else{
			showResult();
		}
	}

	$('#resultDIV').on('click',function(evt){
		if(evt.target.nodeName != 'BUTTON'){
			return;
		}
		showBookModal(evt);
	});

	bookModal.on('click',function(e1){
		if(e1.target.nodeName != 'BUTTON' || !$(e1.target).hasClass('close-modal-dialog')){
			return;
		}
		$(e1.target).closest('div.modalWrraper').css('display','none');
	});

	$('#showMore').on('click',function(evt){
		if(evt.target.nodeName != 'BUTTON'){
			return;
		}
		showResult(); 
	});

	
});
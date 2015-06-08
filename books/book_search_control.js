var pega = pega || {};
(function(){
	var domain = 'http://it-ebooks-api.info/v1/'
	var newSearch = function(name,oSuccess){
		var errorCode = "0";
		var totalPages = 0;
		var currentPage = 0;
		var result = null;
		var searchText = name;
		pega.utils.spinner.show('Wait_spinner');
		$.ajax({
			url : domain+"search/"+name,
			success : function(response){
				errorCode = response.Error;
				var total = response.Total;
				totalPages = Math.floor(total/10)+((total%10)>0?1:0);
				result = response.Books;
				oSuccess();
			},
			error : function(){
				pega.spinner.show('Wait_spinner');

			},
			complete : function(){
				if(pega.utils.spinner.isSpinnerVisible('Wait_spinner')){
					pega.utils.spinner.hide('Wait_spinner');
				}
			}
		});
		return {
			getSearchText : function(){
				return searchText;
			},
			getNextPage : function(oComplete){
				if(!this.hasNextPage()){
					throw "NO More pages";
				}
				if(currentPage == 0){
					currentPage++;
					oComplete(result);
				}else{
					pega.utils.spinner.show('Wait_spinner');
					/*Make ajax call to fetch next page*/
					$.ajax({
						url : domain+"search/"+name+"/page/"+(currentPage+1),
						success : function(response){
							result = response.Books;
							currentPage++;
							oComplete(result);
						},
						error : function(){

						},
						complete : function(){
							if(pega.utils.spinner.isSpinnerVisible('Wait_spinner')){
								pega.utils.spinner.hide('Wait_spinner');
							}
						}
					});
				}
				//return result;
			},
			hasNextPage : function(){
				return currentPage < totalPages;
			},
			currentPage : function(){
				return currentPage;
			},
			totalPages : function(){
				return totalPages;
			},
			getDomain : function(){
				return domain;
			}
		};
	};

	pega.search = newSearch;

})(pega)
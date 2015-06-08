var pega = pega || {};
(function(){

	/*Map API Starts*/
	var Map = function() {
	    var keys = new Array();
	    var data = new Object();

	    return{
	    	entrys :  function () {
			    var len = keys.length;
			    var entrys = new Array(len);
			    for (var i = 0; i < len; i++) {
			        entrys[i] = {
			            key: keys[i],
			            value: data[i]
			        };
			    }
			    return entrys;
			},
			put : function (key, value) {
			    if (data[key] == null) {
			        keys.push(key);
			    }
			    data[key] = value;
			},
			get : function (key) {
			    return data[key];
			},
			remove : function (key) {
			    keys.remove(key);
			    data[key] = null;
			},
			size : function(){
				return keys.length;
			},
			isEmpty : function(){
				return keys.length == 0;
			},
			each : function (fn) {
			    if (typeof fn != 'function') {
			        return;
			    }
			    var len = keys.length;
			    for (var i = 0; i < len; i++) {
			        var k = keys[i];
			        fn(k, data[k], i);
			    }
			}
	    }
	    
	};
	/*Map API ends*/

	var book = function(inputs){
		return{
			ID : inputs.ID,
			title : inputs.Title,
			subTitle : inputs.SubTitle,
			description : inputs.Description,
			bookImage : inputs.Image
		}
	}

	var searchResult = function(input){
		var bookList = [];
		$.each(input.Books, function(index,value){
			//bookList.push(new book(value));
			bookList.push(value);
		})
		return{
			error : input.Error,
			time : input.Time,
			total : input.Total,
			page : input.Page,
			books : bookList
		}
	}

	

	pega.book = book;
	pega.searchResult = searchResult;
})(pega)
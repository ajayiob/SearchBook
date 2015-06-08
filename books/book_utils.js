var pega = pega || {};
(function(){
	var spinner = {
		show : function(spinnerID){
			$('#'+spinnerID).show();
		},
		hide : function(spinnerID){
			$('#'+spinnerID).hide();
		},
		isSpinnerVisible : function(spinnerID){
			return $('#'+spinnerID).is(':visible');
		}
	};

	var progressBar = function(getCurrentValue,getMaxValue){
		var isProgressRunning = false;
		var timer_obj = null;
		return{
			showProgressBar : function(){
				var busy_indicator = $('#progress-div');
				if(!isProgressRunning){
					busy_indicator.show();
					timer_obj = setInterval(function () {
						var completion_per = (getCurrentValue()*100)/getMaxValue();
						busy_indicator.find('#wait-msg').text(Math.round(completion_per)+"% Completed...");
						busy_indicator.find('.progress-bar').width(completion_per+"%");
						if(completion_per == 100){
							window.clearInterval(timer_obj);
						}
					}, 500);
					isProgressRunning = true;	
				}
				

			},
			stopProgress : function(){
				if(isProgressRunning){
					busy_indicator.hide();
					window.clearInterval(timer_obj);
					isProgressRunning = false;	
				}
			},
			isProgressIndicatorRunning : function(){
				return isProgressRunning;
			}
		}

	}

	pega.utils = {};
	pega.utils.spinner = spinner;

	pega.utils.progressBar = progressBar;
})(pega)
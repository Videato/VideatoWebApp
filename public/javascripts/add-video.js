var categoryObjs = [];

function addCategoriesToHTML(jsonData) {
	var htmlToInsert;
	var category;
	var categoryId;
	var categoryTitle;
	
	for (var i = 0; i < jsonData.length; i++) {
	    category = jsonData[i];
	    categoryTitle = category.name;
	    categoryId = category.objectId;
	    htmlToInsert = "<option>" + categoryTitle + "</option>";

		$('.category-dropdown').append(htmlToInsert);
		categoryObjs[i] = {
			'title' : categoryTitle,
			'id' : categoryId
		}
	}
}

function getCategories() {
	console.log('Attempting to retrieve categories');
	var categoriesUrl = "https://videato-api.herokuapp.com/categories";
	var returnData;

	$.ajax({
		type:'GET',
		url: categoriesUrl,
		dataType: 'json',	
	})
	.done(function (data) {
		addCategoriesToHTML(data);
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

function postVideo(videoObj) {
	console.log('Attempting to post a video');
	var categoriesUrl = "https://videato-api.herokuapp.com/videos";
	var returnData;

	$.ajax({
		type:'POST',
		url: categoriesUrl,
		dataType: 'json',	
		data: videoObj 
	})
	.done(function (data) {
		console.log('successfully posted a video');
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}


function parseURL(url) {
	/* link is a youtube url */
	if (url.indexOf("youtube.com") > -1) {
		return url.replace('watch?v=', 'embed/');
	}
	/* link is a vimeo url */
	else if (url.indexOf("vimeo")  > -1) {
		/* Extract video id from the Vimeo Url. should be the last elemnt of the url */
		var vimeoVidId = url.substring(url.lastIndexOf("/") + 1);
		console.log("Adding vimeo video: " + vimeoVidId);
		return "http://player.vimeo.com/video/" + vimeoVidId + "?color=a8a8a8"; 
	}
	else {
		alert("Only Youtube and Vimeo Urls are currently supported");
		return '';
	}
}

$(document).ready(function(){
	getCategories();

	$("#addVideoBtn").click(function(){
		/* Input form values */
		var videoTitle = $("#inputTitle").val();
        var videoDescription = $("#inputDescription").val();
        var videoUrl = $("#inputUrl").val();;
        var videoCategory = $("#inputCategory").val();

        /* JQuery objects pointing to form containers for error feedback */
        var titleContainer = $("#titleInputContainer");
        var descriptionContainer = $("#descriptionInputContainer");
        var urlContainer = $("#urlInputContainer");

        /* JQuery objects pointing to divs containing error messages */
        var titleError = $('#titleWarning');
        var descriptionError = $('#descriptionWarning');
        var urlError = $('#urlWarning');

        /* Flag for valid input */
        var validInputFlag = true;

        /* Invalid video title */
        if (videoTitle.length < 1) {
        	titleContainer.addClass('has-error');	
        	titleError.css('display', 'inline');
        	validInputFlag = false;
        }
        else {
        	if (titleContainer.hasClass('has-error')) {
        		titleContainer.removeClass('has-error');
        		titleError.css('display', 'none');	
        	}
        }

        /* Invalid video description */
        if (videoDescription.length < 1) {
        	descriptionContainer.addClass('has-error');	
        	descriptionError.css('display', 'inline');
        	validInputFlag = false;
        }
        else {
        	if (descriptionContainer.hasClass('has-error')) {
        		descriptionContainer.removeClass('has-error');	
        		descriptionError.css('display', 'none');	
        	}
        }

        /* Invalid video url*/
        if (videoUrl.length < 1) {
        	urlContainer.addClass('has-error');	
        	urlError.css('display', 'inline');
        	validInputFlag = false;
        }
        else {
/*        	urlContainer.validate();*/
        	if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(videoUrl)) {
			  	
			  	/* Currently only support youtube and vimeo videos for embedding */
        		if (videoUrl.indexOf("youtube") < 0 && videoUrl.indexOf("vimeo") < 0) {
        			alert("Youtube and Vimeo are the only supported video formats");
        			validInputFlag = false;
        		}
        		else {
        			videoUrl = parseURL(videoUrl);
				  	if (urlContainer.hasClass('has-error')) {
		        		urlContainer.removeClass('has-error');	
		        		urlError.css('display', 'none');
		        	}
		        }
			} 
			else {
			  	urlContainer.addClass('has-error');	
        		urlError.css('display', 'inline');
        		validInputFlag = false;
			}
        }

        /* Check if all input is valid */
        if (validInputFlag) {
        	var categoryId;
        	var redirectUrl;
        	for (var i = 0; i < categoryObjs.length; i++) {
        		if (videoCategory === categoryObjs[i].title) {
        			categoryId = categoryObjs[i].id;
        		}
        	}
        	var videoObject = {
        		"categoryId": categoryId,
		        "description": videoDescription,
		        "name": videoTitle,
		        "url": videoUrl
        	}
        	redirectUrl = getBaseUrl() + 'top10/' + videoObject.categoryId;
        	console.log("Valid Input, created video object");
        	postVideo(videoObject);
        	window.location.replace(redirectUrl);
        }
    });
});
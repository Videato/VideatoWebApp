var categoryObjs = [];

function addCategoriesToHTML(jsonData) {
	var htmlToInsert;
	var category;
	var categoryId;
	var categoryTitle;
	
	/* Default blank selection for category dropdown */
	$('.category-dropdown').append("<option></option>");

	/* Add each category into the dropdown 
	 * Change this later to access stored category list after home page is loaded
	 */
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
	console.log('Attempting to retrieve categories from local storage');
	addCategoriesToHTML(jQuery.parseJSON(window.sessionStorage.getItem('categories')));
}

function postVideo(videoObj) {
	console.log('Attempting to post a video');
	var categoriesUrl = "https://videato-api.herokuapp.com/videos";
	var returnData;
	var redirectUrl = getBaseUrl() + 'top10/' + videoObj.categoryId;

	$.ajax({
		type:'POST',
		url: categoriesUrl,
		dataType: 'json',	
		data: videoObj 
	})
	.done(function (data) {
		console.log('successfully posted a video');
		window.location.replace(redirectUrl);
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}


function parseURL(url, urlErrorElement) {

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
		console.log ('Returning: https:/youtube.com/embed/' + match[2]);
	  	return "https:/youtube.com/embed/" + match[2];
	} 
	/* Link is a vimeo url */
	else if (url.indexOf("vimeo")  > -1) {
		/* Extract video id from the Vimeo Url. should be the last elemnt of the url */
		var vimeoVidId = url.substring(url.lastIndexOf("/") + 1);
		return "http://player.vimeo.com/video/" + vimeoVidId + "?color=a8a8a8"; 
	}
	else {
		return url;
	}
}

$(document).ready(function(){
	getCategories();
	// just for the demos, avoids form submit
	$.validator.setDefaults({
	  debug: true,
	  success: "valid"
	});
	/* Validation method for our supported video URL's 
	 * We currently accept only vimeo and youtube vido links */
	$.validator.addMethod("supportedVideoUrl", function(value, element) {
		  	return (value.indexOf("youtube.com") > -1 || value.indexOf("vimeo.com") > -1);			
		  }, 
		  "* Only supported video sources are Youtube and Vimeo."
	);

	/* Validation method for our youtube URL's 
	 * The url must contain a video ID */
	$.validator.addMethod("validYoutubeUrl", 
		function(value, element) {
		  	/* link is a youtube url, ignore otherwise */		  	
			if (value.indexOf("youtube.com") > -1 || value.indexOf("youtu.be") > -1) {
				var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
				var match = value.match(regExp);
				if (match && match[2].length == 11) {
				   return true;
				} 
				else {
				   return false;
				}
			}	
			else {
				return true;
			}	
		}, 
		  "* Invalid Youtube URL. Just copy and paste the Youtube video URL from your browser."
	);

	/* Validation method for our vimeo URL's 
	 * The url must contain a video ID */
	$.validator.addMethod("validVimeoUrl", 
		function(value, element) {
		  	/* link is a vimeo url, ignore otherwise */
		  	
			if (value.indexOf("vimeo.com") > -1) {
				/* Check for valid vimeo url */
				console.log('checking vimeo url');
				return value.substring(value.lastIndexOf("/") + 1).match(/^\d+$/);
			}	
			/* link is missing .com */
			else if (value.indexOf("vimeo") > -1) {
				return false
			}
			else {
				return true
			}	
		}, 
		  "* Invalid Vimeo URL. Just copy and paste the Vimeo video URL from your browser."
	);	

	$( "#addVideoForm" ).validate({
	  submitHandler: function(form) {
	    var inputTitle = $(form).find('#inputTitle')[0].value;
	    var inputDescription = $(form).find('#inputDescription')[0].value;

	    /* Parse URL into a valid embed form */
	    var inputUrl = parseURL($(form).find('#inputUrl')[0].value);
	    var inputCategory = $(form).find('#inputCategory')[0].value;

	    var categoryId;
    	for (var i = 0; i < categoryObjs.length; i++) {
    		if (inputCategory === categoryObjs[i].title) {
    			categoryId = categoryObjs[i].id;
    		}
    	}
    	var videoObject = {
    		"categoryId": categoryId,
	        "description": inputDescription,
	        "name": inputTitle,
	        "url": inputUrl
    	}
    	console.log("Valid Input, created video object in category");
    	postVideo(videoObject);
	  },
	  rules: {
	    inputTitle: "required",
	    inputDescription: "required",
	    inputUrl: {
	      required: true,
	      url: true,
	      supportedVideoUrl: true,
	      validYoutubeUrl: true,
	      validVimeoUrl: true
	    },
	    inputCategory: "required"
	  },
	  messages: {
	  	inputTitle: "* Please provide a video title",
	  	inputDescription: "* Please provide a video description",
	  	inputUrl: {
	  		required: "* Please provide a video url",
	  		url: "* Please provide a valid 'https' url"
	  	},
	  	inputCategory: "* Please select a category."
	  }
	});	
});
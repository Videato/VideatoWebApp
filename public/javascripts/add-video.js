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


function parseURL(url, urlErrorElement) {
	/* Link is standard a youtube url */
	if (url.indexOf("youtube.com") > -1) {
		/* Return the link that can be embed */
		return url.replace('watch?v=', 'embed/');
	}
	/* Handle youtube url's in youtu.be format */
	else if (url.indexOf("youtu.be") > -1) {
		/* Extract video id and time start parameter from url */
		var youtubeVidId = url.substring(url.lastIndexOf("/") + 1);
		return "https:/youtube.com/embed/" + youtubeVidId; 
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
			if (value.indexOf("youtube.com") > -1) {
				/* Check for valid youtube url */
				return value.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
			}	
			else {
				return true
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
    	var redirectUrl;
    	for (var i = 0; i < categoryObjs.length; i++) {
    		if (inputCategory === categoryObjs[i].title) {
    			categoryId = categoryObjs[i].id;
    		}
    	}
    	var videoObject = {
    		"categoryId": inputCategory,
	        "description": inputDescription,
	        "name": inputTitle,
	        "url": inputUrl
    	}
    	redirectUrl = getBaseUrl() + 'top10/' + videoObject.categoryId;
    	console.log("Valid Input, created video object in category");
    	postVideo(videoObject);
    	window.location.replace(redirectUrl);
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
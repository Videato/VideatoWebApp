function addVideosToHTML(jsonData) {
	var htmlToInsert;
	var video;
	var videoId;
	var videoTitle;
	var videoEmbedUrl;
	var videoDescription;
	console.log('length of array: ' + jsonData.length);
	
	for (var i = 0; i < jsonData.length; i++) {
	    video = jsonData[i];
	    videoId = video.objectId;
	    videoTitle = video.name;
	    videoEmbedUrl = parseURL(video.url);
	    videoDescription = video.description;
	    htmlToInsert = "<div class='video-row col-sm-12'><div class='col-md-5'><iframe width='420' height='315' id='" + videoId + "' src='" + videoEmbedUrl + "'></iframe></div><div class='col-md-7'><h1 id='video-title'>" + videoTitle + "</h1><p id='video-description'>" + videoDescription + "</p></div></div>";

		$('.video-container').append(htmlToInsert);
	}
}

function parseURL(url) {
	return url.replace('watch?v=', 'embed/');
}

function getVideos() {
	console.log('Attempting to retrieve categories');
	var url = "https://videato-api.herokuapp.com/categories";
	var returnData;
	/*$.getJSON(url, {}, function(data) {
		console.log('hello');
		$.each( data, function( key, val ) {
    		console.log(data.length);
  		});

	})*/
	$.ajax({
		type:'GET',
		url: 'https://videato-api.herokuapp.com/videos',
		dataType: 'json',
		
	})
	.done(function (data) {
		addVideosToHTML(data);
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
	/*$.ajax({
		type:'GET',
		url: 'https://videato-api.herokuapp.com/categories',
		dataType: 'jsonp',
		cache: false,
        dataFilter: function (response, type) {
        	console.log(type); //prints "jsonp"	
        },
		success: function(data)
		{
			console.log('yee');
		},
		error: function(xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
        },
	});*/
}

function addVideo(videoURL, videoName, description, categoryId) {
	console.log('In adding video');
	var addVidURL = 'https://videato-api.herokuapp.com/videos';
	var video = JSON.stringify({'name': videoName, 'url': videoURL, 'categoryId': categoryId, 
					'description': description});

	var callbackFunc = function (data) {
		alert (data);
	};

	/*$.post(addVidURL, video, function (result) {
		alert('success');
	});*/
	
	$.ajax({
		type:'POST',
		url: 'https://videato-api.herokuapp.com/videos?callback=callbackFunc',
		data: video,
		async: false,
		dataType: 'jsonp',
		success: function(data)
		{
			console.log('yee');
			console.log(data);
		}
	});
}


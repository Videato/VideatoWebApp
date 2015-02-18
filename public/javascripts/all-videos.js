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
	    htmlToInsert = "<div class='video-row col-sm-12'>" 
	    				+ "<div class='col-md-5'>" 
	    					+ "<iframe width='420' height='315' id='" + videoId + "' src='" + videoEmbedUrl + "'></iframe>" 
						+ "</div><div class='col-md-7'>" 
							+ "<h1 id='video-title'>" + videoTitle + "</h1>" 
							+ "<p id='video-description'>" + videoDescription + "</p>" 
						+ "</div>" 
					+ "</div>";

		$('.video-container').append(htmlToInsert);
	}
}

function parseURL(url) {
	return url.replace('watch?v=', 'embed/');
}

function getVideos() {
	var videosUrl = "https://videato-api.herokuapp.com/videos";
	var returnData;

	$.ajax({
		type:'GET',
		url: videosUrl,
		dataType: 'json',
		
	})
	.done(function (data) {
		addVideosToHTML(data);
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

$(document).ready(function(){
	getVideos();
});
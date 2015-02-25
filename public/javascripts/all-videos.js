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
	    videoEmbedUrl = parseFinalURL(video.url);
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

function parseFinalURL(url) {
	/* link is a youtube url */
	if (url.indexOf("youtube.com") > -1) {
		return url.replace('watch?v=', 'embed/');
	}
	/* link is a vimeo url */
	else if (url.indexOf("player.vimeo.com") < 0) {
		/* Extract video id from the Vimeo Url. should be the last elemnt of the url */
		var vimeoVidId = url.substring(url.lastIndexOf("/") + 1);
		console.log("Adjusting vimeo video url with id: " + vimeoVidId);
		return "http://player.vimeo.com/video/" + vimeoVidId + "?color=a8a8a8"; 
	}
	else {
		return url;
	}
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
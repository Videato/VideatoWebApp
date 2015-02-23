function addTop10ToHTML(jsonData) {
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

		$('.top10-video-container').append(htmlToInsert);
	}
}

function getCategoryVideos() {
	/* Variable categoryId is defined in top10.dust after 
	 * the page recieves the category id from router */
	var videosUrl = "https://videato-api.herokuapp.com/videos/category/" + categoryId + "?top=true";
	var returnData;

	console.log("GET top 10 url: " + videosUrl);

	$.ajax({
		type:'GET',
		url: videosUrl,
		dataType: 'json',
		
	})
	.done(function (data) {
		addTop10ToHTML(data);
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

$(document).ready(function(){
	getCategoryVideos();
});
function addTop10ToHTML(jsonData) {
	var htmlToInsert;
	var video;
	var videoId;
	var videoTitle;
	var videoEmbedUrl;
	var videoDescription;
	var videoVotes;
	
	for (var i = 0; i < jsonData.length; i++) {
	    video = jsonData[i];
	    videoId = video.objectId;
	    videoTitle = video.name;
	    videoEmbedUrl = parseAndLoadURL(video.url);
	    videoDescription = video.description;
	    videoVotes = video.votes;
	    htmlToInsert = "<div class='video-row col-sm-12'>" 
	    				+ "<div class='col-md-5'>" 
	    					+ "<iframe width='420' height='315' id='" + videoId + "' src='" + videoEmbedUrl + "'></iframe>" 
						+ "</div>" 
						+ "<div class='col-md-6'>" 
							+ "<h1 id='video-title'>" + videoTitle + "</h1>" 
							+ "<p id='video-description'>" + videoDescription + "</p>" 
						+ "</div>" 
						+ "<div class='col-md-1'>"
							+ "<div class='vote-table'>" 
								+ "<div class='vote-container'>" 
									+ "<form action='https://videato-api.herokuapp.com/videos/" + videoId + "/vote' id='voteForm'>"
										+ "<button type='submit' class='submit btn btn-default btn-lg' name='up' value='up'>"
											+ "<span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span>"
										+ "</button>"
					    				+ "<h2 id='numberVotes' class='votes-display'>" + videoVotes + "</h2>"
					    				+ "<button type='submit' class='submit btn btn-default btn-lg' name='down' value='down'>"
											+ "<span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span>"
										+ "</button>"
									+ "</form>"
								+ "</div>"
							+ "</div>"
						+ "</div>"
					+ "</div>";

		$('.top10-video-container').append(htmlToInsert);
	}
}

function parseAndLoadURL(url) {
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

function upVoteVideo(voteUrl, numVotes) {
	var totalUrl = voteUrl + '?up=true';
	$.ajax({
		type:'POST',
		url: totalUrl,
		dataType: 'json',	
		data: {}
	})
	.done(function (data) {
		console.log('Successfully upvoted a video using: ' + totalUrl);
		numVotes.html((parseInt(numVotes.html()) + 1).toString());
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

function downVoteVideo(voteUrl, numVotes) {
	var totalUrl = voteUrl + '?up=false';
	$.ajax({
		type:'POST',
		url: totalUrl,
		dataType: 'json',	
		data: {}
	})
	.done(function (data) {
		console.log('Successfully downvoted a using: ' + totalUrl);
		numVotes.html((parseInt(numVotes.html()) - 1).toString());
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
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

		$('button[type="submit"]').on('click', function() {
		    var btn = $(this).val();
		    var action = $(this).parent('#voteForm').attr('action');
		    var numVotes = $(this).parent('#voteForm').children('#numberVotes');
		    if(btn == 'up') 
		    {
		    	upVoteVideo(action, numVotes);
		    }
		    else 
		    {
		    	downVoteVideo(action, numVotes);
		    }
		    return false;
		});
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

$(document).ready(function(){
	getCategoryVideos();

	// Disable the ENTER key altogether on the form inputs
	$('form').find('.button').keypress(function(e){
	   if (e.which == 13) // Enter key is keycode 13
	   {
	       return false;
	   }    
	});
});
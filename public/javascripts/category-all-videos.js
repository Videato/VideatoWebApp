function addAllVideosToHTML(jsonData) {
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
	    htmlToInsert = "<div class='video-row col-xs-12'>" 
	    				/* Video title appears above iframe only on small and xs devices */
						+ "<div class='col-xs-12 visible-xs-block visible-sm-block video-title-container'>" 
							+ "<h1 id='video-title'>" + videoTitle + "</h1>"
						+ "</div>" 

						/* Video container div */
	    				+ "<div class='video-container col-xs-10 col-md-5'>" 
	    					+ "<iframe width='420' height='315' id='" + videoId + "' src='" + videoEmbedUrl + "'></iframe>" 
						+ "</div>" 

						/* Video title and description for display in medium sized devices and up */
						+ "<div class='col-md-6 visible-md-block visible-lg-block'>" 
							+ "<div class='col-md-12'>" 
								+ "<h1 id='video-title'>" + videoTitle + "</h1>"
							+ "</div>"  
							+ "<div class='col-md-12'>" 
								+ "<p id='video-description'>" + videoDescription + "</p>" 
							+ "</div>" 
						+ "</div>" 

						/* Vote Container Div */ 
						+ "<div class='col-xs-2 col-md-1'>"
							+ "<div class='vote-table'>" 
								+ "<div class='vote-container'>" 
									+ "<form action='https://videato-api.herokuapp.com/videos/" + videoId + "/vote' id='voteForm'>"
										+ "<button type='submit' class='submit btn btn-default btn-lg' name='allUp' value='allUp'>"
											+ "<span class='glyphicon glyphicon-thumbs-up' aria-hidden='true'></span>"
										+ "</button>"
					    				+ "<h2 id='numberVotes' class='votes-display'>" + videoVotes + "</h2>"
					    				+ "<button type='submit' class='submit btn btn-default btn-lg' name='allDown' value='allDown'>"
											+ "<span class='glyphicon glyphicon-thumbs-down' aria-hidden='true'></span>"
										+ "</button>"
									+ "</form>"
								+ "</div>"
							+ "</div>"
						+ "</div>"

						/* Description container for small and extra small devices */
						+ "<div class='video-description-container col-xs-12 visible-xs-block visible-sm-block'>" 
							+ "<p id='video-description'>" + videoDescription + "</p>" 
						+ "</div>" 
					+ "</div>";

		$('.all-video-container').append(htmlToInsert);
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
		window.alert("Sorry, you already voted for that video.");
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
		window.alert("Sorry, you already voted for that video.");
	});
}

function getAllCategoryVideos() {
	/* Variable categoryId is defined in top10.dust after 
	 * the page recieves the category id from router */
	var videosUrl = "https://videato-api.herokuapp.com/videos/category/" + categoryId;
	var returnData;

	console.log("GET top 10 url: " + videosUrl);

	$.ajax({
		type:'GET',
		url: videosUrl,
		dataType: 'json',
		
	})
	.done(function (data) {
		addAllVideosToHTML(data);

		$('button[type="submit"]').on('click', function() {
		    var btn = $(this).val();
		    var action = $(this).parent('#voteForm').attr('action');
		    var numVotes = $(this).parent('#voteForm').children('#numberVotes');
		    if(btn == 'allUp') 
		    {
		    	upVoteVideo(action, numVotes);
		    }
		    else if(btn == 'allDown')
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
	getAllCategoryVideos();

	// Disable the ENTER key altogether on the form inputs
	$('form').find('.button').keypress(function(e) {
	   if (e.which == 13) {
	       return false;
	   }    
	});
});
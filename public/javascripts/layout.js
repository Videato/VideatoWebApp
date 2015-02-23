function getBaseUrl() {
   var href = window.location.href.split('/');
   return href[0]+'//'+href[2]+'/';
}

$(document).ready(function(){
	var addVideoUrl = getBaseUrl() + 'addVideo';
	var allVideosUrl = getBaseUrl() + 'allVideos';

	$('#add-video-link').attr('href', addVideoUrl);
	$('#all-videos-link').attr('href', allVideosUrl);
	$('#nav-bar-title').attr('href', getBaseUrl());
});
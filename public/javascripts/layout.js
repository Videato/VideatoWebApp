function getBaseUrl() {
   var href = window.location.href.split('/');
   return href[0]+'//'+href[2]+'/';
}

$(document).ready(function(){
	var allVideosUrl = getBaseUrl() + '/allVideos';
	$()
});
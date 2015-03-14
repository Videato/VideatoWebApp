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

	$('#searchForm').on('submit', function(e){
        e.preventDefault();
        var searchField = $('#searchText').val();
        
        /* Only search if something was in the search box */
        if (searchField.length > 0) {
        	window.location=getBaseUrl() + 'searchResult/' + searchField;
        }
    });
});
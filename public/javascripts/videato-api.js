function getCategories() {
	console.log('Attempting to retrieve categories');
	var url = "https://videato-api.herokuapp.com/categories";

	var callbackFunc = function (data) {
		console.log('in the callback');
		alert (data);
	};
	/*$.getJSON(url, {}, function(data) {
		console.log('hello');
		$.each( data, function( key, val ) {
    		console.log(data.length);
  		});
	});*/

	$.ajax({
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
	});
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
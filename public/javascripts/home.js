function addTileHoverEffect(categoryIdList) {
	//play on hover with initial play
	var idList = '';
	console.log ('effect list length: ' + categoryIdList.length);
	for (var i = 0; i < categoryIdList.length; i++) {
		idList += '#' + categoryIdList[i];
		if (categoryIdList.length - 1 !== i) {
			idList += ', '
		}
	}
	console.log ('tiles: ' + idList);
	var $tiles = $(idList).liveTile({ 
	    playOnHover:true,
	    repeatCount: 0,
	    delay: 0,
	    initDelay: 0,
	    startNow: false,
	    animationComplete: function(tileData){
	        $(this).liveTile("play");
	        tileData.animationComplete = function(){};
	    }
	});
}

function addCategoriesToHTML(jsonData) {
	var htmlToInsert;
	var category;
	var categoryId;
	var categoryTitle;
	var categoryOnClickUrl;
	var categoryIdList = [];
	
	for (var i = 0; i < jsonData.length; i++) {
	    category = jsonData[i];
	    categoryId = category.objectId;
	    categoryIdList[i] = categoryId;
	    categoryTitle = category.name;
	    categoryOnClickUrl = getBaseUrl() + 'top10/' + categoryId;
	    htmlToInsert = "<a href='" + categoryOnClickUrl + "'>" 
	    				+ "<div class='tile-container black col-sm-6 col-md-4'>"
		    				+ "<div class='live-tile accent' id='" + categoryId + "' data-mode='slide' data-stops='50%' data-stack='true'>" 
								+ "<div class='tile-text-container'>" 
									+ "<h2 id='category-title'>" + categoryTitle + "</h2>" 
								+ "</div>" 
								+ "<div style='background-color:grey;'>"
									+ "<h3 style='padding: 0 30px;'>View the top ten trending videos for " + categoryTitle + "</h3>"
								+ "</div>"
							+ "</div>" 
						+ "</div>"
					+ "</a>";

		$('.categories-container').append(htmlToInsert);
	}
	addTileHoverEffect(categoryIdList);
}

function parseURL(url) {
	return url.replace('watch?v=', 'embed/');
}

function getCategories() {
	console.log('Attempting to retrieve categories');
	var categoriesUrl = "https://videato-api.herokuapp.com/categories";
	var returnData;

	$.ajax({
		type:'GET',
		url: categoriesUrl,
		dataType: 'json',	
	})
	.done(function (data) {
		addCategoriesToHTML(data);
		window.sessionStorage.setItem('categories', JSON.stringify(data));
	})
	.fail(function (jqXHR, status) {
		console.log(jqXHR);
		console.log(status);
	});
}

$(document).ready(function(){
	getCategories();
});
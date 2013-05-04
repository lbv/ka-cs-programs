imgCodeTemplate = """
var get<%= id %> = function() {
	var dataUri = "<%= data %>";
	var $ = (function() { return this.$; })();
	var img = $('<img src="' + dataUri + '"/>');
	$('canvas').first().parent().append(img);
	var pimg = createImage(img.width(), img.height(), ARGB);
	pimg.sourceImg.getContext('2d').drawImage(img[0], 0, 0);
	return pimg;
};

/**
 * Now you can call `get<%= id %>` to obtain your image, and
 * then you can draw it with the `image` function.
 *
 *   Example:
 *
 *   var myImage = get<%= id %>();
 *   image(myImage, 0, 0);
 *
 */
"""

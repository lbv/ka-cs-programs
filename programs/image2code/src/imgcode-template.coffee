imgCodeTemplate = """
var get<%= id %> = function() {
	var $ = (function() { return this.$; })();
	var img = $('#-img-<%= id %>');
	if (img.length === 0) {
		var dataUri = "<%= data %>";
		img = $('<img id="-img-<%= id %>" src="' + dataUri + '"/>');
		$('canvas').first().parent().append(img);
	}
	var pimg = createImage(img.width(), img.height(), ARGB);
	pimg.sourceImg.getContext('2d').drawImage(img[0], 0, 0);
	return pimg;
};

/**

Now you can call `get<%= id %>` to obtain your image, and
then you can draw it with the `image` function.

   Example:

   var img<%= id %> = get<%= id %>();
   image(img<%= id %>, 0, 0);

**/
"""

imgCodeTemplate = """
var load<%= id %> = function(callback) {
	load<%= id %>.flag = true;
	var $ = (function() { return this.$; })();
	var img = $('#-img-<%= id %>');
	if (img.length === 0) {
		var dataUri = "<%= data %>";
		img = $('<img id="-img-<%= id %>" src="' + dataUri + '"/>');
	}
	if (! img.data('loaded')) {
		var dfd = new $.Deferred();
		img.on('load', function() {
			if (! load<%= id %>.flag) { return; }
			$('canvas').first().parent().append(img);
			img.data('loaded', true);
			var pimg = createImage(img.width(), img.height(), ARGB);
			pimg.sourceImg.getContext('2d').drawImage(img[0], 0, 0);
			dfd.resolve(pimg);
		});
		img.data('promise', dfd.promise());
	}
	img.data('promise').then(callback);
};

/**

To use your image, call `load<%= id %>`,
passing it a function (also known as a "callback") that will
be called once the image has been loaded. The callback
receives a reference to the image as the first parameter.


Example #1:

    // Paint the image once it's been loaded
    var onReady<%= id %> = function(img) {
        image(img, 0, 0);
    };
    load<%= id %>(onReady<%= id %>);


Example #2:

    // Load the image, and use it in the `draw` function
    var img<%= id %>;
    var onReady<%= id %> = function(img) {
        img<%= id %> = img;
    };
    load<%= id %>(onReady<%= id %>);
    var draw = function() {
        background(255, 255, 255);
        if (img<%= id %>) {  // Only draw it when it's ready
            image(img<%= id %>, mouseX, mouseY);
        }
    };


As you can see, this process requires a little more work
than using something like `getImage`, because loading a new
image is an "asynchronous" process, which means that it
happens in the "background", and then it notifies you when
it's done.

**/
"""



var gif_data = "R0lGODlhZABkAIABAAAA/////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACwAAAAAZABkAAACoYyPqcvt\nD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrN\narcYgJer8IrH4LGZnD2rv9e1u+1WW+NvKn1dvcunery0vxcFeGY3yMZnCJCXODcIB4gFmXZX5gd2\nIHapucnZ6fkJGio6SlpqeoqaqrrK2ur6ChsrO0tba3uLm6u7y9vr61EAADs=";

try {
	var b64 = new Base64Reader(gif_data);
	var gif = new GIFReader(b64);
	var res = gif.readImages();
	debug("ok");
}
catch (e) {
	println("Error: " + e);
}

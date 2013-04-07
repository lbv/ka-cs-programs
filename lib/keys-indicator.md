KeysIndicator

A small on-screen representation of a group of keys being
pressed. The keys are drawn as a rectangular "matrix"
with eacj key occupying a certain position of the matrix.

Methods:

  constructor(x, y, keys, config)
    Builds a new KeysIndicator, to be drawn at (x,y),
    with the given keys and configuration. `keys` should
    be an array of arrays, representing the keys to keep
    track of.

    Each key is stored as an array of 4 elements, in
    order: its keycode, its string representation, and
    its row and column inside the matrix.

    The `config` argument is an optional object that can
    contain the following properties: colorBG, colorFG,
    scale, font.

  onKeyPressed(), onKeyReleased()
    Should be called from the main `keyPressed` and
    `keyReleased` functions.

  draw()
    Should be called from the main `draw`, to draw the
    keyboard indicator on the canvas.

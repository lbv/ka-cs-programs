/**
 * Cloth Simulation
 * ================
 *
 * A demo of a simple physics simulation based on the (now
 * classic) paper by Thomas Jakobsen, "Advanced Character
 * Physics".
 *
 * It's based on a mechanism to manipulate particles called
 * "Verlet integration". The key elements of this approach
 * are:
 *
 *   - Each particle is stored as a set of vectors that
 *     represent its position, its previous position (where
 *     the particle was located one time step ago), its
 *     acceleration and an scalar that represents its mass.
 *
 *   - Forces can act on the particles, which affect their
 *     acceleration, in inverse proportion to their mass.
 *
 *   - No need to store velocities, since they're implied
 *     by the relation (new position - previous position).
 *
 *   - A set of "constraints" can also be enforced on pairs
 *     of particles. Constraints try to keep these pairs at
 *     a constant distance, so if they get too far away,
 *     they are moved closer together, and vice-versa.
 *
 * The resulting system tends to be stable, given a fluid
 * framerate. That is, if there's not a lot of variation
 * between the time-steps.
 *
 * This can be used in games, for example, to produce
 * interesting effects, but be careful if you plan to use it
 * in elements directly related to gameplay (like the
 * position of characters in a side-scroller, for example),
 * because its behaviour can be unpredictable when the
 * framerate is not fluid. Unless, of course, you're
 * creating a game based on quirky physics that allows for
 * some randomness. In any case, this could be remedied by
 * forcing a steady time-step at each frame, but then the
 * simulation's perceived speed will fluctuate. It's
 * basically a balancing act.
 *
 * The beauty of this system, at least for me, is that this
 * illustrates how seemingly "complex" behaviour, like how
 * a piece of cloth should look like when moving in space,
 * can be emulated by very simple rules (forces,
 * constraints) applied to a simple system (just a group of
 * particles). Particles individually do not possess any
 * "knowledge" about the overall system, they simply move
 * around trying to satisfy the constraints that affect
 * them, and yet the global behavior simply emerges from
 * those small individual operations. I just find that
 * deeply fascinating.
 *
 * For more details about the physics simulation process and
 * the math behind it, you may refer to:
 *
 *   - Advanced Character Physics. Jakobsen, Thomas.
 *     http://goo.gl/4fjVW
 *   
 *   - A Simple Time-Corrected Verlet Integration Method.
 *     Dummer, Jonathan.
 *     http://goo.gl/YZyLM
 *
 * - - -
 *
 * Cloth Simulation:
 *
 *
 * Cloth Simulation on GitHub:
 *
 *
 * - - -
 *
 * ChangeLog
 *
 *   Version 1 (2013-03-19)
 */

var $pjs = this;

m4_include(`particles.js')
m4_include(`text-layer.js')
m4_include(`gui.js')

m4_include(`cloth-main.js')

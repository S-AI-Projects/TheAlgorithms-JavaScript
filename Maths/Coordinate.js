/**
 * Calculate the mathematical properties involving coordinates.
 * Calculate the Distance Between 2 Points on a 2-Dimensional Plane.
 *
 * Example: euclideanDistance(2, 2, 14, 11) returns 15
 * Wikipedia reference: https://en.wikipedia.org/wiki/Geographical_distance#Flat-surface_formulae
 *
 * @function euclideanDistance
 * @description Calculates the straight-line Euclidean distance between two points (longitude1, latitude1) and (longitude2, latitude2).
 * @param {number} longitude1 - The x-coordinate (longitude) of the first point.
 * @param {number} latitude1 - The y-coordinate (latitude) of the first point.
 * @param {number} longitude2 - The x-coordinate (longitude) of the second point.
 * @param {number} latitude2 - The y-coordinate (latitude) of the second point.
 * @returns {number} The straight-line Euclidean distance between the two points, or NaN if arguments are invalid/missing.
 */
const euclideanDistance = (longitude1, latitude1, longitude2, latitude2) => {
  const dx = longitude2 - longitude1
  const dy = latitude2 - latitude1
  return Math.hypot(dx, dy)
}

/**
 * @function manhattanDistance
 * @description Calculates the Manhattan (taxicab or grid) distance between two points.
 * @param {number} longitude1 - The x-coordinate (longitude) of the first point.
 * @param {number} latitude1 - The y-coordinate (latitude) of the first point.
 * @param {number} longitude2 - The x-coordinate (longitude) of the second point.
 * @param {number} latitude2 - The y-coordinate (latitude) of the second point.
 * @returns {number} The Manhattan distance between the two points, or NaN if arguments are invalid/missing.
 */
const manhattanDistance = (longitude1, latitude1, longitude2, latitude2) => {
  const width = Math.abs(longitude2 - longitude1)
  const height = Math.abs(latitude2 - latitude1)
  return width + height
}

export { euclideanDistance, manhattanDistance }

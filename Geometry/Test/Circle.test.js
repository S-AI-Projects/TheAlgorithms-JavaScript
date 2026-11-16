import Circle from '../Circle'

describe('Tests for Circle', () => {
  // Preconditions established in Geometry/Circle.js:
  // Line 15: constructor(radius) stores this.radius.
  // Line 19: perimeter() returns this.radius * 2 * Math.PI.
  // Line 23: area() returns Math.pow(this.radius, 2) * Math.PI.

  const circle = new Circle(3)

  test('The area of a circle with radius equal to 3', () => {
    // Precondition: Geometry/Circle.js line 23
    expect(parseFloat(circle.area().toFixed(2))).toEqual(28.27)
  })

  test('The perimeter of a circle with radius equal to 3', () => {
    // Precondition: Geometry/Circle.js line 19
    expect(parseFloat(circle.perimeter().toFixed(2))).toEqual(18.85)
  })

  describe('Deterministic execution, fixtures and input isolation', () => {
    // Smallest valid input: radius 0
    test('handles smallest valid input (radius 0) with explicit expected values', () => {
      // Precondition: Geometry/Circle.js line 15 (radius = 0), lines 19, 23
      const cZero = new Circle(0)
      const expectedArea = 0 // independently calculated: 0^2 * Math.PI = 0
      const expectedPerimeter = 0 // independently calculated: 2 * 0 * Math.PI = 0

      expect(cZero.area()).toBe(expectedArea)
      expect(cZero.perimeter()).toBe(expectedPerimeter)
      expect(typeof cZero.area()).toBe('number')
      expect(typeof cZero.perimeter()).toBe('number')
    })

    // Representative ordinary input: radius 10
    test('handles representative ordinary input (radius 10) with independently calculated values', () => {
      // Precondition: Geometry/Circle.js line 15 (radius = 10), lines 19, 23
      const cTen = new Circle(10)
      const expectedArea = 100 * Math.PI // independently calculated: 10^2 * PI ≈ 314.1592653589793
      const expectedPerimeter = 20 * Math.PI // independently calculated: 2 * 10 * PI ≈ 62.83185307179586

      expect(cTen.area()).toBeCloseTo(expectedArea, 10)
      expect(cTen.perimeter()).toBeCloseTo(expectedPerimeter, 10)
    })

    test('verifies pure class repeatability across fresh isolated instances and interleaved valid inputs', () => {
      // Precondition: Geometry/Circle.js lines 15, 19, 23
      const expectedArea = 100 * Math.PI
      const expectedPerimeter = 20 * Math.PI

      // Run 1: First fresh isolated instance
      const circleA = new Circle(10)
      const areaA1 = circleA.area()
      const perimA1 = circleA.perimeter()
      expect(areaA1).toBeCloseTo(expectedArea, 10)
      expect(perimA1).toBeCloseTo(expectedPerimeter, 10)

      // Run 2: Second fresh isolated instance with identical input
      const circleB = new Circle(10)
      expect(circleB.area()).toBe(areaA1)
      expect(circleB.perimeter()).toBe(perimA1)

      // Interleaved operation on a different valid input (radius 25)
      const interleaved = new Circle(25)
      expect(interleaved.area()).toBeCloseTo(625 * Math.PI, 10)
      expect(interleaved.perimeter()).toBeCloseTo(50 * Math.PI, 10)

      // Run 3: Third instance after interleaved execution
      const circleC = new Circle(10)
      expect(circleC.area()).toBe(areaA1)
      expect(circleC.perimeter()).toBe(perimA1)

      // Ensure prior instance circleA was not mutated by interleaved operations
      expect(circleA.radius).toBe(10)
      expect(circleA.area()).toBe(areaA1)
      expect(circleA.perimeter()).toBe(perimA1)
    })
  })
})

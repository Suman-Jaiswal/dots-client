import { Line, Point } from './components/pojo';

test('renders learn react link', () => {
  const point1 = new Point(1, 2);
  const point2 = new Point(1, 2);
  const point3 = new Point(2, 3);

  console.log(point1.equals(point2)); // true
  console.log(point1.equals(point3)); // false

  const line1 = new Line(point1, point3);
  const line2 = new Line(point1, point3);
  const line3 = new Line(point3, point1);
  const line4 = new Line(point2, point3);

  console.log(line1.equals(line2)); // true
  console.log(line1.equals(line3)); // true (reversed order)
  console.log(line1.equals(line4)); // true (point1 equals point2)
  console.log(line2.equals(line3)); // true
  console.log(line2.equals(line4)); // true
  console.log(line3.equals(line4)); // true

  expect(point1.equals(point2)).toBe(true)
  expect(point1.equals(point3)).toBe(false)

  expect(line1.equals(line2)).toBe(true)
  expect(line1.equals(line3)).toBe(true)
  expect(line1.equals(line4)).toBe(true)
  expect(line2.equals(line3)).toBe(true)
  expect(line2.equals(line4)).toBe(true)
  expect(line3.equals(line4)).toBe(true)

});

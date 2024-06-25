export class Point {
    row;
    col;
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    equals(point) {
        return this.row === point.row && this.col === point.col;
    }

    toString() {
        return `${this.row},${this.col}`;
    }

    static fromString(str) {
        const [row, col] = str.split(',');
        return new Point(parseInt(row), parseInt(col));
    }

    static fromObject(obj) {
        return new Point(obj.row, obj.col);
    }

    static fromArray(arr) {
        return new Point(arr[0], arr[1]);
    }
}

export class Line {
    start;
    end;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    equals(line) {
        console.log(this.start, line.start, this.end, line.end);
        return (
            (this.start.equals(line.start) && this.end.equals(line.end)) ||
            (this.start.equals(line.end) && this.end.equals(line.start))
        );
    }

    toString() {
        return `${this.start.toString()}-${this.end.toString()}`;
    }

    static fromString(str) {
        const [start, end] = str.split('-');
        console.log(start, end);
        return new Line(Point.fromString(start), Point.fromString(end));
    }

    static fromObject(obj) {
        return new Line(Point.fromObject(obj.start), Point.fromObject(obj.end));
    }

    static fromArray(arr) {
        return new Line(Point.fromArray(arr[0]), Point.fromArray(arr[1]));
    }
}

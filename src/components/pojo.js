class Point {
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
        return JSON.stringify(this);
    }

    static fromObject(obj) {
        return new Point(obj.row, obj.col);
    }

    static fromString(str) {
        const obj = JSON.parse(str);
        return Point.fromObject(obj);
    }
}

class Line {
    start;
    end;
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    equals(line) {
        return (
            (this.start.equals(line.start) && this.end.equals(line.end)) ||
            (this.start.equals(line.end) && this.end.equals(line.start))
        );
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(obj) {
        return new Line(Point.fromObject(obj.start), Point.fromObject(obj.end));
    }

    static fromString(str) {
        const obj = JSON.parse(str);
        return Line.fromObject(obj);
    }
}

class Tile {
    point;
    player;

    constructor(point, player) {
        this.point = point;
        this.player = player;
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(obj) {
        return new Tile(Point.fromObject(obj.point), obj.player);
    }

    static fromString(json) {
        const obj = JSON.parse(json);
        return Tile.fromObject(obj);
    }
}

class Player {
    username;
    score;
    avatar;
    connected;

    constructor(username, score, avatar, connected = true) {
        this.username = username;
        this.score = score;
        this.avatar = avatar;
        this.connected = connected;
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(obj) {
        return new Player(obj.username, obj.score, obj.avatar, obj.connected);
    }

    static fromString(json) {
        const obj = JSON.parse(json);
        return Player.fromObject(obj);
    }
}

class Game {
    roomId;
    players = [];
    turn = '';
    winner = '';
    lines = [];
    tiles = [];
    started;

    constructor(
        roomId,
        players = [],
        turn = '',
        winner = [],
        lines = [],
        tiles = [],
        started = false
    ) {
        this.roomId = roomId;
        this.players = players;
        this.turn = turn;
        this.winner = winner;
        this.lines = lines;
        this.tiles = tiles;
    }

    toString() {
        return JSON.stringify(this);
    }

    static fromObject(obj) {
        return new Game(
            obj.roomId,
            obj.players.map((player) => Player.fromObject(player)),
            obj.turn,
            Player.fromObject(obj.winner),
            obj.lines.map((line) => Line.fromObject(line)),
            obj.tiles.map((tile) => Tile.fromObject(tile)),
            obj.started
        );
    }

    static fromString(json) {
        const obj = JSON.parse(json);
        return Game.fromObject(obj);
    }
}

export { Game, Line, Player, Point, Tile };

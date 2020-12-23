import {Point} from './point.js';

const FOLLOW_SPEED = 0.025; //따라오는 속도. (0.18)
const ROTATE_SPEED = 0.25; //돌아감에 영향을 주는 속도. (0.12)
const MAX_ANGLE = 10; //돌아가는 최대 각도. (30)
const FPS = 1000 / 60; //프레임.
const WIDTH = 200; //가로 크기. (260)
const HEIGHT = 200; //세로 크기. (260)

export class Dialog {
    constructor() {
        this.pos = new Point();
        this.target = new Point();
        this.prevPos = new Point();
        this.downPos = new Point();
        this.startPos = new Point();
        this.mousePos = new Point();
        this.centerPos = new Point();
        this.origin = new Point();
        this.rotation = 0;
        this.sideValue = 0;
        this.isDown = false;
    }

    resize(stageWidth, stageHeight) {
        this.pos.x = Math.random() * (stageWidth - WIDTH);
        this.pos.y = Math.random() * (stageHeight - HEIGHT);
        this.target = this.pos.clone();
        this.prevPos = this.pos.clone();
    }

    animate(ctx) {
        const move = this.target.clone().subtract(this.pos).reduce(FOLLOW_SPEED);
        this.pos.add(move);

        this.centerPos = this.pos.clone().add(this.mousePos);

        this.swingDrag(ctx);

        this.prevPos = this.pos.clone(); //원래 상태로 돌아감.
    }

    swingDrag(ctx) {
        const dx = this.pos.x - this.prevPos.x;
        const speedX = Math.abs(dx) / FPS;
        const speed = Math.min(Math.max(speedX, 0), 1);

        let rotation = (MAX_ANGLE / 1) * speed;
        rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

        this.rotation += (rotation - this.rotation) * ROTATE_SPEED;

        const tmpPos = this.pos.clone().add(this.origin);
        ctx.save();
        ctx.translate(tmpPos.x, tmpPos.y);
        ctx.rotate(this.rotation * Math.PI / 100);
        ctx.beginPath();
        ctx.fillStyle = `#ffd100`; //Dialog의 스타일.
        ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT);
        ctx.restore();
    }

    down(point) {
        if (point.collide(this.pos, WIDTH, HEIGHT)) {
            this.isDown = true;
            this.startPos = this.pos.clone();
            this.downPos = point.clone();
            this.mousePos = point.clone().subtract(this.pos);
            
            const xRatioValue = this.mousePos.x / WIDTH;
            this.origin.x = WIDTH * xRatioValue;
            this.origin.y = HEIGHT * this.mousePos.y / HEIGHT;

            this.sideValue = xRatioValue - 0.5;

            return this;
        } else {
            return null;
        }
    }

    move(point) {
        if (this.isDown) {
            this.target = this.startPos.clone().add(point).subtract(this.downPos);
        }
    }

    up() {
        this.isDown = false;
    }
}
var events = require('events')
  , util = require('util')
  , _ = require('underscore')
  , Vector = require('vector')
  , helpers = require('../lib/canvas-helpers')
  , ui = require('./models/ui-model')
;

var Ball = function(position, value) {
    this.position = position;
    this.strength = value; // is always > 1 and between [1, 2]
    this.speed = new Vector(0, this.strength * 6.8);

    this.dead = false;
    this.lifeTime = 1;
    this.lastSpeed = new Vector(0, 0);

    events.EventEmitter.call(this);

    this.bounces = 0;
    this.emit('bounce', this.strength, this.bounces);
}

util.inherits(Ball, events.EventEmitter);

_.extend(Ball.prototype, {
    isDead: function() {
        return this.dead;
    },

    update: function(dt) {
        var gravity = new Vector(0, ui.get('gravity'));

        if (this.position.y >= 0) {
            this.speed.multiply(-0.8);
            this.bounces++;
            this.emit('bounce', this.strength * this.lifeTime, this.bounces);
        }

        this.speed.add(gravity.multiply(dt));
        this.position.add(this.speed);

        if (this.position.y > 0) {
            this.position.y = 0;
        }

        this.lifeTime -= 0.005;
        if (this.lifeTime < 0) { this.dead = true; }

        this.lastSpeed = this.speed.clone();
    },

    display: function(ctx) {
        if (this.isDead()) { return; }

        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = this.lifeTime; // this.strength - 1;
        ctx.strokeStyle = '#454545';
        ctx.translate(this.position.x, this.position.y - 5);
        ctx.arc(0, 0, 3, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
});

module.exports = Ball;

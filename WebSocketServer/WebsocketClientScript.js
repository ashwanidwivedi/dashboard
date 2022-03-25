﻿

// Canvas Block
var input = document.querySelector('input[type=file]'); // see Example 4

input.onchange = function () {
    var file = input.files[0];
    drawOnCanvas(file);
};

var canvas = document.querySelector('canvas');
//canvas.addEventListener('mousedown', mouseDown, false);
//canvas.addEventListener('mouseup', mouseUp, false);
//canvas.addEventListener('mousemove', mouseMove, false);
var ctx = canvas.getContext('2d');
const rect = (() => {
    var x1, y1, x2, y2;
    var show = false;
    function fix() {
        rect.x = Math.min(x1, x2);
        rect.y = Math.min(y1, y2);
        rect.w = Math.max(x1, x2) - Math.min(x1, x2);
        rect.h = Math.max(y1, y2) - Math.min(y1, y2);
    }



    function draw(ctx) { ctx.strokeRect(this.x, this.y, this.w, this.h) }
    const rect = { x: 0, y: 0, w: 0, h: 0, draw };
    const API = {
        restart(point) {
            x2 = x1 = point.x;
            y2 = y1 = point.y;
            fix();
            show = true;
        },
        update(point) {
            x2 = point.x;
            y2 = point.y;
            fix();
            show = true;
        },
        toRect() {
            show = false;
            return Object.assign({}, rect);
        },
        draw(ctx) {
            write(x2, y2);
            if (show) { rect.draw(ctx) }
        },
        show: false,
    }
    return API;
})();

function write(x, y) {
    var text = document.getElementById("name").value;
    ctx.font = "30px Arial";
    ctx.fontColor = "white";
    ctx.fillText(text, x, y);
};

var drag = false;
var img = new Image();

function drawOnCanvas(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var dataURL = e.target.result;

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataURL;
    };
    reader.readAsDataURL(file);
}

requestAnimationFrame(mainLoop);
const storedRects = [];
const storedTags = [];
//const baseImage = loadImage("https://www.w3schools.com/css/img_fjords.jpg");
var refresh = true;

function loadImage(url) {
    const image = new Image();
    image.src = url;
    image.onload = () => refresh = true;
    return image;
}


const mouse = {
    button: false,
    x: 0,
    y: 0,
    down: false,
    up: false,
    element: null,
    event(e) {
        const m = mouse;
        m.bounds = m.element.getBoundingClientRect();
        m.x = e.pageX - m.bounds.left - scrollX;
        m.y = e.pageY - m.bounds.top - scrollY;
        const prevButton = m.button;
        m.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : mouse.button;
        if (!prevButton && m.button) { m.down = true }
        if (prevButton && !m.button) { m.up = true }
    },
    start(element) {
        mouse.element = element;
        "down,up,move".split(",").forEach(name => document.addEventListener("mouse" + name, mouse.event));
    }
}

mouse.start(canvas);
function draw() {
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.width);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    storedRects.forEach(rect => rect.draw(ctx));
    ctx.strokeStyle = "red";
    rect.draw(ctx);
}

function mainLoop() {
    if (refresh || mouse.down || mouse.up || mouse.button) {
        refresh = false;
        if (mouse.down) {
            mouse.down = false;
            rect.restart(mouse);
        } else if (mouse.button) {
            rect.update(mouse);
        } else if (mouse.up) {
            mouse.up = false;
            rect.update(mouse);
            storedRects.push(rect.toRect());
        }
        draw();
    }
    requestAnimationFrame(mainLoop)
}
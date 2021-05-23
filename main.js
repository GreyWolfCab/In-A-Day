var canvas = document.getElementById("clockface-canvas");
var ctx = canvas.getContext("2d");//create a 2d drawing object
var radius = canvas.height / 2;
ctx.translate(radius, radius);//set the (0, 0) coordinate to the center of the canvas
radius = radius * 0.9;//reduce the clock size to be within the canvas

let faceTotal = 24;

var displayDate = document.getElementById("date");

var clockfaceButton = document.getElementById("clockface-button");
var clockfaceState = 0;

drawClock();//initially draws clock
setInterval(drawClock, 30000);//update every half minute
displayCurrentDate();//initially display todays date

function changeClockface() {
    let type = clockfaceButton.textContent;

    switch (type) {
        case "24":
            clockfaceButton.textContent = "A.M.";
            clockfaceState = 1;
            faceTotal = 12;
            drawClock();
            break;
        case "A.M.":
            clockfaceButton.textContent = "P.M.";
            clockfaceState = 2;
            faceTotal = 12;
            drawClock();
            break;
        case "P.M.":
            clockfaceButton.textContent = "24";
            clockfaceState = 0;
            faceTotal = 24;
            drawClock();
            break;
    }
}

function displayCurrentDate() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth();//starts at 0
    let year = currentDate.getFullYear();
    displayDate.innerText = day + " " + getMonth(month) + " " + year
}

function getMonth(month) {
    switch (month) {
        case 0: return "January";
        case 1: return "February";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
    }
}

function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
    //draw white background
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();

    //draw center black circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(24,24,24)";
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    let angle;
    let number;
    let fromRadius = 0.87;//print number to percentage of the radius
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(170,170,170)";
    for (number = 1; number <= faceTotal; number++) {
        angle = number * (Math.PI*2) / (faceTotal);
        ctx.rotate(angle);
        ctx.translate(0, -radius * fromRadius);
        ctx.rotate(-angle);
        ctx.fillText(number.toString(), 0, 0);
        ctx.rotate(angle);
        ctx.translate(0, radius * fromRadius);
        ctx.rotate(-angle);
    }
}

function drawTime(ctx, radius) {
    //get current time
    let now = new Date();
    let hour = now.getHours();
    let mins = now.getMinutes();
    switch (clockfaceState) {
        case 0://always draw hand for 24 hours state
            hour = (hour * Math.PI / (faceTotal/2)) + (mins * Math.PI / ((faceTotal/2)*60));//find the angle of the hour hand (include minutes passed)
            drawHand(ctx, hour, radius*0.75, radius*0.04);//draw hand up to 75% radius
            break;
        case 1://only draw hand if current hour is in the morning
            if (hour < 12) {
                hour = (hour * Math.PI / (faceTotal/2)) + (mins * Math.PI / ((faceTotal/2)*60));//find the angle of the hour hand (include minutes passed)
                drawHand(ctx, hour, radius*0.75, radius*0.04);//draw hand up to 75% radius
            }
            break;
        case 2://only draw hand if current hour is after noon
            if (hour >= 12 && hour < 24) {
                hour = (hour * Math.PI / (faceTotal/2)) + (mins * Math.PI / ((faceTotal/2)*60));//find the angle of the hour hand (include minutes passed)
                drawHand(ctx, hour, radius*0.75, radius*0.04);//draw hand up to 75% radius
            }
            break;
    }
    
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(24,24,24)";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }
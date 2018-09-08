/*****************************/
/*FILTERS*/
var negativeFilter = document.getElementById('negativo');
var brightFilter = document.getElementById('brillo');
var binarizFilter = document.getElementById('binarizacion');
var sepiaFilter = document.getElementById('sepia');

negativeFilter.addEventListener('click', function(){ invert(context)});
brightFilter.addEventListener('click', function(){ bright(context)});
binarizFilter.addEventListener('click', function(){ blackandwhite(context)});
sepiaFilter.addEventListener('click', function(){ sepiascale(context)});

function invert(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
    context.putImageData(imageData, 0, 0);
};

function bright(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        //var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = 2*data[i]  // red
        data[i + 1] = 2*data[i + 1] // green
        data[i + 2] = 2*data[i + 2] // blue
    }
    context.putImageData(imageData, 0, 0);
};

function blackandwhite(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < imageData.data.length; i+=4) {
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = imageData.data[i] > 127 ? 255 : 0;
    }
    context.putImageData(imageData, 0, 0);
}

function sepiascale(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i]     = Math.trunc(0.393*data[i] + 0.769*data[i + 1] + 0.189*data[i + 2]); // red
        data[i + 1] = Math.trunc(0.349*data[i] + 0.686*data[i + 1] + 0.168*data[i + 2]); // green
        data[i + 2] = Math.trunc(0.272*data[i] + 0.534*data[i + 1] + 0.131*data[i + 2]); // blue
    }
    context.putImageData(imageData, 0, 0);
};

var saturateFilter = document.getElementById('saturacion');
var blurFilter = document.getElementById('blur');
var smothFilter = document.getElementById('suavizado');
var borderFilter = document.getElementById('bordes');

saturateFilter.addEventListener('click', function(){ saturate(context)}); 
blurFilter.addEventListener('click', function(){ blur(context)}); 
smothFilter.addEventListener('click', function(){ smoth(context)});
borderFilter.addEventListener('click', function(){ border(context)});
   
function saturate(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var data = imageData.data;
    var value = 1;
    for (var i = 0; i < data.length; i += 4) {
        var gray = 0.2989*data[i] + 0.5870*data[i+ 1] + 0.1140*data[i + 2];
        data[i] = -gray * value + data[i] * (1 + value);
        data[i + 1] = -gray * value + data[i + 1] * (1 + value);
        data[i + 2] = -gray * value + data[i + 2] * (1 + value);
        if(data[i] > 255) data[i] = 255;
        if(data[i + 1] > 255) data[i] = 255;
        if(data[i + 2] > 255) data[i] = 255;
        if(data[i] < 0) data[i] = 0;
        if(data[i + 1] < 0) data[i] = 0;
        if(data[i + 2] < 0) data[i] = 0;
    }    
    context.putImageData(imageData, 0, 0);
}

function convolute(imageData, pixels) {
    var side = Math.round(Math.sqrt(pixels.length));
    var halfSide = Math.floor(side/2);

    var src = imageData.data;
    var sw = imageData.width;
    var sh = imageData.height;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;

    var output = context.createImageData(w, h);
    var dst = output.data;

    for (var y=0; y<h; y++) {
        for (var x=0; x<w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y*w+x)*4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            var r=0, g=0, b=0, a=0;
            for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy*sw+scx)*4;
                        var wt = pixels[cy*side+cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff+1] * wt;
                        b += src[srcOff+2] * wt;
                        a += src[srcOff+3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff+1] = g;
            dst[dstOff+2] = b;
            dst[dstOff+3] = 255;
        }
    }
    context.putImageData(output, 0,0);
}

function blur(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    convolute(imageData, [  1/9, 1/9, 1/9,
                            1/9, 1/9, 1/9,
                            1/9, 1/9, 1/9 ]);
}

function smoth(ctx) {
    // var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    // convolute(imageData, [   0,1/9,0,
    //     1/9,2/9,1/9,
    //     0,1/9,0]); 
}

function border(ctx) {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    convolute(imageData, [   0, -1,  0,
                            -1,  5, -1,
                             0, -1,  0 ]); 
}

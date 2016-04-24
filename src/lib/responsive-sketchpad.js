var strokes;
var undos;
var context;

const DEBUG = true;

function Sketchpad(el, opts) {
    var that = this;

    if (!el) {
        throw new Error('Must pass in a container element');
    }

    var opts = opts || {};
    opts.aspectRatio = opts.aspectRatio || 1;
    opts.width = opts.width || el.clientWidth;
    opts.height = opts.height || opts.width * opts.aspectRatio;
    opts.data = opts.data || [];

    // Canvas Context
    opts.lineColor = opts.lineColor || 'black';
    opts.lineSize = opts.lineSize || 5;
    opts.lineCap = opts.lineCap || 'round';
    opts.lineJoin = opts.lineJoin || 'round';
    opts.lineMiterLimit = opts.lineMiterLimit || 10;

    strokes = opts.data;
    undos = [];

    // Boolean indicating if currently drawing
    var sketching = false;

    // Create a canvas element
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', opts.width);
    canvas.setAttribute('height', opts.height);
    canvas.style.width = opts.width + 'px';
    canvas.style.height = opts.height + 'px';
    el.appendChild(canvas);

    context = canvas.getContext('2d');

    // Return the mouse/touch location
    function getCursor(e) {
        var rect = that.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function redraw () {
        var j;
        var strokes = that.strokes;

        var width = that.canvas.width;
        var height = that.canvas.height;

        context.clearRect(0, 0, width, height);  // Clear Canvas

        for (var i = 0; i < strokes.length; i++) {
            var stroke = strokes[i].stroke;

            if (strokes[i].lineColor == 'eraser') {


                if (!strokes[i].debug) {
                    context.globalCompositeOperation = "destination-out";
                }


                context.save();
                context.beginPath();
                context.fillStyle = 'red';

                context.scale(strokes[i].transform.zoom, strokes[i].transform.zoom);

                context.moveTo(stroke[0].x, stroke[0].y);

                for (j = 1; j < stroke.length; j++) {
                    context.lineTo(stroke[j].x, stroke[j].y);
                }
                context.closePath();
                context.fill();
                context.restore();



                if (!strokes[i].debug) {
                    context.globalCompositeOperation = "source-over";
                }

            } else {

                context.beginPath();
                for (j = 0; j < stroke.length - 1; j++) {
                    context.moveTo(stroke[j].x * width, stroke[j].y * height);
                    context.lineTo(stroke[j + 1].x * width, stroke[j + 1].y * height);
                }
                context.closePath();

                context.strokeStyle = strokes[i].lineColor;
                context.lineWidth = strokes[i].lineSize * width;
                context.lineJoin = strokes[i].lineJoin;
                context.lineCap = strokes[i].lineCap;
                context.miterLimit = strokes[i].lineMiterLimit;

                context.stroke()

            }
        }
    }

    // On mouse down, create a new stroke with a start location
    function startLine (e) {
        e.preventDefault();

        var width = that.canvas.width;
        var height = that.canvas.height;

        strokes = that.strokes;
        sketching = true;
        that.undos = [];

        strokes.push({
            stroke: [],
            lineColor: opts.lineColor,
            lineSize: opts.lineSize / width,
            lineCap: opts.lineCap,
            lineJoin: opts.lineJoin,
            lineMiterLimit: opts.lineMiterLimit
        });

        var cursor = getCursor(e);
        strokes[strokes.length - 1].stroke.push({
            x: cursor.x / width,
            y: cursor.y / height
        });
    }

    function drawLine (e) {
        if (!sketching) {
            return
        }

        var width = that.canvas.width;
        var height = that.canvas.height;

        var cursor = getCursor(e);
        that.strokes[strokes.length - 1].stroke.push({
            x: cursor.x / width,
            y: cursor.y / height
        });

        that.redraw();
    }

    function endLine (e) {
        if (!sketching) {
            return
        }

        var width = that.canvas.width;
        var height = that.canvas.height;

        sketching = false;
        var cursor = getCursor(e);
        that.strokes[strokes.length - 1].stroke.push({
            x: cursor.x / width,
            y: cursor.y / height
        });

        that.redraw();
    }

    // Event Listeners
    canvas.addEventListener('mousedown', startLine);
    canvas.addEventListener('mousemove', drawLine);
    canvas.addEventListener('mouseup', endLine);
    canvas.addEventListener('mouseleave', endLine);

    // Public variables
    this.canvas = canvas;
    this.strokes = strokes;
    this.undos = undos;
    this.opts = opts;

    // Public functions
    this.redraw = redraw;
}


Sketchpad.prototype.undo = function () {
    if (this.strokes.length === 0){
        return;
    }

    this.undos.push(this.strokes.pop());
    this.redraw();
}


Sketchpad.prototype.redo = function () {
    if (this.undos.length === 0) {
        return;
    }

    this.strokes.push(this.undos.pop());
    this.redraw();
}


Sketchpad.prototype.clear = function () {
    this.undos = [];
    this.strokes = [];
    this.redraw();
}


Sketchpad.prototype.toJSON = function () {
    return {
        aspectRatio: 0,
        strokes: this.strokes
    };
}


Sketchpad.prototype.loadData = function (data) {
    this.strokes = data.strokes;
    this.redraw();
}


Sketchpad.prototype.getImage = function () {
    return '<img src="' + this.canvas.toDataURL('image/png') + '"/>';
}


Sketchpad.prototype.setLineSize = function (size) {
    this.opts.lineSize = size;
}


Sketchpad.prototype.setLineColor = function (color) {
    this.opts.lineColor = color;
}


Sketchpad.prototype.erase = function (args) {
    var data;

    if (args.debug) {
        data = [{"stroke":[{"x":0.4376633275261324,"y":0.23337091319052988},{"x":0.4376633275261324,"y":0.23675310033821872},{"x":0.44985844947735193,"y":0.25817361894024804},{"x":0.46728005226480834,"y":0.2874859075535513},{"x":0.48644381533101044,"y":0.3134160090191657},{"x":0.5247713414634146,"y":0.3900789177001127},{"x":0.5421929442508711,"y":0.46110484780157834},{"x":0.5474194250871081,"y":0.4836527621195039},{"x":0.5509037456445993,"y":0.4971815107102593},{"x":0.5509037456445993,"y":0.49943630214205187},{"x":0.5509037456445993,"y":0.5028184892897407},{"x":0.5509037456445993,"y":0.5073280721533259},{"x":0.5509037456445993,"y":0.5152198421645998},{"x":0.5509037456445993,"y":0.5186020293122886},{"x":0.5509037456445993,"y":0.5231116121758738},{"x":0.5509037456445993,"y":0.52423900789177},{"x":0.5509037456445993,"y":0.5276211950394588},{"x":0.5474194250871081,"y":0.5400225479143179},{"x":0.5421929442508711,"y":0.5569334836527621},{"x":0.5195448606271778,"y":0.5952649379932357},{"x":0.5056075783972126,"y":0.6155580608793687},{"x":0.4759908536585366,"y":0.6538895152198422},{"x":0.4568270905923345,"y":0.6708004509582863},{"x":0.43243684668989546,"y":0.6910935738444194},{"x":0.42024172473867594,"y":0.6967305524239008},{"x":0.40456228222996515,"y":0.7012401352874859},{"x":0.4028201219512195,"y":0.7012401352874859},{"x":0.390625,"y":0.6956031567080045},{"x":0.37320339721254353,"y":0.6798196166854565},{"x":0.35752395470383275,"y":0.6617812852311161},{"x":0.3470709930313589,"y":0.6426155580608793},{"x":0.32268074912891986,"y":0.5862457722660653},{"x":0.31222778745644597,"y":0.5569334836527621},{"x":0.29132186411149824,"y":0.5163472378804961},{"x":0.2686737804878049,"y":0.4746335963923337},{"x":0.25647865853658536,"y":0.4509582863585118},{"x":0.2512521777003484,"y":0.44081172491544535},{"x":0.24951001742160278,"y":0.42615558060879366},{"x":0.24951001742160278,"y":0.41713641488162345},{"x":0.24951001742160278,"y":0.41262683201803835},{"x":0.24951001742160278,"y":0.4081172491544532},{"x":0.24951001742160278,"y":0.4036076662908681},{"x":0.24951001742160278,"y":0.40135287485907556},{"x":0.24951001742160278,"y":0.399098083427283},{"x":0.24951001742160278,"y":0.3979706877113867},{"x":0.2529943379790941,"y":0.3979706877113867},{"x":0.2547364982578397,"y":0.3979706877113867},{"x":0.2617051393728223,"y":0.3979706877113867},{"x":0.27564242160278746,"y":0.3979706877113867},{"x":0.2791267421602787,"y":0.3979706877113867},{"x":0.30177482578397213,"y":0.41488162344983087},{"x":0.30351698606271776,"y":0.41488162344983087},{"x":0.35055531358885017,"y":0.41488162344983087},{"x":0.4063044425087108,"y":0.41488162344983087},{"x":0.46205357142857145,"y":0.41713641488162345},{"x":0.49863893728222997,"y":0.42615558060879366},{"x":0.5247713414634146,"y":0.4351747463359639},{"x":0.5387086236933798,"y":0.44081172491544535},{"x":0.5613567073170732,"y":0.45208568207440814},{"x":0.5665831881533101,"y":0.45434047350620066},{"x":0.5683253484320557,"y":0.455467869222097},{"x":0.5700675087108014,"y":0.4588500563697858},{"x":0.5700675087108014,"y":0.4599774520856821},{"x":0.571809668989547,"y":0.4599774520856821},{"x":0.5822626306620209,"y":0.4588500563697858},{"x":0.5944577526132404,"y":0.4464487034949267},{"x":0.6223323170731707,"y":0.4024802705749718},{"x":0.6380117595818815,"y":0.36189402480270577},{"x":0.6589176829268293,"y":0.28410372040586246},{"x":0.6624020034843205,"y":0.27282976324689967},{"x":0.6641441637630662,"y":0.2649379932356257},{"x":0.6641441637630662,"y":0.26268320180383314},{"x":0.6624020034843205,"y":0.26268320180383314},{"x":0.6624020034843205,"y":0.266065388951522},{"x":0.6624020034843205,"y":0.2717023675310034},{"x":0.6833079268292683,"y":0.28410372040586246},{"x":0.7878375435540069,"y":0.34047350620067646},{"x":0.8279072299651568,"y":0.3664036076662909},{"x":0.9028201219512195,"y":0.4317925591882751},{"x":0.9184995644599303,"y":0.44532130777903045},{"x":0.9306946864111498,"y":0.46561443066516345},{"x":0.9324368466898955,"y":0.4746335963923337},{"x":0.9254682055749129,"y":0.49492671927846676},{"x":0.8871406794425087,"y":0.52423900789177},{"x":0.8610082752613241,"y":0.5434047350620068},{"x":0.7930640243902439,"y":0.5760992108229989},{"x":0.7721581010452961,"y":0.5839909808342728},{"x":0.7233776132404182,"y":0.6065388951521984},{"x":0.7146668118466899,"y":0.6110484780157835},{"x":0.6972452090592335,"y":0.62119503945885},{"x":0.6885344076655052,"y":0.629086809470124},{"x":0.6676284843205574,"y":0.6414881623449831},{"x":0.6536912020905923,"y":0.6482525366403608},{"x":0.6432382404181185,"y":0.649379932356257},{"x":0.6432382404181185,"y":0.649379932356257}],"lineColor":"#4CAF50","lineSize":0.008710801393728223,"lineCap":"round","lineJoin":"round","lineMiterLimit":10},{"stroke":[{"x":0.0822626306620209,"y":0.3100338218714769},{"x":0.08748911149825785,"y":0.30665163472378804},{"x":0.10839503484320558,"y":0.30101465614430667},{"x":0.14149608013937282,"y":0.2897406989853439},{"x":0.16937064459930315,"y":0.2818489289740699},{"x":0.21292465156794424,"y":0.2615558060879369},{"x":0.24951001742160278,"y":0.24351747463359638},{"x":0.2773845818815331,"y":0.22998872604284104},{"x":0.30351698606271776,"y":0.21758737316798196},{"x":0.32964939024390244,"y":0.20631341600901917},{"x":0.34184451219512196,"y":0.1995490417136415},{"x":0.37668771777003485,"y":0.18489289740698986},{"x":0.4028201219512195,"y":0.17249154453213078},{"x":0.41327308362369336,"y":0.1668545659526494},{"x":0.4254682055749129,"y":0.16234498308906425},{"x":0.43940548780487804,"y":0.1589627959413754},{"x":0.5056075783972126,"y":0.15783540022547915},{"x":0.5160605400696864,"y":0.15783540022547915},{"x":0.5247713414634146,"y":0.1544532130777903},{"x":0.5404507839721254,"y":0.14994363021420518},{"x":0.5630988675958188,"y":0.14994363021420518},{"x":0.5805204703832753,"y":0.14994363021420518},{"x":0.5857469512195121,"y":0.14994363021420518},{"x":0.5892312717770035,"y":0.14994363021420518},{"x":0.5909734320557491,"y":0.15107102593010147},{"x":0.5944577526132404,"y":0.15219842164599776},{"x":0.5979420731707317,"y":0.1544532130777903},{"x":0.5996842334494773,"y":0.1555806087936866},{"x":0.5996842334494773,"y":0.15783540022547915},{"x":0.5996842334494773,"y":0.15783540022547915}],"lineColor":"#4CAF50","lineSize":0.008710801393728223,"lineCap":"round","lineJoin":"round","lineMiterLimit":10},{"stroke":[{"x":0.1833079268292683,"y":0.6696730552423901},{"x":0.1833079268292683,"y":0.6708004509582863},{"x":0.1833079268292683,"y":0.6922209695603156},{"x":0.19376088850174217,"y":0.7181510710259301},{"x":0.26518945993031356,"y":0.8004509582863585},{"x":0.3348758710801394,"y":0.8387824126268321},{"x":0.4167574041811847,"y":0.8613303269447576},{"x":0.47947517421602787,"y":0.8692220969560316},{"x":0.5108340592334495,"y":0.8726042841037204},{"x":0.5212870209059234,"y":0.8737316798196166},{"x":0.5317399825783972,"y":0.8737316798196166},{"x":0.5683253484320557,"y":0.8658399098083427},{"x":0.6188479965156795,"y":0.8556933483652762},{"x":0.7076981707317073,"y":0.8432919954904171},{"x":0.7756424216027874,"y":0.8387824126268321},{"x":0.7930640243902439,"y":0.8365276211950394},{"x":0.8104856271777003,"y":0.8331454340473506},{"x":0.817454268292683,"y":0.8286358511837655},{"x":0.8209385888501742,"y":0.826381059751973},{"x":0.8226807491289199,"y":0.8252536640360767},{"x":0.8296493902439024,"y":0.8218714768883878},{"x":0.8296493902439024,"y":0.8218714768883878}],"lineColor":"#4CAF50","lineSize":0.008710801393728223,"lineCap":"round","lineJoin":"round","lineMiterLimit":10},{"stroke":[{"x":0.6414960801393729,"y":0.7452085682074409},{"x":0.6484647212543554,"y":0.7452085682074409},{"x":0.685050087108014,"y":0.741826381059752},{"x":0.7355727351916377,"y":0.7373167981961668},{"x":0.7808689024390244,"y":0.7316798196166855},{"x":0.8505553135888502,"y":0.7316798196166855},{"x":0.8923671602787456,"y":0.7316798196166855},{"x":0.9219838850174216,"y":0.7316798196166855},{"x":0.9359211672473867,"y":0.7316798196166855},{"x":0.9411476480836237,"y":0.7316798196166855},{"x":0.944631968641115,"y":0.7316798196166855},{"x":0.944631968641115,"y":0.7328072153325818},{"x":0.944631968641115,"y":0.7328072153325818}],"lineColor":"#4CAF50","lineSize":0.008710801393728223,"lineCap":"round","lineJoin":"round","lineMiterLimit":10}]
        data.push(
            {
                debug: true,
                transform: args.transform,
                stroke: args.strokes,
                lineColor: 'eraser'
            }
        );

        this.strokes = data;

    } else {
        this.strokes.push({
            debug: false,
            transform: args.transform,
            stroke: args.strokes,
            lineColor: 'eraser'
        });
    }

    this.redraw();
}

Sketchpad.prototype.resize = function (width) {
    var height = width * this.opts.aspectRatio;
    this.opts.lineSize = this.opts.lineSize * (width / this.opts.width);
    this.opts.width = width;
    this.opts.height = height;

    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.redraw();
};


module.exports = Sketchpad;

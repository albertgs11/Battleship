window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {
    READ_WRITE: "readwrite"
};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

var rows = 10;
var cols = 10;
var gameBoard;

var barco2ocurrencies = 0;
var barco3ocurrencies = 0;
var barco4ocurrencies = 0;
var barco5ocurrencies = 0;

var barcos = [];

var resetOcurrencies = function () {
    barco2ocurrencies = 0;
    barco3ocurrencies = 0;
    barco4ocurrencies = 0;
    barco5ocurrencies = 0;
    for (var i = 2; i <= 5; i++) {
        var x = document.getElementById("barco" + i);
        x.setAttribute("draggable", "true");
        x.setAttribute("ondragstart", "dragStart(event)");
    }
}

var setVariables5x5 = function () {
    rows = 5;
    cols = 5;
    gameBoard = [
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ];
    resetOcurrencies();
    initGame();
}

var setVariables7x7 = function () {
    rows = 7;
    cols = 7;
    gameBoard = [
        [0, 1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0]
    ];
    resetOcurrencies();
    initGame();
}

var setVariables10x10 = function () {
    rows = 10;
    cols = 10;
    gameBoard = [
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    resetOcurrencies();
    initGame();
}

var audioExplosio = function () {
    var audio = document.createElement("audio");
    audio.src = "media/explosio.mp3";
    audio.play();
}

var audioAigua = function () {
    var audio = document.createElement("audio");
    audio.src = "media/water.mp3";
    audio.play();
}

var initGame = function () {
    var partida = Object.create(Partida);
    partida.gameBoard = this.gameBoard;
    var nomJugador = document.getElementById("nomJugador").value;
    var jugador = Object.create(Jugador);
    jugador.nom = nomJugador;
    crearBarcos();
    add();

    var mainDiv = document.getElementById("clicktable");
    var ddtable = document.getElementById("ddtable");
    var gameboardDiv = document.getElementById("gameboard");
    var gameboardDiv2 = document.getElementById("gameboard2");

    if (gameboardDiv || gameboardDiv2) {
        document.getElementById("gameboard").remove();
        document.getElementById("gameboard2").remove();
    }

    var gameBoardContainer = document.createElement("div");
    var gameBoardContainer2 = document.createElement("div");
    gameBoardContainer.setAttribute("id", "gameboard");
    gameBoardContainer2.setAttribute("id", "gameboard2");
    mainDiv.appendChild(gameBoardContainer);
    ddtable.appendChild(gameBoardContainer2);

    for (i = 1; i <= rows; i++) {
        for (j = 1; j <= cols; j++) {

            var square = document.createElement("div");
            var square2 = document.createElement("div");
            square2.setAttribute("ondrop", "drop(event)");
            square2.setAttribute("ondragover", "allowDrop(event)");
            gameBoardContainer.appendChild(square);
            gameBoardContainer2.appendChild(square2);

            square.id = 'sd' + j + i;
            square2.className = 'td';
            square2.id = 'td' + j + i;

            var topPosition = j * partida.squareSize;
            var leftPosition = i * partida.squareSize;

            square.style.top = topPosition + 'px';
            square.style.left = leftPosition + 'px';

            square2.style.top = topPosition + 'px';
            square2.style.left = leftPosition + 'px';
        }
    }

    var hitCount = 0;
    var puntuacio = 0;
    gameBoardContainer.addEventListener("click", fireTorpedo, false);

    function maquinaTorpedo() {
        var rnd1 = Math.floor((Math.random() * 5) + 1);
        var rnd2 = Math.floor((Math.random() * 5) + 1);
        var cela = document.getElementById("td" + rnd1 + rnd2);
        if (cela.childNodes.length < 1) {
            cela.style.background = '#42E8F3';
        } else {
            cela.removeChild(cela.childNodes[0]);
            var img = document.createElement("img");
            img.src = 'imatges/explosion.png';
            img.setAttribute("class","js-fade fade-in is-paused");
            cela.appendChild(img);
            img.classList.remove('is-paused');
        }
    }

    function fireTorpedo(e) {
        if (e.target !== e.currentTarget) {
            var row = e.target.id.substring(2, 3) - 1;
            var col = e.target.id.substring(3, 4) - 1;
            if (gameBoard[row][col] == 0) {
                audioAigua();
                e.target.style.background = '#bbb';
                gameBoard[row][col] = 3;
            } else if (gameBoard[row][col] == 1) {
                audioExplosio();
                e.target.style.background = 'red';
                gameBoard[row][col] = 2;
                puntuacio++;
                hitCount++;
                if (rows == 5) {
                    if (hitCount == 9) {
                        jugador.puntuacio = puntuacio;
                        alert("Has guanyat");
                    }
                } else if ((rows == 7) || (rows == 10)) {
                    if (hitCount == 18) {
                        jugador.puntuacio = puntuacio;
                        alert("Has guanyat");
                    }
                }
            } else if (gameBoard[row][col] > 1) {}
        }
        e.stopPropagation();
        maquinaTorpedo();
        emmagatzematge.desar(jugador.nom, jugador.puntuacio);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("imatge", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("imatge");

    if (data == "barco2") {
        for (var i = 0; i < 2; i++) {
            var imatge = document.createElement("img");
            imatge.src = "imatges/barco2/piece" + (i * 1 + 1) + ".png";
            var idsi = ev.target.id.slice(-2);
            if (!document.getElementById("td" + (idsi * 1 + 1))) {
                idsi = idsi - 1;
            } else if (!document.getElementById("td" + (idsi * 1 + 2))) {
                idsi = idsi;
            }
            var ids = idsi * 1 + i * 1;
            if (document.getElementById("td" + ids).childNodes.length < 1) {
                document.getElementById("td" + ids).appendChild(imatge);
            }
        }
        barco2ocurrencies++;
        checkOcurrencies();
    }
    if (data == "barco3") {
        for (var i = 0; i < 3; i++) {
            var imatge = document.createElement("img");
            imatge.src = "imatges/barco3/piece" + (i * 1 + 1) + ".png";
            var idsi = ev.target.id.slice(-2);
            if (!document.getElementById("td" + (idsi * 1 + 1))) {
                idsi = idsi - 2;
            } else if (!document.getElementById("td" + (idsi * 1 + 2))) {
                idsi = idsi - 1;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 3))) {
                idsi = idsi;
            }
            var ids = idsi * 1 + i * 1;
            if (document.getElementById("td" + ids).childNodes.length < 1) {
                document.getElementById("td" + ids).appendChild(imatge);
            }
        }
        barco3ocurrencies++;
        checkOcurrencies();
    }
    if (data == "barco4") {
        for (var i = 0; i < 4; i++) {
            var imatge = document.createElement("img");
            imatge.src = "imatges/barco4/piece" + (i * 1 + 1) + ".png";
            var idsi = ev.target.id.slice(-2);
            if (!document.getElementById("td" + (idsi * 1 + 1))) {
                idsi = idsi - 3;
            } else if (!document.getElementById("td" + (idsi * 1 + 2))) {
                idsi = idsi - 2;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 3))) {
                idsi = idsi - 1;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 4))) {
                idsi = idsi;
            }
            var ids = idsi * 1 + i * 1;
            if (document.getElementById("td" + ids).childNodes.length < 1) {
                document.getElementById("td" + ids).appendChild(imatge);
            }
        }
        barco4ocurrencies++;
        checkOcurrencies();
    }
    if (data == "barco5") {
        for (var i = 0; i < 5; i++) {
            var imatge = document.createElement("img");
            imatge.src = "imatges/barco5/piece" + (i * 1 + 1) + ".png";
            var idsi = ev.target.id.slice(-2);
            if (!document.getElementById("td" + (idsi * 1 + 1))) {
                idsi = idsi - 4;
            } else if (!document.getElementById("td" + (idsi * 1 + 2))) {
                idsi = idsi - 3;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 3))) {
                idsi = idsi - 2;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 4))) {
                idsi = idsi - 1;
            }
            else if (!document.getElementById("td" + (idsi * 1 + 5))) {
                idsi = idsi;
            }
            var ids = idsi * 1 + i * 1;
            if (document.getElementById("td" + ids).childNodes.length < 1) {
                document.getElementById("td" + ids).appendChild(imatge);
            }
        }
        barco5ocurrencies++;
        checkOcurrencies();
    }
}

var crearBarcos = function () {
    var destructor = Object.create(Barco);
    destructor.nom = "destructor";
    destructor.tamany = 2;
    var cruiser1 = Object.create(Barco);
    cruiser1.nom = "cruiser1";
    cruiser1.tamany = 3;
    var cruiser2 = Object.create(Barco);
    cruiser2.nom = "cruiser2";
    cruiser2.tamany = 3;
    var battleship = Object.create(Barco);
    battleship.nom = "battleship";
    battleship.tamany = 4;
    var aircraft = Object.create(Barco);
    aircraft.nom = "aircraft";
    aircraft.tamany = 5;

    barcos.push(destructor, cruiser1, cruiser2, battleship, aircraft);
}

function checkOcurrencies() {
    if (barco2ocurrencies >= 1) {
        var x = document.getElementById("barco2");
        x.removeAttribute("draggable");
        x.removeAttribute("ondragstart");
    }
    if (barco3ocurrencies >= 2) {
        var x = document.getElementById("barco3");
        x.removeAttribute("draggable");
        x.removeAttribute("ondragstart");
    }
    if (barco4ocurrencies >= 1) {
        var x = document.getElementById("barco4");
        x.removeAttribute("draggable");
        x.removeAttribute("ondragstart");
    }
    if (barco5ocurrencies >= 1) {
        var x = document.getElementById("barco5");
        x.removeAttribute("draggable");
        x.removeAttribute("ondragstart");
    }
}

var emmagatzematge = {

    desar: function (nom, puntuacio) {
        localStorage.setItem(nom, puntuacio);
    },
    netejar: function () {
        localStorage.clear();
    }
}

var peticioObertura = window.indexedDB.open("battleships", 6);
var db;
peticioObertura.onerror = function (event) {
    console.log("error: ");
};

peticioObertura.onsuccess = function (event) {
    db = peticioObertura.result;
};

peticioObertura.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("barcos", { keyPath: "nom" });
}

function add() {
    var barcosOjectStore = db.transaction("barcos", "readwrite").objectStore("barcos");
    for (var i in this.barcos) {
        barcosOjectStore.add({ nom: barcos[i].nom, tamny: barcos[i].tamany });
    }

    peticioObertura.onsuccess = function (event) {
        alert("onsucces");
    };

    peticioObertura.onerror = function (event) {
        alert("onerror");
    }
}
"use strict";
function byId(audio){return document.getElementById(audio);}

window.addEventListener('load', onDocLoaded, false);

function onDocLoaded()
{
    byId('mFileInput').addEventListener('change', onChosenFileChange, false);
}

function onChosenFileChange(evt)
{
    var fileType = this.files[0].type;

    if (fileType.indexOf('audio') != -1)
        loadFileObject(this.files[0], onSoundLoaded);

    else if (fileType.indexOf('video') != -1)
        loadFileObject(this.files[0], onVideoLoaded);
}

function loadFileObject(fileObj, loadedCallback)
{
    var reader = new FileReader();
    reader.onload = loadedCallback;
    reader.readAsDataURL( fileObj );
}

function onSoundLoaded(evt)
{
    byId('sound').src = evt.target.result;
    byId('sound').play();
    
    //byId('sound').playbackRate = 2;
    var button2 = document.getElementById('playback2');
    button2.onclick = function(){
    byId('sound').playbackRate = .25;
    };
    var button5 = document.getElementById('playback5');
    button5.onclick = function(){
    byId('sound').playbackRate = .50;
    };
    var button7 = document.getElementById('playback7');
    button7.onclick = function(){
    byId('sound').playbackRate = .75;
    };
    var button10 = document.getElementById('playback10');
    button10.onclick = function(){
    byId('sound').playbackRate = 1; 
    };
    var button12 = document.getElementById('playback12');
    button12.onclick = function () {
        byId('sound').playbackRate = 1.25;
    };
    var button15 = document.getElementById('playback15');
    button15.onclick = function () {
        byId('sound').playbackRate = 1.50;
    };
    var button17 = document.getElementById('playback17');
    button17.onclick = function () {
        byId('sound').playbackRate = 1.75;
    };
    var button20 = document.getElementById('playback20');
    button20.onclick = function () {
        byId('sound').playbackRate = 2;
    };
    var button22 = document.getElementById('playback22');
    button22.onclick = function () {
        byId('sound').playbackRate = 2.25;
    };
    var button25 = document.getElementById('playback25');
    button25.onclick = function () {
        byId('sound').playbackRate = 2.50;
    };
    var button27 = document.getElementById('playback27');
    button27.onclick = function () {
        byId('sound').playbackRate = 2.75;
    };
    var button30 = document.getElementById('playback30');
    button30.onclick = function () {
        byId('sound').playbackRate = 3;
    };
    var button_1 = document.getElementById('playback_1');
    button_1.onclick = function () {
        byId('sound').playbackRate = -1;
    };
    
    var guardar = document.getElementById('guardar');
    guardar.onclick = function (){
         document.getElementById('guardar').addEventListener("click", function () {
            // Generate download of hello.txt file with some content
            var text = "prueba";
            var filename = "hello.txt";

            download(filename, text);
        }, false);
    }
    
    var salvarmp3 = document.getElementById('salvar');
    salvarmp3.onclick = function () {
        document.getElementById("salvar").addEventListener("click", function () {

            download();
        }, false);
    
    }
    
    //data:audio/mp3;base64,...
    function download() {
        var content = document.getElementById('sound').play();

        var filename = "helli.mp3";

        var blob = new Blob([content], {
            type: "data:audio/mp3;base64"
        });

        saveAs(blob, filename);
    }
    
}


function onVideoLoaded(evt)
{
    byId('video').src = evt.target.result;
    byId('video').play();
}

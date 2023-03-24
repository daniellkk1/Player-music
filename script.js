//Seleção de elementos

const songName = document.getElementById('music');
const songBand = document.getElementById('band')
const play = document.getElementById('play');
const heart = document.getElementById('heart');
const song = document.querySelector('audio');
const previous = document.getElementById('previous');
const skip = document.getElementById('skip');
const cover = document.querySelector('img')
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const suffleButton = document.getElementById('random');
const repeatButton = document.getElementById('repeat');
const totalTime = document.getElementById('total-time');
const songTime = document.getElementById('song-time');


const ashesTheFire = {
    songName: 'Ashes on The Fire',
    artist: 'AOT',
    file: 'Ashes_on_the_fire',
    liked: false,
}

const goldenHour = {
    songName: 'Golden Hour',
    artist: 'JVKE',
    file: 'Golden_hour',
    liked: false,
}

const theLastWielder = {
    songName: 'The last wielder',
    artist: 'BHA',
    file: 'The_last_wielder',
    liked: false,
}

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [goldenHour, ashesTheFire, theLastWielder];
let sortedPlaylist = [...originalPlaylist];
let index = 0;


//Funções

let isSuffle = false;
let tocando = false;
let heartValue = false;
let repeatOn = false;

function playSong(){
    play.setAttribute('name', 'pause-circle');
    tocando = true;
    song.play();
}

function playPause(){
    play.setAttribute('name', 'play-circle');
    tocando = false;
    song.pause();
}

function playDecision(){
    if(tocando === true){
        playPause();
    }
    else{
        playSong();
    }
}



function inicialSong(){
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    songBand.innerText = sortedPlaylist[index].artist;

    heartButtonLiked();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else{
        index -= 1;
    }
    inicialSong();
    playSong();
}

function skipSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else{
        index += 1;
    }
    inicialSong();
    playSong();
}

function updateProgressBar(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* song.duration;
    song.currentTime = jumpToTime;
}

function suffleArray(preSuffleArray){
    const size = preSuffleArray.length;
    let currentIndex = size -1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()*size);
        let aux = preSuffleArray[currentIndex];
        preSuffleArray[currentIndex] = preSuffleArray[randomIndex];
        preSuffleArray[randomIndex] = aux;
        currentIndex -=1;
    }
}

function suffleButtonCliked(){
    if(isSuffle === false){
        suffleButton.setAttribute('style', 'color: green;');
        isSuffle = true;
        suffleArray(sortedPlaylist);
    }
    else{
        isSuffle = false;
        suffleButton.setAttribute('style', 'color: white;');
        sortedPlaylist = [...originalPlaylist];
    }
}

function repeatButtonCliked(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.setAttribute('style', 'color: green;')
    }
    else{
        repeatOn = false;
        repeatButton.setAttribute('style', 'color: white;')
    }
}

function nextOrRepeat(){
    if(repeatOn === false){
        skipSong();
    }
    else{
        playSong();
    }
}

function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}



function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

function heartButtonLiked(){
    if(sortedPlaylist[index].liked === false){
        heart.setAttribute('name', 'heart-outline');
    }
    else{
        sortedPlaylist[index].liked = true;
        heart.setAttribute('name', 'heart');
    }
}

function likedButtonCliked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }
    else{
        sortedPlaylist[index].liked = false;
    }

    heartButtonLiked();

    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}


inicialSong();

//Eventos

play.addEventListener('click', playDecision);
heart.addEventListener('click', likedButtonCliked);
previous.addEventListener('click', previousSong);
skip.addEventListener('click', skipSong);
song.addEventListener('timeupdate', updateProgressBar);
song.addEventListener('ended' , nextOrRepeat);
song.addEventListener('loadedmetadata' , updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
suffleButton.addEventListener('click', suffleButtonCliked);
repeatButton.addEventListener('click', repeatButtonCliked);





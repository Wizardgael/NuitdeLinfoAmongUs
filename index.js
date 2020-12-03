let kill_sound = new Audio('./sound/kill.mp3');
let eject_sound = new Audio('./sound/eject.mp3');
let victory_sound = new Audio('./sound/victory.mp3');
let defeat_sound = new Audio('./sound/defeat.mp3');
let intervalId;
var i = 0;
var text = "";
var colors = ["red", "brown", "orange", "pink"];

$( document ).ready(function() {
    if(!sessionStorage.getItem("impostors")){
        var arr = shuffle(colors);
        sessionStorage.setItem("impostors",[colors[0], colors[1]])
        
    }
    if(document.getElementById('red_crewmate') != null) initCrewmate('red');
    if(document.getElementById('brown_crewmate') != null) initCrewmate('brown');
    if(document.getElementById('pink_crewmate') != null) initCrewmate('pink');
    if(document.getElementById('orange_crewmate') != null) initCrewmate('orange');
});

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function initCrewmate(id){
    let crewmate_space = document.getElementById(id+"_crewmate");
    if(sessionStorage.getItem(id)){ // true = dead
        crewmate_space.src = "./images/crewmate/"+id+"/dead.png";
    }else{
        crewmate_space.src = "./images/crewmate/"+id+"/alive.png";
    }
}

function killCrewmate(id){
    if(!sessionStorage.getItem(id)){
        let crewmate_space = document.getElementById(id+"_crewmate");
        let dead_crewmate_img = document.getElementById("dead_crewmate_img");
        
        let img_dead = "./images/crewmate/"+id+"/dead.png";
        crewmate_space.src = img_dead;
        dead_crewmate_img.src = img_dead;
        kill_sound.play();
        
        sessionStorage.setItem(id,true);
        deadCrewMate(id);
    }
}

function deadCrewMate(id){
    window.clearInterval(intervalId);
    $('#deadCrewMate').show();
    text = id + " died and was a crewmate";
    if(sessionStorage.getItem("impostors").includes(id))
        text = id + " died and was an impostor";
    intervalId = window.setInterval(function(){
        eject_sound.play();
        document.getElementById('message_crew').innerHTML = text.substr(0, i++);
        if(i == text.length + 1){
            window.clearInterval(intervalId);
        }
    }, 100);
    
    setTimeout(function (){
        var d4 = true;
        var impostors = 0;
        for(i in colors){
            if(!sessionStorage.getItem(colors[i])){
                d4 = false;
            }else{
                if(sessionStorage.getItem("impostors").includes(colors[i])){
                    impostors++;
                }
            }
        }
        if(d4){
            document.getElementById("dead_crewmate_img").style.display = "none";
            text = "Impostors win";
            defeat_sound.play();
            intervalId = window.setInterval(function(){
                document.getElementById('message_crew').innerHTML = text.substr(0, i++);
                if(i == text.length + 1){
                    window.clearInterval(intervalId);
                    setTimeout(function(){
                        sessionStorage.clear();document.location.reload();
                    }, 4000);
                }
            }, 100);
        }else if(impostors >= 2){
            document.getElementById("dead_crewmate_img").style.display = "none";
            text = "Crewmates win";
            victory_sound.play();
            intervalId = window.setInterval(function(){
                document.getElementById('message_crew').innerHTML = text.substr(0, i++);
                if(i == text.length + 1){
                    window.clearInterval(intervalId);
                    setTimeout(function(){
                        sessionStorage.clear();document.location.reload();
                    }, 4000);
                }
            }, 100);
        }else{
            $('#deadCrewMate').toggle();
        }
    }, 7000);
}
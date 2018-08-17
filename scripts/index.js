//Variables
const moods = ['amazed', 'angry', 'annoyed', 'awesome', 'awkward', 'bored', 'calm', 'confused', 'delighted',  'elated', 'excited', 'grumpy', 'happy', 'hopeful', 'hurt', 'jealous', 'joyful', 'like', 'lonely', 'neat', 'nervous', 'proud', 'relaxed', 'sad', 'scared', 'sexy', 'sleepy', 'sorry', 'sweet', 'thrilled', 'upset', 'love', 'disgusted', 'surprised', 'shame', 'envy', 'hate', 'irritated', 'worry', 'guilty', 'frustrated', 'stressed', 'shocked', 'tense', 'amused', 'delighted', 'passionate', 'funny', 'weird', 'pretty', 'bad', 'cranky', 'peaceful', 'mad', 'mysterious', 'flirty', 'silly']

const API_KEY = '0K8BW6KwFjF4sGpNQmAq3UxMWZH2nG9EIvtVmRG1c8a6huXXEJ'

const list = document.getElementById('list-data')
const guessList = document.getElementById('guess-list')
const scoreList = document.getElementById('score')
const buttonContainer = document.getElementById('button-list')
const okButton = document.getElementById('ok')
const noButton = document.getElementById('no')
const ageAlert = document.getElementById('age')
const body = document.getElementsByTagName("body")[0].style
const answer = document.getElementById('answer')

//array to be displayed in html with a mood to guess and three random moods
let currentGuesses = []
let currentMood;
let randomMood1;
let randomMood2;
let randomMood3;
let score = 0;


function startGame(){



  //clear the board at restart
  currentGuesses = []
  buttonContainer.innerHTML = ""
  list.innerHTML =""

scoreList.innerHTML = `Score: ${score}`;

  generateRandomMoods();

  //make sure tags are different
  if(currentMood == randomMood1 || currentMood == randomMood2 || currentMood == randomMood3 || randomMood1 == randomMood2 || randomMood1 == randomMood3 || randomMood2 == randomMood3 || currentMood == undefined || randomMood1 == undefined || randomMood2 == undefined || randomMood3 == undefined){
    generateRandomMoods();
}

    //push the moods to the array
        currentGuesses = []
    currentGuesses.push(currentMood, randomMood1, randomMood2, randomMood3)

    shuffle(currentGuesses);

    console.log(`currentMood ${currentMood}`)

    //loop thru the array and dynamically create buttons for every one
    for(i=0; i<currentGuesses.length; i++){
      guess = currentGuesses[i]
      const button = document.createElement('button')
      button.innerHTML = guess;
      button.classList.add('.guess')
      button.id = guess
      button.style.backgroundColor = getRandomColor()
      buttonContainer.appendChild(button)
      //check if the guess is right logic
      button.onclick = function(){
        if(button.innerHTML == currentMood){
          //update score
            score = score + 1
            scoreList.innerHTML = `Score: ${score}`;

          //show overlay
          answer.style.display = "block"
          answer.innerHTML = `That\'s right! <br/> <button id="playMore">Keep playing!</button>`
          const playButton = document.getElementById('playMore')
          playButton.onclick = function(){
            answer.style.display = 'none'
            answer.innerHTML = ""
            startGame();
          }

        } else {
          score = 0;
          scoreList.innerHTML = `Score: ${score}`;

          //show overlay
          answer.style.display = "block"
          answer.innerHTML = `No way! It\'s ${currentMood}<br/> <button id="playMore">Try again</button>`
          const playButton = document.getElementById('playMore')
          playButton.onclick = function(){
            answer.style.display = 'none'
            answer.innerHTML = ""
            startGame();
          }

        }
      }
    }


    //API logic
      //fetch images from tumblr API
    fetch(`https://api.tumblr.com/v2/tagged?tag=${currentMood}&api_key=${API_KEY}`)
    .then(function(response){

      if(!response.ok){
        window.alert('Sth went wrong :( Please try again later')
      }
      return response.json();
    })
    .then(function(result){

      if(!result){
        return;
      }

      const items = result.response;
      let masonry;

      for(let i=0; i< items.length; i++) {
        let item = items[i]

        //create layout from pics
        if(item.photos !== undefined){
          const imgSrc = item.photos[0].alt_sizes[1].url;
          const img = document.createElement('img')
          img.src = imgSrc;
          img.onload = function(){
            masonry.layout()
          }
          const li = document.createElement('li')
          li.appendChild(img)
          list.appendChild(li)

        }
      }

      //masonry setup
      masonry = new Masonry(list, {
        itemSelector: 'li',
        // columnWidth: 250,
        gutter: 10,

      })

      //run layout
      masonry.layout();

    })
    .catch(function(err){
      console.log(err)
      window.alert('Tumblr API is down :( Please try again later!')
    })
}





//random moods
function generateRandomMoods() {
  //mood to guess
  let hashtag = Math.ceil(Math.random()*moods.length) -1;
  currentMood = moods[hashtag];

  let randomTag = Math.ceil(Math.random()*moods.length) -2;
  randomMood1 = moods[randomTag]
  let randomTag2 = Math.ceil(Math.random()*moods.length) -3;
  randomMood2 = moods[randomTag2]
  let randomTag3 = Math.ceil(Math.random()*moods.length) -4;
  randomMood3 = moods[randomTag3]
}


//shuffle the array
function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}



function getRandomColor(){
  let hue = Math.floor(Math.random() * 360);
  let pastel = 'hsl(' + hue + ', 100%, 87.5%)';
  return pastel;
}


okButton.onclick = function(){
  ageAlert.style.display = "none"
  body.overflow = "auto"
}

noButton.onclick = function(){
  window.close()
}

startGame();


function nextGeneration() {
  console.log('next generation');
  generations++;
  calculateFitness();

  for(let sBird of savedBirds){
    if(sBird.points > aiHighScore){
      aiHighScore = sBird.points;
      highscoreBrain = sBird.brain;
    }
  }

  for (let i = 0; i < TOTAL; i++) {
    birds[i] = pickOne();
  }

  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;
  let sBird = savedBirds[index];
  let child = new Bird(sBird.brain, true);
  child.mutate();
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let sBird of savedBirds) {
    sum += sBird.score;
  }
  for (let sBird of savedBirds) {
    sBird.fitness = sBird.score / sum;
  }
}
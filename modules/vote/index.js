"use strict";

class Voting {
  constructor() {
    this.votes = [];
  };

  addVote(vote) {
    this.votes.push(vote);
  }

  result() {

    var result = new Map();
    this.votes.forEach(key => {
      if (result.has(key)) {
        var item = result.get(key) + 1;
        result.set(key, item);
      } else {
        result.set(key, 1);
      }
    });
    console.log(result);
    var maxValue = Math.max.apply(null, Array.from(result.values()));
    var countMax = 0;
    var resultString = '';

    for(let key of result.keys()) {
      if(result.get(key) == maxValue){
        countMax++;
        resultString = key;
      }
    }

    console.log(result.get(resultString));
    console.log(this.votes.length/2);
    if(countMax > 1 || result.get(resultString) < this.votes.length/2){
      return 'Bad work!'
    } else {
      return resultString;
    }

  }
}

exports.Voting = Voting;
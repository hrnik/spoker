"use strict";

class Voting {
  constructor() {
    this.votes = [];
  };

  addVote(vote) {
    this.votes.push(vote);
  }

  result() {
    console.log(this.votes);
    var result = new Map();
    this.votes.forEach(key => {
      if (result.has(key)) {
        var item = result.get(key) + 1;
        result.set(key, item);
      } else {
        result.set(key, 1);
      }
    });

    var maxValue = Math.max.apply(null, Array.from(result.values()));
    var countMax = 0;
    var resultString = '';

    for(let key of result.keys()) {
      if(result.get(key)){
        countMax++;
        resultString = key;
      }
    }

    if(countMax > 1){
      return 'Bad work!'
    } else {
      return resultString;
    }

  }
}

exports.Voting = Voting;
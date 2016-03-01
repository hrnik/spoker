"use strict";

class Voting {
  constructor(){
    this.votes = [];
  };

  addVote(vote){
    this.votes.push(vote);
  }

  result(){
    return Math.max.apply(null, this.votes);
  }
}

exports.Voting = Voting;
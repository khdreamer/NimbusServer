
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
    User = require('../models/user.js');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.createRecord = function(req, res){
  
  console.log(req.body);
  var time = req.body.time;
  var life = req.body.life;
  var score = calculateScore(time, life);
  var UUID = req.body.UUID;
  var stageIndex = req.body.stage - 1;
  var hasError = false;

  User.findOne({"UUID": UUID}, function (err, user) {
    
    // store user score if necessary
    console.log(user);
    if (err){ 
      hasError = true;
      console.error(err);
    }
    else if(!user){

      if(stageIndex == 0){
       
        var user = new User({
          UUID: UUID,
          highest_score: score
        });
        user.save(function(err){});
        console.log("saving new user");

      }
      else{
        hasError = true;
        console.error("User goes beyond where he should be");
      }

    }
    else{

      if(stageIndex < user.highest_score.length){

        if(score > user.highest_score[stageIndex]){

          user.highest_score.set(stageIndex, score);
          user.save(function(err){});

        }

      }
      else if(stageIndex == user.highest_score.length){

        user.highest_score.push(score);
        user.save(function(err){});

      }
      else{ 
        hasError = true;
        console.error("User goes beyond where he should be");
      }

    }

    // find ranking
    if(!hasError){

      User.find(function (err, users){

        if (err) return console.error(err);
        else{

          var rank = 1;
          users.forEach(function(u){

            if(u.highest_score[stageIndex] > score) rank++;

          });
          res.json({"rank": rank});

        }

      });

    }
    else{

      res.json({rank: "Something's wrong"});

    }


  });

};

var calculateScore = function(time, life){

  return life * 1.0 / time;

}
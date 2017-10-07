// The website is: flip1.engr.oregonstate.edu:12432

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('./dbcon1.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2333);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// var serverAddress = 'flip1.engr.oregonstate.edu:12432';

function fixSQL(dataIn){
    var i = 0;
    for(i = 0; i < dataIn.length; i++){
        if(dataIn[i].lbs == "1")
            dataIn[i].lbs = "lbs";
        else{
            dataIn[i].lbs = "kg";
        }
    }
    return dataIn;
}

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('reset',context);
    })
  });
});

app.get('/', function(req, res, next){
        var context = {};
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
            //context.results = JSON.parse(rows);
            context.excercise = fixSQL(rows);
            res.render('homeOne', context);
          });
    });

app.post('/', function(req, res, next){
   var context = {};
    var unitType;
    var dataOut = [];
    
    if(req.body.addItem){
        if(!req.body.name || !req.body.reps || !req.body.weight || !req.body.date || !req.body.unit ){
            return;
        }
        mysql.pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit], function(err, result){
            if(err){
              next(err);
              return;
            }
            mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                res.send(JSON.stringify(rows));
            });
        });
    }
    
    else if(req.body.delItem){
        if(!req.body.id){
            return;
        }
        mysql.pool.query("DELETE FROM workouts WHERE id=?", req.body.id, function(err, result){
            if(err){
              next(err);
              return;
            }
            mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                res.send(JSON.stringify(rows));
            });
        });
    }
    
    else if(req.body.editItemPage){
        if(!req.body.IdEdit){
            return;
        }

        mysql.pool.query("SELECT * FROM workouts WHERE id=?", req.body.IdEdit, function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.excercise = fixSQL(rows);
            if(context.excercise[0].lbs == "kg"){
                context.excercise[0].kgCheck = "kg";
            }
            else{
                context.excercise[0].lbsCheck = "lbs";
            }
            res.render('edit', context);
        });
    }
    
    else if(req.body.editItem){
        if(!req.body.IdEdit){
            return;
        }
        
        if(req.body.unit == "lbs"){
            req.body.unit = "1";
        }
        else{
            req.body.unit = "0";
        }
        
        mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit ,req.body.IdEdit], function(err, result){
            if(err){
              next(err);
              return;
            }
            mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
                context.excercise = fixSQL(rows);
                res.render('homeOne', context);
          });
        });
    }
    
    else{
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context = fixSQL(rows);
                res.render('homeOne', context);
            });
        
    }
    
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

/*
app.listen(app.get('port'), function(){
  console.log('Express started on flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
*/



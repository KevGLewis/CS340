// This is the bridge inspection final project for CS 340

// The following setting were adapted from the CS290 lectures

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('./dbcon1.js');

var serverAddress = 'flip1.engr.oregonstate.edu:2334';

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2334);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
        var context = {};
        context.data = {};
       mysql.pool.query("SELECT * FROM LOA ORDER BY number",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.data = rows;
            res.render('LOA', context);
        });
    });

// All of the following will be similar. Each of the following pages allows the user to add/delete an element and also presents the user the existing table. Some may require multiple mySQL requests because data must be pulled from tables to help the user input data. For example, we need to pull the names of the bridges for when an report is being created because the user will need to pick from a list of existing bridges.

// Check the status of a Report -------------------------------------------

app.get('/Rep_Status', function(req, res, next){
    var context = {};
    context.data = {};
    var selection = "SELECT s_rep.rep_id AS elem_id, s_rep.NBI_ID, s_rep.bridgeID, l.number, IFNULL(s_rep.total_rep,0) AS total_spent, IFNULL(s_rep.budget,0) AS total_budget, IF( IFNULL(s_rep.total_rep,0) - IFNULL(s_rep.budget,0) < 0, 'Over Budget', 'Under Budget') AS cur_status FROM LOA l INNER JOIN (SELECT r.rep_id, b.NBI_ID, b.id AS bridgeID, r.fk_LOA_num as LOA_num, SUM(e.hourly_rate * ra.hours_worked) AS total_rep, SUM(r.budget) as budget FROM report r LEFT JOIN rep_assign ra ON ra.rep_id = r.rep_id LEFT JOIN employee e ON e.eid = ra.eid INNER JOIN bridge b ON b.id = r.fk_bridgeID GROUP BY r.rep_id) AS s_rep ON s_rep.LOA_num = l.number";
    
    selection += ' GROUP BY elem_id';
    
    if(req.query.Budget){
        
        if(req.query.bud == 'over'){
          selection += ' HAVING cur_status = "Over Budget"';  
        
        } else if(req.query.bud == 'under'){
            
            selection += ' HAVING cur_status = "Under Budget"';
        }
        
    } else if(req.query.LOA_Sort){
        if(req.query.loa != 'none'){
            selection += ' HAVING l.number = ' + req.query.loa;
        }
    } else if(req.query.Bridge_Sort){
        if(req.query.id != 'none'){
            selection += ' HAVING bridgeID = ' + req.query.id;
        }
    }else if(req.query.ID_Sort){
        if(req.query.elem_id != 'none'){
            selection += ' HAVING elem_id = ' + req.query.elem_id;
        }
    }
    
    
    
    mysql.pool.query("SELECT l.id, l.number FROM LOA l INNER JOIN inspection i ON i.fk_LOA_num = l.id",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.LOA = rows;
        
        mysql.pool.query("SELECT DISTINCT b.id, b.NBI_ID FROM bridge b INNER JOIN inspection i ON i.fk_bridgeID = b.id",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.bridge = rows;
            
            mysql.pool.query("SELECT rep_id AS elem_id FROM report",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.elements = rows;

                mysql.pool.query(selection,  function(err, rows, fields){
                    if(err){
                      next(err);
                      return;
                    }
                    context.data = rows;

                    res.render('Rep_Status', context);
                });
            });
        });
    });
});


// Check the status of an inspection --------------------------------------

app.get('/Insp_Status', function(req, res, next){
    var context = {};
    context.data = {};
    var selection = "SELECT tmp.insp_id AS elem_id, tmp.NBI_ID, tmp.bridgeID, l.number, IFNULL(tmp.total_insp,0) AS total_spent, IFNULL(tmp.budget,0) AS total_budget, IF(IFNULL(tmp.total_insp,0) - IFNULL(tmp.budget,0) < 0, 'Over Budget', 'Under Budget') AS cur_status FROM LOA l INNER JOIN (SELECT i.insp_id, b.NBI_ID, b.id AS bridgeID, i.fk_LOA_num as LOA_num, SUM(e.hourly_rate * ia.hours_worked) AS total_insp, SUM(i.budget) as budget FROM inspection i LEFT JOIN insp_assign ia ON ia.insp_id = i.insp_id LEFT JOIN employee e ON e.eid = ia.eid INNER JOIN bridge b ON b.id = i.fk_bridgeID GROUP BY i.insp_id) AS tmp ON tmp.LOA_num = l.number";
    
    selection += ' GROUP BY elem_id';
    
    if(req.query.Budget){
        
        if(req.query.bud == 'over'){
          selection += ' HAVING cur_status = "Over Budget"';  
        
        } else if(req.query.bud == 'under'){
            
            selection += ' HAVING cur_status = "Under Budget"';
        }
        
    } else if(req.query.LOA_Sort){
        if(req.query.loa != 'none'){
            selection += ' HAVING l.number = ' + req.query.loa;
        }
    } else if(req.query.Bridge_Sort){
        if(req.query.id != 'none'){
            selection += ' HAVING bridgeID = ' + req.query.id;
        }
    }else if(req.query.ID_Sort){
        if(req.query.elem_id != 'none'){
            selection += ' HAVING elem_id = ' + req.query.elem_id;
        }
    }
    
    
    
    mysql.pool.query("SELECT l.id, l.number FROM LOA l INNER JOIN inspection i ON i.fk_LOA_num = l.id",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.LOA = rows;
        
        mysql.pool.query("SELECT DISTINCT b.id, b.NBI_ID FROM bridge b INNER JOIN inspection i ON i.fk_bridgeID = b.id",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.bridge = rows;
            
            mysql.pool.query("SELECT insp_id AS elem_id FROM inspection",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.elements = rows;

                mysql.pool.query(selection,  function(err, rows, fields){
                    if(err){
                      next(err);
                      return;
                    }
                    context.data = rows;

                    res.render('Insp_Status', context);
                });
            });
        });
    });
});

// Check the status of a LOA ----------------------------------------------

app.get('/LOA_Status', function(req, res, next){
    var context = {};
    context.data = {};
    var selection = "SELECT l.number, IFNULL(s_insp.total_insp,0) + IFNULL(s_rep.total_rep,0) AS total_spent, IFNULL(s_insp.budget,0) + IFNULL(s_rep.budget,0) AS total_budget, IF((IFNULL(s_insp.total_insp,0) + IFNULL(s_rep.total_rep,0)) - IFNULL(s_insp.budget,0) + IFNULL(s_rep.budget,0) < 0, 'Over Budget', 'Under Budget') AS cur_status FROM LOA l LEFT JOIN (SELECT i.insp_id, i.fk_LOA_num as LOA_num, SUM(e.hourly_rate * ia.hours_worked) AS total_insp, SUM(i.budget) as budget FROM inspection i INNER JOIN insp_assign ia ON ia.insp_id = i.insp_id INNER JOIN employee e ON e.eid = ia.eid GROUP BY i.insp_id) AS s_insp ON s_insp.LOA_num = l.number LEFT JOIN (SELECT r.rep_id, r.fk_LOA_num as LOA_num, SUM(e.hourly_rate * ra.hours_worked) AS total_rep, SUM(r.budget) as budget FROM report r INNER JOIN rep_assign ra ON ra.rep_id = r.rep_id INNER JOIN employee e ON e.eid = ra.eid GROUP BY r.rep_id) AS s_rep ON s_rep.LOA_num = l.number";
    
    if(req.query.LOA_Budget){
        
        selection += ' GROUP BY l.number';
        
        if(req.query.loa == 'over'){
          selection += ' HAVING cur_status = "Over Budget"';  
        
        } else if(req.query.loa == 'under'){
            
            selection += ' HAVING cur_status = "Under Budget"';
        }
        
    }
    
    if(req.query.LOA_Sort){
        if(req.query.loa != 'none'){
            selection += ' HAVING l.number = ' + req.query.loa;
        }
    }
    
    
    
    mysql.pool.query("SELECT * FROM LOA",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.LOA = rows;
                
        mysql.pool.query(selection,  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.data = rows;

            res.render('LOA_Status', context);
        });
    });
});

// Add an employee --------------------------------------------------------

app.get('/employee', function(req, res, next){
    var context = {};
    context.data = {};
    
    if(req.query.editItem){

        mysql.pool.query("UPDATE employee SET hourly_rate = ? WHERE eid = ?", [req.query.hourly_rate, req.query.eid], function(err, result){
            if(err){
                res.send('false');
              next(err);
              return;
            }
            loadEmployee(res);
        });
        
    } else if (req.query.addItem){
        mysql.pool.query("INSERT INTO employee (eid, first_name, last_name, hourly_rate, fk_OfficeID) VALUES (?, ?, ?, ?, ?)", [req.query.employee_id, req.query.first_name, req.query.last_name, req.query.rate, req.query.office], function(err, result){
            if(err){
              next(err);
              return;
            }
            res.send('true');
        });
        
        
    } else {
        loadEmployee(res);
    } 
});

//Add a report ----------------------------------------------------------

app.get('/report', function(req, res, next){
    var context = {};
    context.data = {};
    
    if (req.query.addItem){
        mysql.pool.query("INSERT INTO report (type, budget, pcomp, fk_bridgeID, fk_LOA_num) VALUES (?, ?, ?, ?, ?)", [req.query.type, req.query.budget, req.query.pcomp, req.query.bridge, req.query.loa], function(err, result){
            if(err){
              next(err);
              return;
            }
            res.send('true');
        });
        
        
    } else {
        
         mysql.pool.query("SELECT r.rep_id, r.type, r.budget, r.pcomp, LOA.number, b.NBI_ID FROM report r INNER JOIN LOA ON r.fk_LOA_num = LOA.id INNER JOIN bridge b ON b.id = r.fk_bridgeID ORDER BY LOA.number",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.data = rows;
            mysql.pool.query("SELECT * FROM LOA ORDER BY number",  function(err, rows, fields){
                    if(err){
                      next(err);
                      return;
                    }
                    context.LOA = rows;
                
                    
                    mysql.pool.query("SELECT * FROM bridge ORDER BY NBI_ID",  function(err, rows, fields){
                            if(err){
                              next(err);
                              return;
                            }
                            context.bridge = rows;

                            res.render('report', context);
                    });

            });
        });
    } 
});

// Add an inspection ----------------------------------------------------

app.get('/inspection', function(req, res, next){
    var context = {};
    context.data = {};
    
    if (req.query.addItem){
        mysql.pool.query("INSERT INTO inspection (type, budget, pcomp, fk_bridgeID, fk_LOA_num) VALUES (?, ?, ?, ?, ?)", [req.query.type, req.query.budget, req.query.pcomp, req.query.bridge, req.query.loa], function(err, result){
            if(err){
              next(err);
              return;
            }
            res.send('true');
        });
        
        
    } else {
        
         mysql.pool.query("SELECT i.insp_id, i.type, i.budget, i.pcomp, LOA.number, b.NBI_ID FROM inspection i INNER JOIN LOA ON i.fk_LOA_num = LOA.id INNER JOIN bridge b ON b.id = i.fk_bridgeID ORDER BY LOA.number",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.data = rows;
            mysql.pool.query("SELECT * FROM LOA ORDER BY number",  function(err, rows, fields){
                    if(err){
                      next(err);
                      return;
                    }
                    context.LOA = rows;
                
                    
                    mysql.pool.query("SELECT * FROM bridge ORDER BY NBI_ID",  function(err, rows, fields){
                            if(err){
                              next(err);
                              return;
                            }
                            context.bridge = rows;

                            res.render('inspection', context);
                    });

            });
        });
    } 
});

// Assign a Report ----------------------------------------------------

app.get('/AssReport', function(req, res, next){
        var context = {};
        context.data = {};
   
        if(req.query.editItem){
            
                mysql.pool.query("UPDATE rep_assign SET hours_worked = ? WHERE eid = ? AND rep_id = ?", [req.query.hours_worked, req.query.eid, req.query.rep_id], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                loadAssReport(res);
            });
            
            
        } else if(req.query.deleteItem){
            
                mysql.pool.query("DELETE FROM rep_assign WHERE eid = ? AND rep_id = ?", [req.query.eid, req.query.rep_id], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                loadAssReport(res);
            });
            
            
        } else if(req.query.addItem){
            
            mysql.pool.query("INSERT INTO rep_assign (eid, rep_id, hours_worked) VALUES (?, ?, ?)", [req.query.employee, req.query.report_id, req.query.hours], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                res.send('true');
            });
       
        } else {
            
            loadAssReport(res);
        }
    });


// Assign an Inspection ---------------------------------------------------

app.get('/AssInsp', function(req, res, next){
        var context = {};
        context.data = {};
   
        if(req.query.editItem){
            
                mysql.pool.query("UPDATE insp_assign SET hours_worked = ? WHERE eid = ? AND insp_id = ?", [req.query.hours_worked, req.query.eid, req.query.insp_id], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                loadAssInsp(res);
            });
            
            
        } else if(req.query.deleteItem){
            
                mysql.pool.query("DELETE FROM insp_assign WHERE eid = ? AND insp_id = ?", [req.query.eid, req.query.insp_id], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                loadAssInsp(res);
            });
            
            
        } else if(req.query.addItem){
            
            mysql.pool.query("INSERT INTO insp_assign (eid, insp_id, hours_worked) VALUES (?, ?, ?)", [req.query.employee, req.query.insp_id, req.query.hours], function(err, result){
                if(err){
                    res.send('false');
                  next(err);
                  return;
                }
                res.send('true');
            });
       
        } else {
            
            loadAssInsp(res);
        }
    });

// Add an LOA ---------------------------------------------------------

app.get('/LOA', function(req, res, next){
        var context = {};
        context.data = {};
        if(req.query.addItem){
       
            mysql.pool.query("INSERT INTO LOA (number) VALUES (?)", [req.query.loa_numb], function(err, result){
                if(err){
                  next(err);
                  return;
                }
                res.send('true');
            });
       
        } else {
            
            mysql.pool.query("SELECT * FROM LOA ORDER BY number",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.data = rows;
                res.render('LOA', context);
            });
        }
    });

// Bridge Related ----------------------------------------------------

app.get('/bridge', function(req, res, next){
        var context = {};
        context.data = {};
    
        if(req.query.addItem){
       
            mysql.pool.query("INSERT INTO bridge (nbi_id, type, length, spans, zipcode) VALUES (?, ?, ?, ?, ?)", [req.query.nbi_id, req.query.type, req.query.length, req.query.spans, req.query.zipcode], function(err, result){
                if(err){
                  next(err);
                  return;
                }
                res.send('true');
            });
        
        } else {
             mysql.pool.query("SELECT * FROM bridge ORDER BY NBI_ID",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.data = rows;
                res.render('bridge', context);
            });
        }
        

    });



app.get('/office', function(req, res, next){
    var context = {};
    context.data = {};
    
        
    if(req.query.addItem){
         mysql.pool.query("INSERT INTO office (name, zipcode) VALUES (?, ?)", [req.query.office_name, req.query.zipcode], function(err, result){
            if(err){
              next(err);
              return;
            }
            res.send('true');
         });  
            
    } else{
        
            mysql.pool.query("SELECT * FROM office ORDER BY name",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.data = rows;
            res.render('office', context);
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
  console.log('Express started on ' + serverAddress + '; press Ctrl-C to terminate.');
});


function loadAssReport(res){
    
    var context = {};
    
    mysql.pool.query("SELECT e.eid, e.first_name, e.last_name, e.hourly_rate, o.name AS office_name FROM employee e INNER JOIN office o ON e.fk_Officeid = o.id ORDER BY e.eid",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.employee = rows;
         mysql.pool.query("SELECT r.rep_id, r.type, r.budget, r.pcomp, LOA.number, b.NBI_ID FROM report r INNER JOIN LOA ON r.fk_LOA_num = LOA.id INNER JOIN bridge b ON b.id = r.fk_bridgeID ORDER BY r.rep_id",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.report = rows;

            mysql.pool.query("SELECT e.eid, e.first_name, e.last_name, r.rep_id, r.type, b.NBI_ID, l.number, ra.hours_worked FROM rep_assign ra INNER JOIN employee e ON e.eid = ra.eid INNER JOIN report r ON r.rep_id = ra.rep_id INNER JOIN bridge b ON b.id = r.fk_bridgeID INNER JOIN LOA l ON l.id = r.fk_LOA_num ORDER BY e.eid",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.data = rows;
                res.render('AssReport', context);
            });


        });
    });
}

function loadAssInsp(res){
    
    var context = {};
    
    mysql.pool.query("SELECT e.eid, e.first_name, e.last_name, e.hourly_rate, o.name AS office_name FROM employee e INNER JOIN office o ON e.fk_Officeid = o.id ORDER BY e.eid",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.employee = rows;
         mysql.pool.query("SELECT i.insp_id, i.type, i.budget, i.pcomp, LOA.number, b.NBI_ID FROM inspection i INNER JOIN LOA ON i.fk_LOA_num = LOA.id INNER JOIN bridge b ON b.id = i.fk_bridgeID ORDER BY i.insp_id",  function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            context.inspection = rows;

            mysql.pool.query("SELECT e.eid, e.first_name, e.last_name, i.insp_id, i.type, b.NBI_ID, l.number, ia.hours_worked FROM insp_assign ia INNER JOIN employee e ON e.eid = ia.eid INNER JOIN inspection i ON i.insp_id = ia.insp_id INNER JOIN bridge b ON b.id = i.fk_bridgeID INNER JOIN LOA l ON l.id = i.fk_LOA_num ORDER BY e.eid",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.data = rows;
                res.render('AssInsp', context);
            });


        });
    });
}

function loadEmployee(res){
    var context = {};
     mysql.pool.query("SELECT e.eid, e.first_name, e.last_name, e.hourly_rate, o.name AS office_name FROM employee e INNER JOIN office o ON e.fk_Officeid = o.id ORDER BY e.eid",  function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.data = rows;
        mysql.pool.query("SELECT * FROM office",  function(err, rows, fields){
                if(err){
                  next(err);
                  return;
                }
                context.office = rows;

                res.render('employee', context);
        });
    });
}


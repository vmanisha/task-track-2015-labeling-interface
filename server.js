var util = require('./util');

var express = require('express');
var app = express();
var engines = require('consolidate');
var bodyParser = require('body-parser');

util.loadEntities();
util.loadQueries();


//app.use(app.router); //use both root and other routes below
//app.use(express.static(__dirname + "/views")); //use static files in ROOT/public folder

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(bodyParser.json());
//app.use(bodyParser.raw());

app.use("/", express.static(__dirname + '/views'));
app.use("/js", express.static(__dirname + '/views/js'));
var authList = [];


app.get('/index', function(req, res) {
  res.type('text/html'); // set content-type
  res.render('interface.html');
});

app.post('/api/signin',function(req, res){
    //console.log(req.body.uemail);
    //console.log(req.body.upass);
    
    if(!req.body.uemail || !req.body.upass ) {
     res.statusCode = 400;
    return res.send('Error 400: Got no user and pass');
  } 
 
  var auth = {
    uname : req.body.uemail,
    pass : req.body.upass
  }; 
 
  if (authList.indexOf(auth) == -1)
    authList.push(auth);
  console.log(authList.length+' Users');
  res.json(true);

});

app.post('/api/signout',function(req,res){
	var uname = req.body.uname;
	console.log('Logging out '+uname);
	res.json(true);	


});

app.post('/api/getNextPair',function(req,res){
	//generate a random number
	var uname = req.body.uname;
	retObj = util.getNextPair(uname);	
	index= retObj[0];
	queryPair =  retObj[1];
	console.log('Pair\t'+index+'\t'+queryPair+'\t'+uname);
	res.json([index,queryPair]);

});

app.post('/api/getNextEntity',function(req,res){
	//generate a random number 
	var uname = req.body.uname;
	retObj = util.getNextEntity(uname);
	index= retObj[0];
	entity = retObj[1];
	query =  retObj[2];
	console.log('Entity\t'+index+'\t'+entity+'\t'+query+'\t'+uname);
	res.json([index,entity,query]);
});


app.post('/api/submitPair',function(req,res){
	//generate a random number 
	index = req.body.pairId;
	label = req.body.label;
	uname = req.body.uname;
	util.updatePairLabel(index, label, uname);
	console.log('RPair\t'+index+'\t'+label+'\t'+uname);
	
	res.json(true);

});

app.post('/api/submitEntityTask',function(req,res){
	//generate a random number 
	index = req.body.entityId;
	t1 = req.body.t1;
	t2 = req.body.t2;
	t3 = req.body.t3;
	uname = req.body.uname;
	util.updateEntityLabel(index, t1,t2,t3, uname);
	console.log('REntity\t'+index+'\t'+t1+'\t'+t2+'\t'+t3+'\t'+uname);
	res.json(true);

});

app.listen(process.env.PORT || 4730);

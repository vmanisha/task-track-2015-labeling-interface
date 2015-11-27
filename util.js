var fs = require('fs');
var MicroDB = require('nodejs-microdb');

var entities = [];
var queryPairs = [];
x = new MicroDB({'file':'labels.db', 'defaultClean':true});
module.exports = 
{

//what do we need to store ?
// Entity : User : Label
// QueryPair : User : Label

loadEntities: function()
	{
		//var entities = ['Madagascar', 'Lee cooper', 'James Bond', 'Mobile phone','Soy bean','Solar eclipse','Printer', 
		//	'Easter holidays','Ford Truck','viral infection','Lawn chair','Tornado'];
		fileName = 'Data/Entities.sample';
		//load the entities here
		var split = null;
		var array = fs.readFileSync(fileName).toString().split("\n");
		for (var i in array)
		{
			split = array[i].split('\t');
			//console.log(array[i]);
			//console.log(split);
			if(split[0].length >1)
				entities.push([split[0],split[1]]);
		}
		console.log('Loaded Entity Space '+entities.length);
	},


loadQueries: function()
	{
		//var queries = [['american sign language','learn sign language'],['potato casserole' ,'potato pancakes'],
		//['tea recipe','republic of tea'],['sony lcd tv', 'sony record'],['ford foundation','ford truck'],
		//['pro wrestle news','ncaa wrestle championship'],['free book report','consumer report cars'],
		//['chinese symbol tattoo','barb wire tattoo'],['easter basket idea','easter egg recipe'],['citric acid','boric acid']];
		fileName = 'Data/Queries.sample';
		//load the queries here
		var split = null;
		var array = fs.readFileSync(fileName).toString().split("\n");
		for (var i in array)
		{
			split = array[i].split('\t');
			//console.log(split);
			//Min or Max	query1	query2 
			if (split[1].length > 0 && split[2].length > 0)
			queryPairs.push([split[1],split[2]]);

			if (queryPairs.length == 100)
				break;
		}
		console.log('Loaded Query Pair Space '+queryPairs.length);
	},

getNextPair: function(uname)
	{

		labeled = x.findAll('puname',uname);
		console.log('pFound in DB\t'+uname+'\t'+labeled.length);
		covered = [];
		for (var ind in labeled)		
		{
			obj = x.getObj(labeled[ind]);
			covered.push(obj['pid']);
		}
		//get a random number not equal to covered

		for (var i=0;i < queryPairs.length;i++)
		{
			if (covered.indexOf(i) == -1)
			return [i,queryPairs[i]];
		}
		

		//return empty object
		return [-1,[]];

	},

getNextEntity: function(uname)
	{	


		labeled = x.findAll('euname',uname);
		console.log('eFound in DB\t'+uname+'\t'+labeled.length);
		covered = [];
		for (var ind in labeled)		
		{
			obj = x.getObj(labeled[ind]);
			covered.push(obj['eid']);
			//console.log('Covered ent id '+labeled[ind]+' '+obj['eid']);
			
		}

		//get a random number not equal to covered
		for (var i=0;i < entities.length;i++)
		{
			if (covered.indexOf(i) == -1)
			return [i,entities[i][0],entities[i][1]];
		}
		
		//return empty object
		return [-1,[]];
		

	},

updatePairLabel: function(index, label, uname)
	{
		val = x.add({'pid':parseInt(index),'label':label,'puname':uname});
	},

updateEntityLabel: function(index, t1, t2, t3, uname)
	{
		val = x.add({'eid':parseInt(index),'t1':t1,'t2':t2,'t3':t3,'euname':uname});

	}

};

var DataSource = require('loopback-datasource-juggler').DataSource;


var db = new DataSource(require('../'),{neo4j_url:'http://localhost:7474/'});

var Customer = db.createModel('customer', {name:String});

Customer.create({name:'john'},function(err, data){
	if (err) throw err;
	console.log(data);

	data.updateAttribute('town', 'Hamiota', function(err, data2){
		console.log(data2);

		Customer.find({name:'john'}, function(err, res){
			if (err) throw err;
			console.log(res);
		})
	});	

	Customer.destroyAll(function(err){
		if (err) throw err;
	})
})

var assert = require('assert');
var DataSource = require('loopback-datasource-juggler').DataSource;

var db, Customer;
describe('neo4j', function(){
	before(function (done) {
		db = new DataSource(require('../'),{neo4j_url:'http://localhost:7474/'});

		Customer = db.createModel('customer', {name:String});
		done();
	})

	beforeEach(function(done){
		Customer.destroyAll(function(err){
			if (err) throw err;

			var names = [{name:'John', town:'Brandon'},
				{name:'Bill', town:'Hamiota'}, 
				{name:'Jade',town:'Brandon'}
			];
			var count = 0;
			names.forEach(function(v, i){
				Customer.create(v, function(err, res){
					if (err) throw err;
					count++;
					if (count == 3) done();
				})
			})
		});

	})

	describe('Create', function () {
		it('Should put 3 customers into the db', function(done){
			var names = ['John', 'Bill', 'Jade'];
			var count = 0;
			names.forEach(function(name, i){
				Customer.create({name:name}, function(err, res){
					if (err) throw err;
					assert.equal(res.name, names[i]);
					count++
					if (count == 3) done()
				});
			})
		})
	})

	describe('all', function(){
		it('should select all nodes', function(done){
			Customer.all({}, function(err, res){
				if (err) throw err;
				assert.equal(res.length, 3);
				done();
			})
		})

		it('should select John and Jade', function(done){
			Customer.all({town:'Brandon'},function(err, res){
				if (err) throw err;
				var names = ['John', 'Jade']
				var hasNames = res.some(function(i){ return names.indexOf(i.name) != -1})
				assert.ok(hasNames);
				done();

			})
		})
	})

	/*describe('find', function(){
		it('should find the id of Jade', function(done){
			Customer.all({name:'Jade'}, function(err, jade){
				if (err) throw err;
				console.log(jade);
				done();
			})
		})
	})*/

	describe('updateAttributes', function(){
		it('should update the attributes of a node', function(done){
			Customer.find({name:'Jade'}, function(err, res){
				var jade = res[0];
				jade.updateAttribute('town','Winnipeg', function(err, jade2){
					if (err) throw err;

					Customer.find({name:'Jade'}, function(err, res){
						if (err) throw err;
						var jade3 = res[0];
						assert.equal(jade3.town, 'Winnipeg');
						done();
					})
				})
			})
		})
	})
})
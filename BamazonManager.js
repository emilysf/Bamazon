var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
//records info to connect to database 
var connection = mysql.createConnection({
   host: 'localhost',
   port: '3306',
   database: 'Bamazon_db',
   user: 'root',
   password: process.argv[2]
});

//shows if there is a connection
connection.connect(function(err) {
	if (err) { 
		throw err;
	}
	console.log('Connected as id ' + connection.threadID);
	start();
});

var start = function() {

	console.log('\n')
	console.log('----------Welcome to Bamazon Management----------'); 
	console.log('=================================================');
 
	//shows choices for manager to choose from
	inquirer.prompt([{
		name: 'menu',
		type: 'rawlist',
		message: 'Choose an option',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

	}]).then(function(answers) {
		//switch statement for choices
		switch(answers.menu) {
            case 'View Products for Sale': 
                products();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                newProduct();
                break;
        } 
	});

	//function shows all the products in a table
	function products() {

		console.log('\n');
		console.log('----------List of Products----------');
		console.log('====================================');
		//queries table from database
		connection.query('SELECT * FROM Products', function(err, data) {
		if (err) throw err;

		// creates a table for the products
		var table = new Table({
		    head: ['Item ID', 'Product Name', 'Department Name', 'Price ($)', 'Stock Quantity']
		  , colWidths: [15, 15, 15, 15, 15]
		});
		 
		// creates an array of data to show
		for (i = 0; i < data.length; i++) {
			table.push(
			    
			    [data[i].itemID, data[i].ProductName, data[i].DepartmentName, data[i].Price, data[i].StockQuantity]
			);
		}
		 
		console.log(table.toString());
		console.log('=================================================');
		
		connection.end();
		
		});

	}

	//function shows all items with inventory below 5 items
	function lowInventory() {

		console.log('\n');
		console.log('----------Low Inventory----------');
		console.log('=================================');

		connection.query('SELECT * FROM Products', function(err, data) {
			if (err) throw err;

			// creates a table for the products
			var table = new Table({
			    head: ['Item ID', 'Product Name', 'Department Name', 'Price ($)', 'Stock Quantity']
			  , colWidths: [15, 15, 15, 15, 15]
			});

			for (i = 0; i < data.length; i++) {
				if(data[i].StockQuantity < 5) {	
					table.push(
						
					    [data[i].itemID, data[i].ProductName, data[i].DepartmentName, data[i].Price, data[i].StockQuantity]
					
					);
				}
			}

			console.log(table.toString());
			console.log('=================================================');
						
			connection.end();

		});
	}

	//function adds inventory to a product
	function addInventory() {

		console.log('\n');
		console.log('----------Add Inventory to a Product----------');
		console.log('==============================================');

		inquirer.prompt([{
			name:'id',
			type:'input',
			message:'Enter the ID of the item you would like to add inventory to.',
			
			validate: function(value) {
            
	            if (isNaN(value) == false) {
	                return true;
	            } else {
	                return false;
	            }
	        }

		},{
			name:'qty',
			type:'input',
			message:'How much would you like to add?',

			validate: function(value) {
            
	            if (isNaN(value) == false) {
	                return true;
	            } else {
	                return false;
	            }
	        }

		}]).then(function(answers) {

			var id = answers.id;
			var qty = parseInt(answers.qty);
			//var newAmount = (qty + data[0].StockQuantity);

			connection.query('UPDATE Products SET StockQuantity = ? WHERE itemID = ?', [qty, id], function(err, data) {
				if (err) {
					throw err;
				}
				else {
					// var newAmount = (qty + data.StockQuantity);

					console.log('\n');
					console.log('----------Inventory was added!----------');
					connection.end();
				}
			});
		});
	}

	//function adds new product to database
	function newProduct() {

		console.log('\n');
		console.log('----------Add a New Product----------');
		console.log('==============================================');

		inquirer.prompt([{
			name: 'product',
			type:'input',
			message:'Enter name of product being added.',

		},{
			name:'department',
			type:'input',
			message:'Enter the name of the department.',

		},{
			name:'price',
			type:'input',
			message:'Enter the price for the product.',

			validate: function(value) {
            
	            if (isNaN(value) == false) {
	                return true;
	            } else {
	                return false;
	            }
	        }

	    },{
			name:'stock',
			type:'input',
			message:'Enter the amount of product available.',

			validate: function(value) {
            
	            if (isNaN(value) == false) {
	                return true;
	            } else {
	                return false;
	            }
	        }

	    }]).then(function(answers) {

	    	var intStock = parseInt(answers.stock);
	    	var addedProduct = [answers.product, answers.department, answers.price, intStock]; 

			connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?)', addedProduct, function(err, data) {
				if (err) throw err;

				console.log('----------Product Added!----------')
			});

			connection.end();
		});
	}	
}  
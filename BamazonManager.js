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
            case 'Add a New Product':
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
		    head: ['Item ID', 'Product Name', 'Price ($)', 'Stock Quantity']
		  , colWidths: [15, 20, 15, 20]
		});
		 
		// creates an array of data to show
		for (i = 0; i < data.length; i++) {
			table.push(
			    
			    [data[i].itemID, data[i].ProductName, data[i].Price, data[i].StockQuantity]
			);
		}
		 
		console.log(table.toString());
		console.log('=================================================');
		
		start();
		
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
			    head: ['Item ID', 'Product Name', 'Price ($)', 'Stock Quantity']
			  , colWidths: [15, 20, 15, 20]
			});

			for (i = 0; i < data.length; i++) {
				if(data[i].StockQuantity < 5) {	
					table.push(
						
					    [data[i].itemID, data[i].ProductName, data[i].Price, data[i].StockQuantity]
					
					);
				}
			}

			console.log(table.toString());
			console.log('=================================================');
						
			start();

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
			
		});
	}

	
	
}  
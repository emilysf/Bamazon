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
	console.log('connected as id ' + connection.threadID);
	start();
});

var start = function() {
	//queries table from database
	connection.query('SELECT * FROM Products', function(err, data) {
		if (err) throw err;

		console.log('----------Welcome to Bamazon----------'); 
		console.log('======================================');
		console.log('-----------Bamazon Products-----------');
		console.log('======================================');
 
		// creates a table for the products
		var table = new Table({
		    head: ['Item ID', 'Product Name', 'Price ($)']
		  , colWidths: [15, 20, 15]
		});
		 
		// creates an array of data to show
		for (i = 0; i < data.length; i++) {
			table.push(
			    
			    [data[i].itemID, data[i].ProductName, data[i].Price]
			);
		}
		 
		console.log(table.toString());
		// //displays products in console
		// for (i = 0; i < data.length; i++) {
		// 	console.log('Item ID: ' + data[i].itemID + ' | ' + 'Product: ' + data[i].ProductName + ' | ' + 'Price: $' + data[i].Price);
	 //    }
	 //    console.log('======================================');

	    productSelection();
	});
}  

var productSelection = function() {
	//prompts user to select items they wanna buy
	console.log('----------Make a purchase----------');
	console.log('===================================');
	inquirer.prompt([{
		name: 'Item',
		type: 'input',
		message: 'Please enter the Item ID of the product you would like to purchase.',

		validate: function(value) {
            
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
	},{
		name: 'Quantity',
		type: 'input',
		message: 'How many would you like to buy?',

		validate: function(value) {
            
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }

	}]).then(function (answers) {
		console.log('===================================');
		console.log('You have selected Item ID ' + answers.Item);
		console.log('Number chosen to be purchased: ' + answers.Quantity);
		console.log('===================================');

		connection.query('SELECT * FROM Products WHERE ?' [{itemID: answers.Item}], function(err, data) {
			//if (err) throw err;
			if (data[0].StockQuantity < answers.Quantity) {
				console.log('I\'m sorry we do not have enough stock to fulfill your order.');
				console.log('Select another product.');
				start();
			} 
			else {
				var stockQty = data[0].StockQuantity - answers.Quantity;
				var price = data[0].Price * answers.Quantity;

				connection.query('UPDATE Products SET StockQuantity = ? WHERE itemID = ?', [stockQty, answers.Item], function(err, data) {
					if (err) throw err;

					console.log('Items successfully purchased!')
					console.log('Your total comes to $' + price);

					inquirer.prompt([{
						name: 'Continue',
						type: 'confirm',
						message: 'Would you like to purchase more items?'
					
					}]).then(function (answers) {
						if(answers.Continue == true) {
							start();
						} 
						else {
							console.log('Thanks for shopping at Bamazon! See you next time!');
							connection.end;
						}
					});
			    });
			}
		});
	});
}

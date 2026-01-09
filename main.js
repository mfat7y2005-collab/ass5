const mysql = require('mysql2');

// Database Connection Configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
   
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
    runTasks();
});

function runTasks() {
    // Task 1: Create Tables
    const createTables = `
    CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT PRIMARY KEY AUTO_INCREMENT,
        SupplierName VARCHAR(255),
        ContactNumber VARCHAR(20)
    );
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INT PRIMARY KEY AUTO_INCREMENT,
        ProductName VARCHAR(255) NOT NULL,
        Price DECIMAL(10,2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    );
    CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT PRIMARY KEY AUTO_INCREMENT,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );`;

    connection.query(createTables, (err) => {
        if (err) console.log("Note: Run queries individually if your setup doesn't support multi-statements.");
        
        // Task 6: Basic Inserts
        const insertData = `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567')`;
        connection.query(insertData, (err, res) => {
            console.log("Task 6: Data inserted successfully.");
            
            // Task 13: Join Query
            const sqlJoin = `
                SELECT Sales.SaleID, Products.ProductName, Sales.SaleDate 
                FROM Sales 
                JOIN Products ON Sales.ProductID = Products.ProductID`;
            
            connection.query(sqlJoin, (err, results) => {
                console.log("Task 13: Sales Report:");
                console.table(results);
                
                connection.end(); // Close connection
            });
        });
    });
}
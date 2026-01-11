// const mysql = require('mysql2');


// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '', 
   
// });

// connection.connect(err => {
//     if (err) throw err;
//     console.log("Connected to MySQL Database.");
//     runTasks();
// });

// // function runTasks() {
// //     // Task 1: Create Tables
// //     const createTables = `
// //     CREATE TABLE IF NOT EXISTS Suppliers (
// //         SupplierID INT PRIMARY KEY AUTO_INCREMENT,
// //         SupplierName VARCHAR(255),
// //         ContactNumber VARCHAR(20)
// //     );
// //     CREATE TABLE IF NOT EXISTS Products (
// //         ProductID INT PRIMARY KEY AUTO_INCREMENT,
// //         ProductName VARCHAR(255) NOT NULL,
// //         Price DECIMAL(10,2),
// //         StockQuantity INT,
// //         SupplierID INT,
// //         FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
// //     );
// //     CREATE TABLE IF NOT EXISTS Sales (
// //         SaleID INT PRIMARY KEY AUTO_INCREMENT,
// //         ProductID INT,
// //         QuantitySold INT,
// //         SaleDate DATE,
// //         FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
// //     );`;

// //     connection.query(createTables, (err) => {
// //         if (err) console.log("Note: Run queries individually if your setup doesn't support multi-statements.");
        
// //         // Task 6: Basic Inserts
// //         const insertData = `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567')`;
// //         connection.query(insertData, (err, res) => {
// //             console.log("Task 6: Data inserted successfully.");
            
// //             // Task 13: Join Query
// //             const sqlJoin = `
// //                 SELECT Sales.SaleID, Products.ProductName, Sales.SaleDate 
// //                 FROM Sales 
// //                 JOIN Products ON Sales.ProductID = Products.ProductID`;
            
// //             connection.query(sqlJoin, (err, results) => {
// //                 console.log("Task 13: Sales Report:");
// //                 console.table(results);
                
// //                 connection.end(); // Close connection
// //             });
// //         });
// //     });
// // }

// const mysql = require('mysql2');

// function runQueries() {
  
//     connection.query(`CREATE TABLE IF NOT EXISTS Suppliers (
//         SupplierID INT PRIMARY KEY AUTO_INCREMENT,
//         SupplierName TEXT,
//         ContactNumber TEXT
//     )`);

//     connection.query(`CREATE TABLE IF NOT EXISTS Products (
//         ProductID INT PRIMARY KEY AUTO_INCREMENT,
//         ProductName TEXT,
//         Price DECIMAL(10,2),
//         StockQuantity INT,
//         SupplierID INT,
//         FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
//     )`);

//     connection.query(`CREATE TABLE IF NOT EXISTS Sales (
//         SaleID INT PRIMARY KEY AUTO_INCREMENT,
//         ProductID INT,
//         QuantitySold INT,
//         SaleDate DATE,
//         FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
//     )`);

    
//     connection.query(`ALTER TABLE Products ADD COLUMN Category VARCHAR(255)`);
//     connection.query(`ALTER TABLE Products DROP COLUMN Category`);
//     connection.query(`ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)`);
//     connection.query(`ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(255) NOT NULL`);

//     connection.query(`INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567')`);
//     connection.query(`INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES 
//         ('Milk', 15.00, 50, 1), ('Bread', 10.00, 30, 1), ('Eggs', 20.00, 40, 1)`);
//     connection.query(`INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (1, 2, '2025-05-20')`);


//     connection.query(`UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`);
//     connection.query(`DELETE FROM Products WHERE ProductName = 'Eggs'`);

    
//     connection.query(`SELECT ProductID, SUM(QuantitySold) FROM Sales GROUP BY ProductID`, (err, res) => console.log('Total Sold:', res));
//     connection.query(`SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1`, (err, res) => console.log('Highest Stock:', res));
//     connection.query(`SELECT * FROM Products WHERE ProductID NOT IN (SELECT ProductID FROM Sales)`, (err, res) => console.log('Never Sold:', res));

    
//     connection.query(`CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'pass123'`);
//     connection.query(`GRANT SELECT, INSERT, UPDATE ON retail_store_db.* TO 'store_manager'@'localhost'`);
//     connection.query(`REVOKE UPDATE ON retail_store_db.* FROM 'store_manager'@'localhost'`);
//     connection.query(`GRANT DELETE ON retail_store_db.Sales TO 'store_manager'@'localhost'`);

//     console.log("All Queries Sent to Execution!");
// }


const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'World',
    multipleStatements: true
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
    runQueries();
});

function runQueries() {

    connection.query(`
        CREATE TABLE IF NOT EXISTS Suppliers (
            SupplierID INT PRIMARY KEY AUTO_INCREMENT,
            SupplierName VARCHAR(255),
            ContactNumber VARCHAR(15)
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
        );
    `);

    connection.query(`
        INSERT INTO Suppliers (SupplierName, ContactNumber)
        VALUES ('FreshFoods', '01001234567');

        INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES
            ('Milk', 15.00, 50, 1),
            ('Bread', 10.00, 30, 1),
            ('Eggs', 20.00, 40, 1);

        INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
        VALUES (1, 2, '2025-05-20');
    `);

    connection.query("UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'");
    connection.query("DELETE FROM Products WHERE ProductName = 'Eggs'");

    connection.query(`SELECT ProductID, SUM(QuantitySold) AS Total FROM Sales GROUP BY ProductID`,
        (err, res) => console.log('Total Sold:', res));

    connection.query(`SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1`,
        (err, res) => console.log('Highest Stock:', res));

    connection.query(`SELECT * FROM Products WHERE ProductID NOT IN (SELECT ProductID FROM Sales)`,
        (err, res) => console.log('Never Sold:', res));

    connection.query(`
        CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'pass123';
        GRANT SELECT, INSERT, UPDATE ON retail_store_db.* TO 'store_manager'@'localhost';
        REVOKE UPDATE ON retail_store_db.* FROM 'store_manager'@'localhost';
        GRANT DELETE ON retail_store_db.Sales TO 'store_manager'@'localhost';
    `);

    console.log("All Queries Sent Successfully!");
}


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

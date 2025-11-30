#!/bin/bash

echo "Setting up MySQL databases for Enterprise Application Suite..."
echo

# MySQL connection parameters
MYSQL_USER="root"
MYSQL_PASSWORD="12345"
MYSQL_PATH="/usr/bin/mysql"

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL client not found. Please install MySQL client."
    exit 1
fi

echo "Connecting to MySQL..."
echo

# Execute SQL script
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" < database-setup.sql

if [ $? -eq 0 ]; then
    echo
    echo "SUCCESS: All databases created successfully!"
    echo
    echo "Created databases:"
    echo "  - inventory_service_db"
    echo "  - order_service_db"
    echo "  - payment_service_db"
    echo "  - user_service_db"
else
    echo
    echo "ERROR: Failed to create databases. Please check your MySQL connection."
    exit 1
fi


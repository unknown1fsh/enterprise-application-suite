@echo off
echo Setting up MySQL databases for Enterprise Application Suite...
echo.

REM MySQL connection parameters
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set MYSQL_USER=root
set MYSQL_PASSWORD=12345

REM Check if MySQL is available
if not exist %MYSQL_PATH% (
    echo ERROR: MySQL not found at %MYSQL_PATH%
    echo Please check your MySQL installation path.
    pause
    exit /b 1
)

echo Connecting to MySQL...
echo.

REM Execute SQL script
%MYSQL_PATH% -u %MYSQL_USER% -p%MYSQL_PASSWORD% < database-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS: All databases created successfully!
    echo.
    echo Created databases:
    echo   - inventory_service_db
    echo   - order_service_db
    echo   - payment_service_db
    echo   - user_service_db
) else (
    echo.
    echo ERROR: Failed to create databases. Please check your MySQL connection.
)

echo.
pause


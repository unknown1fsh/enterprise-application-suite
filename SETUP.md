# Enterprise Application Suite - Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://adoptium.net/
   - Verify installation: `java -version`

2. **Apache Maven 3.6 or higher**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **MySQL Server 8.0**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Default installation path (Windows): `C:\Program Files\MySQL\MySQL Server 8.0`
   - Verify installation: `mysql --version`

4. **Node.js 18 or higher and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

5. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

### System Requirements

- **Operating System**: Windows 10+, Linux, or macOS
- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 2GB free space
- **Network**: Internet connection for downloading dependencies

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/unknown1fsh/enterprise-application-suite.git
cd enterprise-application-suite
```

### 2. Database Setup

#### Option A: Using Setup Scripts (Recommended)

**Windows:**
```bash
setup-databases.bat
```

**Linux/Mac:**
```bash
chmod +x setup-databases.sh
./setup-databases.sh
```

#### Option B: Manual Setup

1. Start MySQL server
2. Open MySQL command line or MySQL Workbench
3. Connect as root user (password: 12345)
4. Execute the SQL script:

```bash
mysql -u root -p12345 < database-setup.sql
```

Or manually run:

```sql
CREATE DATABASE IF NOT EXISTS inventory_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS order_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS payment_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS user_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Verify Database Creation

```sql
SHOW DATABASES LIKE '%_service_db';
```

You should see all 4 databases listed.

### 3. Build Common Library

The common library must be built first as other services depend on it:

```bash
cd common-library
mvn clean install
cd ..
```

### 4. Build All Services

Build all microservices:

```bash
mvn clean install
```

This will:
- Compile all services
- Run tests
- Install artifacts to local Maven repository

### 5. Configure Database Connection (if needed)

If your MySQL is not on localhost:3306 or uses different credentials, update the `application.properties` files in each service:

- `inventory-management-service/src/main/resources/application.properties`
- `order-processing-service/src/main/resources/application.properties`
- `payment-management-service/src/main/resources/application.properties`
- `user-management-service/src/main/resources/application.properties`

Update these lines:
```properties
spring.datasource.url=jdbc:mysql://YOUR_HOST:YOUR_PORT/DATABASE_NAME
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 6. Start Services

**Important**: Start services in the correct order:

#### Step 1: Start Discovery Server

```bash
cd discovery-server
mvn spring-boot:run
```

Wait until you see: "Started DiscoveryServerApplication"

Verify: Open http://localhost:8761 in your browser

#### Step 2: Start API Gateway

Open a new terminal:

```bash
cd api-gateway
mvn spring-boot:run
```

Wait until you see: "Started ApiGatewayApplication"

#### Step 3: Start Microservices

Open separate terminals for each service:

**Terminal 3 - Inventory Service:**
```bash
cd inventory-management-service
mvn spring-boot:run
```

**Terminal 4 - Order Service:**
```bash
cd order-processing-service
mvn spring-boot:run
```

**Terminal 5 - Payment Service:**
```bash
cd payment-management-service
mvn spring-boot:run
```

**Terminal 6 - User Service:**
```bash
cd user-management-service
mvn spring-boot:run
```

### 7. Verify Services are Running

Check Eureka Dashboard: http://localhost:8761

You should see all services registered:
- API-GATEWAY
- INVENTORY-SERVICE
- ORDER-SERVICE
- PAYMENT-SERVICE
- USER-SERVICE

### 8. Setup Frontend

```bash
cd frontend
npm install
```

### 9. Start Frontend

```bash
npm start
```

Frontend will be available at: http://localhost:3000

## Service URLs

Once all services are running:

| Service | Direct URL | Via Gateway |
|---------|-----------|-------------|
| Discovery Server | http://localhost:8761 | - |
| API Gateway | http://localhost:8080 | - |
| Inventory Service | http://localhost:8084 | http://localhost:8080/inventory |
| Order Service | http://localhost:8083 | http://localhost:8080/order |
| Payment Service | http://localhost:8085 | http://localhost:8080/payment |
| User Service | http://localhost:8086 | http://localhost:8080/user |
| Frontend | http://localhost:3000 | - |

## API Documentation

Swagger UI is available for each service:

- Inventory: http://localhost:8084/swagger-ui.html
- Order: http://localhost:8083/swagger-ui.html
- Payment: http://localhost:8085/swagger-ui.html
- User: http://localhost:8086/swagger-ui.html

## Health Checks

Test service health:

```bash
# Inventory
curl http://localhost:8084/inventory/products/health

# Order
curl http://localhost:8083/order/orders/health

# Payment
curl http://localhost:8085/payment/payments/health

# User
curl http://localhost:8086/user/users/health
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

If you get "port already in use" error:

- Check if another instance is running
- Kill the process using the port
- Or change the port in `application.properties`

#### 2. Database Connection Failed

- Verify MySQL is running
- Check database credentials
- Ensure databases are created
- Check MySQL port (default: 3306)

#### 3. Service Not Registering with Eureka

- Ensure Discovery Server is running first
- Check Eureka URL in `application.properties`
- Verify service name matches Eureka registration

#### 4. Maven Build Fails

- Check Java version: `java -version` (should be 17+)
- Check Maven version: `mvn -version` (should be 3.6+)
- Clean and rebuild: `mvn clean install -U`

#### 5. Frontend Build Fails

- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules` (Linux/Mac) or `rmdir /s node_modules` (Windows)
- Reinstall: `npm install`

### Logs

Check service logs for errors. Logs are typically in the console where you started the service.

## Development Tips

### Running Services in IDE

You can also run services directly from your IDE (IntelliJ IDEA, Eclipse, VS Code):

1. Import the project as Maven project
2. Run the main class: `*Application.java` in each service
3. Ensure common-library is installed: `mvn install` in common-library folder

### Hot Reload

Spring Boot DevTools is included for hot reload. Changes to code will automatically restart the service.

### Database Schema

Hibernate will automatically create tables on first run (`spring.jpa.hibernate.ddl-auto=update`). For production, use Flyway or Liquibase for migrations.

## Next Steps

1. Explore the API using Swagger UI
2. Test endpoints using Postman or curl
3. Check the frontend at http://localhost:3000
4. Review the code structure
5. Read ARCHITECTURE.md for detailed architecture information

## Production Deployment

For production deployment:

1. Set up proper security (JWT, HTTPS)
2. Configure production database
3. Set up monitoring and logging
4. Use Docker containers
5. Deploy to Kubernetes
6. Set up CI/CD pipeline

See ARCHITECTURE.md for more details on production considerations.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues
- Review documentation

---

Happy coding! 🚀


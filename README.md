# Enterprise Application Suite

This repository hosts a monorepo structured project for an e-commerce platform built with Spring Boot microservices. The suite includes an **API Gateway**, **Discovery Server**, and four core microservices: **Inventory Management Service**, **Order Processing Service**, **Payment Management Service**, and **User Management Service**. The project is designed with a microservice architecture to offer a modular and scalable solution.

## 📑 About the Project

The **Enterprise Application Suite** is an e-commerce platform leveraging microservice architecture to manage essential functionalities independently. Each microservice is developed as a standalone module that performs a specific function, ensuring flexibility and ease of maintenance.

### 🛠️ Technologies and Tools Used

- **Java 17**
- **Spring Boot**
- **Spring Security** - Configured to optionally bypass password entry for development/testing
- **Netflix Eureka** - For Service Discovery and Registry
- **API Gateway** - To manage traffic between microservices
- **React (Planned for Frontend Integration)** - Will be connected in the next phase
- **MySQL** - Database management

## 🚀 Microservices Overview

### 1. API Gateway
Manages the routing of requests to the appropriate microservices and handles cross-cutting concerns such as logging, monitoring, and security.

### 2. Discovery Server
Utilizes Netflix Eureka to enable dynamic discovery and management of all microservices.

### 3. Inventory Management Service
Handles functionalities related to product inventory management, including stock levels and item details.

### 4. Order Processing Service
Manages the lifecycle of order processing, from order creation to fulfillment.

### 5. Payment Management Service
Handles payment transactions and processing, ensuring secure and reliable payment flows.

### 6. User Management Service
Manages user registration, authentication, and authorization processes.

## 🔒 Security Configuration

The project incorporates **Spring Security** to provide essential security features. Currently, the password authentication mechanism is disabled by default to streamline development and testing. This configuration is optional and can be enabled for production environments by adjusting the security settings in the configuration files (e.g., `application.yml` or `application.properties`).

```yaml
# Example Security Configuration
security:
  enabled: true # Set to true to enable password authentication, false to bypass
```

## 🔧 Getting Started

1. Clone this repository:
    ```bash
    git clone https://github.com/unknown1fsh/enterprise-application-suite.git
    ```

2. Navigate to each microservice folder and install dependencies:
    ```bash
    mvn clean install
    ```

3. Run the microservices using the following command:
    ```bash
    mvn spring-boot:run
    ```

4. Ensure the **API Gateway** and **Discovery Server** are running before starting the other microservices.

## 📝 Future Enhancements

- **React-Based Frontend**: A user-friendly and interactive interface will be developed to enhance the user experience.
- **Role-Based Access Control (RBAC)**: An advanced authorization system will be implemented to manage user roles and permissions.
- **Swagger UI**: API documentation and testing capabilities will be integrated for better developer experience.

## 📫 Contributing

If you would like to contribute to the project, feel free to submit a **Pull Request** or reach out to [unknown1fsh](https://github.com/unknown1fsh) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

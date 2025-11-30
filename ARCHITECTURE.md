# Enterprise Application Suite - Architecture Documentation

## Overview

This document describes the architecture of the Enterprise Application Suite, a microservices-based e-commerce platform built with Spring Boot and React.

## Architecture Principles

### 1. Generic Architecture Pattern

The project implements a full generic architecture pattern through a shared `common-library` module. This ensures:

- **Code Reusability**: Common functionality is implemented once and reused across all services
- **Consistency**: All services follow the same patterns and conventions
- **Maintainability**: Changes to common functionality are centralized
- **Type Safety**: Generic types ensure compile-time safety

### 2. Domain-Driven Design (DDD)

Each microservice follows DDD principles with clear layer separation:

#### Domain Layer
- **Entities**: Core business objects extending `BaseEntity<T>`
- **Value Objects**: Immutable objects representing domain concepts
- **Repository Interfaces**: Domain-specific repository contracts
- **Domain Events**: Events representing business occurrences

#### Application Layer
- **Use Cases**: Business logic orchestration
- **DTOs**: Data Transfer Objects for API communication
- **Application Services**: Service interfaces and implementations
- **Mappers**: Entity-DTO conversion logic

#### Infrastructure Layer
- **Repository Implementations**: JPA-based data access
- **External Services**: Integration with third-party services
- **Configuration**: Spring configuration classes

#### Presentation Layer
- **Controllers**: REST API endpoints
- **Request/Response DTOs**: API-specific data structures
- **Exception Handlers**: Error handling and response formatting

### 3. CQRS Pattern

The architecture supports Command Query Responsibility Segregation:

- **Command Side**: Write operations (Create, Update, Delete)
- **Query Side**: Read operations (Get, List, Search) - optimized queries
- **Event Sourcing**: Ready for domain events implementation

## Common Library Architecture

### BaseEntity<T>

All entities extend `BaseEntity<T>` which provides:

```java
- id: T (generic ID type)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
- version: Long (optimistic locking)
- createdBy: String
- updatedBy: String
- deleted: Boolean (soft delete support)
```

### GenericRepository<T, ID>

Extends Spring Data JPA's `JpaRepository` and `JpaSpecificationExecutor`:

- Standard CRUD operations
- Soft delete support
- Specification-based queries
- Custom query methods

### GenericService<T, ID, DTO>

Provides standard service operations:

- `create(DTO)`: Create new entity
- `update(ID, DTO)`: Update existing entity
- `delete(ID)`: Hard delete
- `softDelete(ID)`: Soft delete
- `findById(ID)`: Find by ID
- `findAll()`: List all
- `findAll(PageableDTO)`: Paginated list
- `findAll(FilterDTO)`: Filtered and paginated list
- `count()`: Count entities
- `existsById(ID)`: Check existence

### GenericController<T, ID, DTO>

Base controller providing standard REST endpoints:

- `POST /`: Create
- `PUT /{id}`: Update
- `DELETE /{id}`: Delete
- `DELETE /{id}/soft`: Soft delete
- `GET /{id}`: Get by ID
- `GET /`: List (with pagination)
- `POST /search`: Advanced search
- `GET /count`: Count
- `GET /exists/{id}`: Check existence

### Generic Mapper

`BaseMapper<T, DTO>` provides:

- Entity to DTO conversion
- DTO to Entity conversion
- List conversions
- Update entity from DTO

### Response Wrappers

- **ApiResponse<T>**: Standard API response wrapper
- **PagedResponse<T>**: Paginated response wrapper
- **ErrorResponse**: Error response wrapper

### Exception Handling

- **GlobalExceptionHandler**: Centralized exception handling
- **BusinessException**: Business logic exceptions
- **ValidationException**: Validation errors
- **ResourceNotFoundException**: Resource not found

## Microservices Architecture

### Service Communication

```
Client
  ↓
API Gateway (Port 8080)
  ↓
Eureka Discovery Server (Port 8761)
  ↓
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Inventory  │    Order    │   Payment   │    User     │
│  (8084)     │   (8083)    │   (8085)    │   (8086)    │
└─────────────┴─────────────┴─────────────┴─────────────┘
      ↓            ↓            ↓            ↓
  MySQL DB    MySQL DB    MySQL DB    MySQL DB
```

### Service Responsibilities

#### Inventory Management Service
- Manages product catalog
- Tracks stock levels
- Handles product categories
- Product search and filtering

#### Order Processing Service
- Creates and manages orders
- Tracks order status
- Manages order items
- Integrates with Inventory and Payment services

#### Payment Management Service
- Processes payments
- Manages payment transactions
- Supports multiple payment methods
- Tracks payment status

#### User Management Service
- User registration and authentication
- User profile management
- Role-based access control
- Password management

## Database Architecture

### Database per Service Pattern

Each microservice has its own database:

- `inventory_service_db`: Product and inventory data
- `order_service_db`: Order and order item data
- `payment_service_db`: Payment transaction data
- `user_service_db`: User and authentication data

### Entity Relationships

- **Order** → **OrderItem**: One-to-Many
- Services communicate via APIs, not direct database access

## API Gateway

### Responsibilities

- **Routing**: Routes requests to appropriate services
- **Load Balancing**: Distributes load across service instances
- **CORS**: Handles cross-origin requests
- **Authentication**: Centralized authentication (ready for JWT)
- **Rate Limiting**: Request rate limiting (ready for implementation)
- **Request/Response Transformation**: Data transformation (ready for implementation)

### Routing Configuration

```
/inventory/** → INVENTORY-SERVICE
/order/**     → ORDER-SERVICE
/payment/**   → PAYMENT-SERVICE
/user/**      → USER-SERVICE
```

## Frontend Architecture

### Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **Redux Toolkit**: State management
- **React Router**: Routing
- **Axios**: HTTP client

### Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API service clients
│   ├── store/          # Redux store
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app component
```

## Security Architecture

### Current State (Development)

- All endpoints are open for development
- Security configured but permissive

### Production Ready Features

- **JWT Authentication**: Ready for implementation
- **Password Encryption**: BCrypt implemented
- **Role-Based Access Control**: Role enum defined
- **API Security**: Ready for API key management

## Scalability Considerations

### Horizontal Scaling

- Services can be scaled independently
- Eureka handles service discovery for multiple instances
- API Gateway load balances across instances

### Database Scaling

- Each service has its own database
- Read replicas can be added per service
- Database sharding ready

## Monitoring and Observability

### Health Checks

- Spring Boot Actuator endpoints
- Custom health indicators
- Service discovery health status

### Logging

- Structured logging ready
- Centralized logging ready for implementation

### Metrics

- Actuator metrics endpoints
- Custom metrics ready for implementation

## Deployment Architecture

### Development

- Services run as standalone Spring Boot applications
- MySQL databases on localhost
- Frontend development server

### Production Ready

- Docker containerization ready
- Kubernetes manifests ready for creation
- CI/CD pipeline ready for implementation

## Future Architecture Enhancements

1. **Distributed Tracing**: Zipkin/Jaeger integration
2. **Circuit Breaker**: Resilience4j for fault tolerance
3. **Message Queue**: RabbitMQ/Kafka for async communication
4. **Caching**: Redis for distributed caching
5. **Monitoring**: Prometheus + Grafana
6. **Service Mesh**: Istio/Linkerd preparation

## Best Practices

1. **Generic Patterns**: Use common library for consistency
2. **DDD Layers**: Maintain clear layer separation
3. **API Versioning**: Ready for v1, v2 support
4. **Error Handling**: Use global exception handler
5. **Validation**: Use Jakarta Validation
6. **Documentation**: Swagger for all APIs
7. **Testing**: Unit and integration tests

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable microservices application with generic patterns, DDD principles, and modern technologies.


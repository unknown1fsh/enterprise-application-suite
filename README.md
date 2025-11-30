# 🚀 Enterprise Application Suite

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen?style=for-the-badge&logo=spring&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.3-blue?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Enterprise-grade mikroservis mimarisi ile geliştirilmiş, generic yapıda, modern e-ticaret platformu**

**An enterprise-grade e-commerce platform built with microservices architecture, generic structure, and modern technologies**

[⭐ Star](https://github.com/unknown1fsh/enterprise-application-suite) • [🐛 Report Bug](https://github.com/unknown1fsh/enterprise-application-suite/issues) • [💡 Request Feature](https://github.com/unknown1fsh/enterprise-application-suite/issues)

---

**🇹🇷 [Türkçe](#-türkçe) • [🇬🇧 English](#-english)**

</div>

---

# 🇹🇷 Türkçe

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknoloji Stack'i](#-teknoloji-stacki)
- [Mimari](#-mimari)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Proje Hakkında

**Enterprise Application Suite**, mikroservis mimarisi kullanılarak geliştirilmiş, enterprise-grade bir e-ticaret platformudur. Proje, generic yapıda tasarlanmış, Domain-Driven Design (DDD) prensiplerine uygun, CQRS pattern'i destekleyen ve modern teknolojilerle geliştirilmiş kapsamlı bir çözümdür.

### 🌟 Projeyi Öne Çıkaran Özellikler

- ✅ **Tam Generic Yapı**: Tüm servisler ortak bir generic library kullanır, kod tekrarı yok
- ✅ **DDD Uyumlu**: Clean Architecture ve Domain-Driven Design prensipleri
- ✅ **Production Ready**: Gerçek projelerde kullanıma hazır, test edilmiş mimari
- ✅ **Modern Stack**: En güncel teknolojiler ve industry best practices
- ✅ **Kapsamlı Dokümantasyon**: Her şey detaylıca açıklanmış
- ✅ **Tam Entegre Frontend**: React + TypeScript ile modern, responsive UI
- ✅ **Mikroservis Mimarisi**: Bağımsız ölçeklenebilir servisler
- ✅ **Service Discovery**: Netflix Eureka ile dinamik servis keşfi
- ✅ **API Gateway**: Tüm servislere tek noktadan erişim

---

## ✨ Özellikler

### 🔧 Backend Özellikleri

#### Generic Common Library

Tüm servisler tarafından kullanılan güçlü ortak kütüphane:

- **Generic Base Entity**: Audit fields (createdAt, updatedAt, version, createdBy, updatedBy) ve soft delete desteği
- **Generic Repository**: Soft delete, specification pattern ile dinamik filtreleme, custom query methods
- **Generic Service**: Tam CRUD operasyonları, pagination, filtering, sorting
- **Generic Controller**: Otomatik REST endpoint'leri (POST, PUT, DELETE, GET, SEARCH)
- **Generic Mapper**: Entity-DTO dönüşümleri için MapStruct tabanlı mapping
- **Response Wrappers**: Standart API response formatları (ApiResponse, PagedResponse, ErrorResponse)
- **Global Exception Handler**: Merkezi hata yönetimi ve tutarlı error responses
- **Specification Builder**: Dinamik query oluşturma ve filtreleme

#### Domain-Driven Design (DDD)

Her mikroservis katmanlı mimariye sahiptir:

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   - Controllers                     │
│   - Request/Response DTOs           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Layer                 │
│   - Use Cases                       │
│   - Service Interfaces              │
│   - DTOs & Mappers                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer                      │
│   - Entities                        │
│   - Repository Interfaces           │
│   - Domain Events                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│   - Repository Implementations      │
│   - External Services               │
│   - Configuration                   │
└─────────────────────────────────────┘
```

#### Mikroservisler

- **📦 Inventory Service (Port 8084)**: 
  - Ürün kataloğu yönetimi
  - Stok takibi ve güncelleme
  - Ürün arama ve filtreleme
  - Kategori yönetimi

- **🛒 Order Service (Port 8083)**:
  - Sipariş oluşturma ve yönetimi
  - Sipariş durumu takibi
  - Sipariş öğeleri yönetimi
  - Inventory ve Payment servisleri ile entegrasyon

- **💳 Payment Service (Port 8085)**:
  - Ödeme işleme ve doğrulama
  - Transaction yönetimi
  - Çoklu ödeme yöntemi desteği
  - Ödeme durumu takibi

- **👤 User Service (Port 8086)**:
  - Kullanıcı kayıt ve kimlik doğrulama
  - Profil yönetimi
  - Rol tabanlı erişim kontrolü (RBAC)
  - Şifre yönetimi ve güvenlik

#### API Gateway & Service Discovery

- **API Gateway (Port 8080)**: 
  - Tüm servislere tek noktadan erişim
  - Load balancing
  - CORS yönetimi
  - Request routing

- **Eureka Discovery Server (Port 8761)**:
  - Servis kaydı ve keşfi
  - Health check monitoring
  - Service registry dashboard

#### Güvenlik ve Dokümantasyon

- **Spring Security**: JWT hazır yapılandırma
- **Swagger/OpenAPI**: Tüm servisler için interaktif API dokümantasyonu
- **CORS Support**: Frontend entegrasyonu için hazır
- **Global Exception Handling**: Merkezi hata yönetimi

### 🎨 Frontend Özellikleri

- **React 18 + TypeScript**: Modern, type-safe frontend geliştirme
- **Material-UI (MUI)**: Profesyonel, responsive UI component library
- **Redux Toolkit**: Merkezi state yönetimi
- **React Router**: Client-side routing
- **Axios**: HTTP client ile API entegrasyonu
- **Responsive Design**: Mobile-first, tüm cihazlarda mükemmel görünüm
- **Modern Dashboard**: Tüm servislerin durumunu gerçek zamanlı gösteren dashboard
- **Type Safety**: Full TypeScript desteği ile compile-time error checking

---

## 🛠️ Teknoloji Stack'i

### Backend Stack

| Kategori | Teknoloji | Versiyon | Açıklama |
|----------|-----------|----------|----------|
| **Language** | Java | 17 | Modern Java özellikleri |
| **Framework** | Spring Boot | 3.3.3 | Enterprise application framework |
| **Microservices** | Spring Cloud | 2023.0.3 | Mikroservis araçları |
| **Security** | Spring Security | - | Güvenlik ve yetkilendirme |
| **Discovery** | Netflix Eureka | - | Service discovery |
| **Gateway** | Spring Cloud Gateway | - | API Gateway |
| **ORM** | Spring Data JPA | - | Veritabanı erişimi |
| **ORM** | Hibernate | - | JPA implementasyonu |
| **Database** | MySQL | 8.0 | İlişkisel veritabanı |
| **Code Generation** | Lombok | - | Boilerplate azaltma |
| **Mapping** | MapStruct | - | Entity-DTO mapping |
| **Documentation** | Swagger/OpenAPI | 2.3.0 | API dokümantasyonu |
| **Build Tool** | Maven | 3.6+ | Bağımlılık yönetimi |

### Frontend Stack

| Kategori | Teknoloji | Versiyon | Açıklama |
|----------|-----------|----------|----------|
| **Library** | React | 18 | UI library |
| **Language** | TypeScript | 5 | Type-safe JavaScript |
| **UI Framework** | Material-UI | 7 | Component library |
| **State Management** | Redux Toolkit | 2 | Predictable state container |
| **Routing** | React Router | 7 | Declarative routing |
| **HTTP Client** | Axios | 1 | Promise-based HTTP client |
| **Build Tool** | React Scripts | 5.0.1 | Create React App |

---

## 🏗️ Mimari

### Mikroservis Mimarisi

```
┌──────────────────────────────────────────────────────────────┐
│                      Client (Browser)                         │
│                    React + TypeScript                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              API Gateway (Port 8080)                          │
│    • Routing • Load Balancing • CORS • Authentication        │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│        Eureka Discovery Server (Port 8761)                    │
│         Service Registry & Discovery • Health Check          │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Inventory   │  │    Order     │  │   Payment    │  │     User     │
│   Service    │  │   Service    │  │   Service    │  │   Service    │
│   (8084)     │  │   (8083)     │  │   (8085)     │  │   (8086)     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  MySQL DB    │  │   MySQL DB   │  │   MySQL DB   │  │   MySQL DB   │
│  Inventory   │  │    Order     │  │   Payment    │  │     User     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Generic Yapı - Common Library

Tüm mikroservisler ortak bir `common-library` kullanır:

```
common-library/
├── entity/
│   └── BaseEntity.java              # Generic base entity (audit fields)
├── repository/
│   ├── GenericRepository.java       # Generic repository interface
│   └── GenericRepositoryImpl.java   # Generic repository implementation
├── service/
│   ├── GenericService.java          # Generic service interface
│   └── GenericServiceImpl.java      # Generic service implementation
├── controller/
│   └── GenericController.java       # Generic REST controller
├── mapper/
│   ├── BaseMapper.java              # Base mapper interface
│   └── GenericMapper.java           # Generic mapper implementation
├── dto/
│   ├── BaseDTO.java                 # Base DTO class
│   ├── PageableDTO.java             # Pagination DTO
│   └── FilterDTO.java               # Filter DTO
├── response/
│   ├── ApiResponse.java             # Standard API response
│   ├── PagedResponse.java           # Paginated response
│   └── ErrorResponse.java           # Error response
├── exception/
│   ├── GlobalExceptionHandler.java  # Global exception handler
│   ├── BusinessException.java       # Business exception
│   ├── ResourceNotFoundException.java
│   └── ValidationException.java
├── specification/
│   └── SpecificationBuilder.java    # Dynamic query builder
├── validation/
│   ├── ValidEmail.java              # Email validator
│   ├── ValidPhone.java              # Phone validator
│   └── ...
└── util/
    ├── CommonUtils.java             # Common utilities
    └── PageUtils.java               # Pagination utilities
```

### DDD Katmanları

Her mikroservis şu katmanlı yapıya sahiptir:

```
service-name/
├── domain/                          # Domain Layer (Business Logic)
│   ├── entity/                      # Domain entities
│   │   └── EntityName.java
│   └── repository/                  # Repository interfaces
│       └── EntityRepository.java
│
├── application/                     # Application Layer (Use Cases)
│   ├── dto/                         # Data Transfer Objects
│   │   ├── EntityDTO.java
│   │   └── EntityRequestDTO.java
│   ├── service/                     # Service interfaces & implementations
│   │   ├── EntityService.java
│   │   └── EntityServiceImpl.java
│   └── mapper/                      # Entity-DTO mappers
│       └── EntityMapper.java
│
├── infrastructure/                  # Infrastructure Layer (Technical)
│   └── repository/                  # JPA repository implementations
│       └── EntityRepositoryImpl.java
│
└── presentation/                    # Presentation Layer (API)
    └── controller/                  # REST controllers
        └── EntityController.java
```

### Veritabanı Mimarisi

**Database per Service Pattern**: Her mikroservis kendi veritabanına sahiptir

| Servis | Veritabanı | Açıklama |
|--------|-----------|----------|
| Inventory Service | `inventory_service_db` | Ürün ve stok verileri |
| Order Service | `order_service_db` | Sipariş ve sipariş öğesi verileri |
| Payment Service | `payment_service_db` | Ödeme işlem verileri |
| User Service | `user_service_db` | Kullanıcı ve kimlik doğrulama verileri |

**Özellikler:**
- Her servis kendi veritabanına sahip
- Servisler API üzerinden iletişim kurar, doğrudan veritabanı erişimi yok
- Veritabanı bağımsızlığı
- Ölçeklenebilirlik

---

## 📦 Kurulum

### Gereksinimler

Aşağıdaki yazılımların sisteminizde yüklü olması gerekmektedir:

- ☕ **Java 17** veya üzeri
- 📦 **Maven 3.6+**
- 🗄️ **MySQL 8.0**
- 📱 **Node.js 18+** ve npm
- 🔧 **Git**

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/unknown1fsh/enterprise-application-suite.git
cd enterprise-application-suite
```

### Adım 2: Veritabanını Kurun

#### Windows

```bash
setup-databases.bat
```

#### Linux/Mac

```bash
chmod +x setup-databases.sh
./setup-databases.sh
```

#### Manuel Kurulum

```bash
mysql -u root -p12345 < database-setup.sql
```

Bu işlem aşağıdaki veritabanlarını oluşturur:
- `inventory_service_db`
- `order_service_db`
- `payment_service_db`
- `user_service_db`

**Not:** MySQL şifreniz farklıysa, `database-setup.sql` dosyasını düzenleyin veya manuel olarak çalıştırın.

### Adım 3: Common Library'yi Derleyin

Common library diğer servislerin bağımlılığı olduğu için önce derlenmelidir:

```bash
cd common-library
mvn clean install
cd ..
```

### Adım 4: Tüm Servisleri Derleyin

```bash
mvn clean install
```

Bu komut tüm mikroservisleri ve bağımlılıklarını derler.

### Adım 5: Servisleri Başlatın

**ÖNEMLİ**: Servisleri aşağıdaki sırayla başlatın!

#### 1. Discovery Server (Port 8761)

İlk olarak Discovery Server'ı başlatın:

```bash
cd discovery-server
mvn spring-boot:run
```

✅ Başarılı olduğunda: http://localhost:8761 adresini tarayıcıda açın ve Eureka Dashboard'u kontrol edin.

#### 2. API Gateway (Port 8080)

Yeni bir terminal açın:

```bash
cd api-gateway
mvn spring-boot:run
```

#### 3. Mikroservisler

Her servis için yeni bir terminal açın:

**Inventory Service (Port 8084):**
```bash
cd inventory-management-service
mvn spring-boot:run
```

**Order Service (Port 8083):**
```bash
cd order-processing-service
mvn spring-boot:run
```

**Payment Service (Port 8085):**
```bash
cd payment-management-service
mvn spring-boot:run
```

**User Service (Port 8086):**
```bash
cd user-management-service
mvn spring-boot:run
```

### Adım 6: Servis Durumunu Kontrol Edin

Tüm servislerin başarıyla başladığını kontrol etmek için:

1. **Eureka Dashboard**: http://localhost:8761
   - Tüm servislerin "UP" durumunda olduğunu görmelisiniz

2. **Health Check** (opsiyonel):
```bash
curl http://localhost:8084/inventory/products/health
curl http://localhost:8083/order/orders/health
curl http://localhost:8085/payment/payments/health
curl http://localhost:8086/user/users/health
```

### Adım 7: Frontend'i Başlatın

Yeni bir terminal açın:

```bash
cd frontend
npm install
npm start
```

Frontend otomatik olarak http://localhost:3000 adresinde açılacaktır.

---

## 🚀 Kullanım

### Servis URL'leri

| Servis | Doğrudan URL | Gateway Üzerinden | Açıklama |
|--------|--------------|-------------------|----------|
| **Discovery Server** | http://localhost:8761 | - | Eureka Dashboard |
| **API Gateway** | http://localhost:8080 | - | Tüm API'ler için giriş noktası |
| **Inventory Service** | http://localhost:8084 | http://localhost:8080/inventory | Ürün yönetimi |
| **Order Service** | http://localhost:8083 | http://localhost:8080/order | Sipariş yönetimi |
| **Payment Service** | http://localhost:8085 | http://localhost:8080/payment | Ödeme işlemleri |
| **User Service** | http://localhost:8086 | http://localhost:8080/user | Kullanıcı yönetimi |
| **Frontend** | http://localhost:3000 | - | React uygulaması |

### Eureka Dashboard

Tüm servislerin durumunu görüntülemek için:
- **URL**: http://localhost:8761
- Kayıtlı tüm servisleri görüntüleyin
- Servis health status'lerini kontrol edin

### Frontend Kullanımı

1. **Dashboard**: http://localhost:3000
   - Tüm servislerin durumunu gerçek zamanlı görüntüleyin
   - Health check sonuçlarını izleyin

2. **Ürünler Sayfası**:
   - Ürün ekleme
   - Ürün listeleme
   - Ürün düzenleme
   - Ürün silme

3. **Siparişler Sayfası**:
   - Sipariş görüntüleme
   - Sipariş durumu takibi

### API Örnekleri

#### 1. Ürün Oluşturma

```bash
curl -X POST http://localhost:8080/inventory/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Yüksek performanslı laptop",
    "price": 9999.99,
    "stockQuantity": 10,
    "category": "Elektronik",
    "sku": "LAP-001"
  }'
```

#### 2. Ürün Listeleme

```bash
curl http://localhost:8080/inventory/products
```

#### 3. Kullanıcı Kaydı

```bash
curl -X POST http://localhost:8080/user/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "kullanici_adi",
    "email": "email@example.com",
    "password": "sifre123",
    "firstName": "Ad",
    "lastName": "Soyad"
  }'
```

#### 4. Kullanıcı Girişi

```bash
curl -X POST http://localhost:8080/user/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "kullanici_adi",
    "password": "sifre123"
  }'
```

#### 5. Sipariş Oluşturma

```bash
curl -X POST http://localhost:8080/order/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 9999.99
      }
    ]
  }'
```

---

## 📚 API Dokümantasyonu

Her servis için Swagger UI dokümantasyonu mevcuttur. Swagger UI'da tüm endpoint'leri görebilir, API'leri test edebilir ve request/response örneklerini inceleyebilirsiniz.

| Servis | Swagger UI URL |
|--------|----------------|
| **Inventory Service** | http://localhost:8084/swagger-ui.html |
| **Order Service** | http://localhost:8083/swagger-ui.html |
| **Payment Service** | http://localhost:8085/swagger-ui.html |
| **User Service** | http://localhost:8086/swagger-ui.html |

### Swagger UI Özellikleri

- ✅ Tüm endpoint'leri görüntüleme
- ✅ Request/Response şemalarını inceleme
- ✅ API'leri doğrudan test etme
- ✅ Model tanımlarını görüntüleme
- ✅ Authentication desteği (JWT hazır)

---

## 📁 Proje Yapısı

```
enterprise-application-suite/
│
├── api-gateway/                    # API Gateway Service
│   └── src/main/java/com/ecommerce/api_gateway/
│
├── discovery-server/               # Eureka Discovery Server
│   └── src/main/java/com/ecommerce/discovery_server/
│
├── common-library/                 # Shared Common Library
│   └── src/main/java/com/ecommerce/common/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       ├── controller/
│       ├── mapper/
│       ├── dto/
│       ├── response/
│       ├── exception/
│       └── util/
│
├── inventory-management-service/   # Inventory Microservice
│   └── src/main/java/com/ecommerce/inventory_service/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
│
├── order-processing-service/       # Order Microservice
│   └── src/main/java/com/ecommerce/order_service/
│
├── payment-management-service/     # Payment Microservice
│   └── src/main/java/com/ecommerce/payment_service/
│
├── user-management-service/        # User Microservice
│   └── src/main/java/com/ecommerce/user_service/
│
├── frontend/                       # React Frontend Application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
│
├── database-setup.sql              # Database setup script
├── setup-databases.sh              # Database setup (Linux/Mac)
├── setup-databases.bat             # Database setup (Windows)
├── ARCHITECTURE.md                 # Detailed architecture docs
├── SETUP.md                        # Detailed setup guide
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
└── README.md                       # This file
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Bu projeyi geliştirmek için:

1. ⭐ Projeyi yıldızlayın
2. 🍴 Projeyi fork edin
3. 🌿 Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
4. 💾 Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
5. 📤 Branch'inizi push edin (`git push origin feature/amazing-feature`)
6. 🔄 Pull Request oluşturun

### Katkıda Bulunma Kuralları

- ✅ Kod standartlarına uyun (Google Java Style Guide)
- ✅ Yeni özellikler için test yazın
- ✅ Dokümantasyonu güncelleyin
- ✅ Açıklayıcı commit mesajları kullanın
- ✅ Pull Request'lerde değişikliklerinizi detaylı açıklayın

Detaylı bilgi için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakabilirsiniz.

---

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👥 Yazar

**unknown1fsh**

- GitHub: [@unknown1fsh](https://github.com/unknown1fsh)

---

## 🙏 Teşekkürler

- Spring Boot ekibine harika framework için
- Netflix'e Eureka service discovery için
- Material-UI ekibine React component library için
- Tüm açık kaynak topluluğuna ve katkıda bulunanlara

---

## 📊 Proje İstatistikleri

![GitHub stars](https://img.shields.io/github/stars/unknown1fsh/enterprise-application-suite?style=social)
![GitHub forks](https://img.shields.io/github/forks/unknown1fsh/enterprise-application-suite?style=social)
![GitHub issues](https://img.shields.io/github/issues/unknown1fsh/enterprise-application-suite)
![GitHub pull requests](https://img.shields.io/github/issues-pr/unknown1fsh/enterprise-application-suite)
![GitHub license](https://img.shields.io/github/license/unknown1fsh/enterprise-application-suite)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldızlamayı unutmayın! ⭐**

Made with ❤️ by [unknown1fsh](https://github.com/unknown1fsh)

</div>

---

# 🇬🇧 English

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**Enterprise Application Suite** is an enterprise-grade e-commerce platform built with microservices architecture. The project is designed with a generic structure, follows Domain-Driven Design (DDD) principles, supports CQRS pattern, and is developed with modern technologies as a comprehensive solution.

### 🌟 Key Features That Make This Project Stand Out

- ✅ **Fully Generic Structure**: All services use a common generic library, eliminating code duplication
- ✅ **DDD Compliant**: Clean Architecture and Domain-Driven Design principles
- ✅ **Production Ready**: Tested architecture ready for real-world use
- ✅ **Modern Stack**: Latest technologies and industry best practices
- ✅ **Comprehensive Documentation**: Everything is thoroughly explained
- ✅ **Fully Integrated Frontend**: Modern, responsive UI with React + TypeScript
- ✅ **Microservices Architecture**: Independently scalable services
- ✅ **Service Discovery**: Dynamic service discovery with Netflix Eureka
- ✅ **API Gateway**: Single entry point for all services

---

## ✨ Features

### 🔧 Backend Features

#### Generic Common Library

Powerful shared library used by all services:

- **Generic Base Entity**: Audit fields (createdAt, updatedAt, version, createdBy, updatedBy) and soft delete support
- **Generic Repository**: Soft delete, dynamic filtering with specification pattern, custom query methods
- **Generic Service**: Full CRUD operations, pagination, filtering, sorting
- **Generic Controller**: Automatic REST endpoints (POST, PUT, DELETE, GET, SEARCH)
- **Generic Mapper**: MapStruct-based mapping for Entity-DTO conversions
- **Response Wrappers**: Standard API response formats (ApiResponse, PagedResponse, ErrorResponse)
- **Global Exception Handler**: Centralized error handling and consistent error responses
- **Specification Builder**: Dynamic query building and filtering

#### Domain-Driven Design (DDD)

Each microservice has a layered architecture:

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   - Controllers                     │
│   - Request/Response DTOs           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Application Layer                 │
│   - Use Cases                       │
│   - Service Interfaces              │
│   - DTOs & Mappers                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer                      │
│   - Entities                        │
│   - Repository Interfaces           │
│   - Domain Events                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer              │
│   - Repository Implementations      │
│   - External Services               │
│   - Configuration                   │
└─────────────────────────────────────┘
```

#### Microservices

- **📦 Inventory Service (Port 8084)**:
  - Product catalog management
  - Stock tracking and updates
  - Product search and filtering
  - Category management

- **🛒 Order Service (Port 8083)**:
  - Order creation and management
  - Order status tracking
  - Order items management
  - Integration with Inventory and Payment services

- **💳 Payment Service (Port 8085)**:
  - Payment processing and verification
  - Transaction management
  - Multiple payment method support
  - Payment status tracking

- **👤 User Service (Port 8086)**:
  - User registration and authentication
  - Profile management
  - Role-based access control (RBAC)
  - Password management and security

#### API Gateway & Service Discovery

- **API Gateway (Port 8080)**:
  - Single entry point for all services
  - Load balancing
  - CORS management
  - Request routing

- **Eureka Discovery Server (Port 8761)**:
  - Service registration and discovery
  - Health check monitoring
  - Service registry dashboard

#### Security and Documentation

- **Spring Security**: JWT-ready configuration
- **Swagger/OpenAPI**: Interactive API documentation for all services
- **CORS Support**: Ready for frontend integration
- **Global Exception Handling**: Centralized error management

### 🎨 Frontend Features

- **React 18 + TypeScript**: Modern, type-safe frontend development
- **Material-UI (MUI)**: Professional, responsive UI component library
- **Redux Toolkit**: Centralized state management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API integration
- **Responsive Design**: Mobile-first, perfect appearance on all devices
- **Modern Dashboard**: Real-time dashboard showing all service statuses
- **Type Safety**: Full TypeScript support with compile-time error checking

---

## 🛠️ Technology Stack

### Backend Stack

| Category | Technology | Version | Description |
|----------|-----------|---------|-------------|
| **Language** | Java | 17 | Modern Java features |
| **Framework** | Spring Boot | 3.3.3 | Enterprise application framework |
| **Microservices** | Spring Cloud | 2023.0.3 | Microservices tools |
| **Security** | Spring Security | - | Security and authorization |
| **Discovery** | Netflix Eureka | - | Service discovery |
| **Gateway** | Spring Cloud Gateway | - | API Gateway |
| **ORM** | Spring Data JPA | - | Database access |
| **ORM** | Hibernate | - | JPA implementation |
| **Database** | MySQL | 8.0 | Relational database |
| **Code Generation** | Lombok | - | Boilerplate reduction |
| **Mapping** | MapStruct | - | Entity-DTO mapping |
| **Documentation** | Swagger/OpenAPI | 2.3.0 | API documentation |
| **Build Tool** | Maven | 3.6+ | Dependency management |

### Frontend Stack

| Category | Technology | Version | Description |
|----------|-----------|---------|-------------|
| **Library** | React | 18 | UI library |
| **Language** | TypeScript | 5 | Type-safe JavaScript |
| **UI Framework** | Material-UI | 7 | Component library |
| **State Management** | Redux Toolkit | 2 | Predictable state container |
| **Routing** | React Router | 7 | Declarative routing |
| **HTTP Client** | Axios | 1 | Promise-based HTTP client |
| **Build Tool** | React Scripts | 5.0.1 | Create React App |

---

## 🏗️ Architecture

### Microservices Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Client (Browser)                         │
│                    React + TypeScript                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              API Gateway (Port 8080)                          │
│    • Routing • Load Balancing • CORS • Authentication        │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│        Eureka Discovery Server (Port 8761)                    │
│         Service Registry & Discovery • Health Check          │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Inventory   │  │    Order     │  │   Payment    │  │     User     │
│   Service    │  │   Service    │  │   Service    │  │   Service    │
│   (8084)     │  │   (8083)     │  │   (8085)     │  │   (8086)     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  MySQL DB    │  │   MySQL DB   │  │   MySQL DB   │  │   MySQL DB   │
│  Inventory   │  │    Order     │  │   Payment    │  │     User     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### Generic Structure - Common Library

All microservices use a shared `common-library`:

```
common-library/
├── entity/
│   └── BaseEntity.java              # Generic base entity (audit fields)
├── repository/
│   ├── GenericRepository.java       # Generic repository interface
│   └── GenericRepositoryImpl.java   # Generic repository implementation
├── service/
│   ├── GenericService.java          # Generic service interface
│   └── GenericServiceImpl.java      # Generic service implementation
├── controller/
│   └── GenericController.java       # Generic REST controller
├── mapper/
│   ├── BaseMapper.java              # Base mapper interface
│   └── GenericMapper.java           # Generic mapper implementation
├── dto/
│   ├── BaseDTO.java                 # Base DTO class
│   ├── PageableDTO.java             # Pagination DTO
│   └── FilterDTO.java               # Filter DTO
├── response/
│   ├── ApiResponse.java             # Standard API response
│   ├── PagedResponse.java           # Paginated response
│   └── ErrorResponse.java           # Error response
├── exception/
│   ├── GlobalExceptionHandler.java  # Global exception handler
│   ├── BusinessException.java       # Business exception
│   ├── ResourceNotFoundException.java
│   └── ValidationException.java
├── specification/
│   └── SpecificationBuilder.java    # Dynamic query builder
├── validation/
│   ├── ValidEmail.java              # Email validator
│   ├── ValidPhone.java              # Phone validator
│   └── ...
└── util/
    ├── CommonUtils.java             # Common utilities
    └── PageUtils.java               # Pagination utilities
```

### DDD Layers

Each microservice has the following layered structure:

```
service-name/
├── domain/                          # Domain Layer (Business Logic)
│   ├── entity/                      # Domain entities
│   │   └── EntityName.java
│   └── repository/                  # Repository interfaces
│       └── EntityRepository.java
│
├── application/                     # Application Layer (Use Cases)
│   ├── dto/                         # Data Transfer Objects
│   │   ├── EntityDTO.java
│   │   └── EntityRequestDTO.java
│   ├── service/                     # Service interfaces & implementations
│   │   ├── EntityService.java
│   │   └── EntityServiceImpl.java
│   └── mapper/                      # Entity-DTO mappers
│       └── EntityMapper.java
│
├── infrastructure/                  # Infrastructure Layer (Technical)
│   └── repository/                  # JPA repository implementations
│       └── EntityRepositoryImpl.java
│
└── presentation/                    # Presentation Layer (API)
    └── controller/                  # REST controllers
        └── EntityController.java
```

### Database Architecture

**Database per Service Pattern**: Each microservice has its own database

| Service | Database | Description |
|---------|----------|-------------|
| Inventory Service | `inventory_service_db` | Product and stock data |
| Order Service | `order_service_db` | Order and order item data |
| Payment Service | `payment_service_db` | Payment transaction data |
| User Service | `user_service_db` | User and authentication data |

**Features:**
- Each service has its own database
- Services communicate via APIs, no direct database access
- Database independence
- Scalability

---

## 📦 Installation

### Prerequisites

The following software must be installed on your system:

- ☕ **Java 17** or higher
- 📦 **Maven 3.6+**
- 🗄️ **MySQL 8.0**
- 📱 **Node.js 18+** and npm
- 🔧 **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/unknown1fsh/enterprise-application-suite.git
cd enterprise-application-suite
```

### Step 2: Setup Database

#### Windows

```bash
setup-databases.bat
```

#### Linux/Mac

```bash
chmod +x setup-databases.sh
./setup-databases.sh
```

#### Manual Setup

```bash
mysql -u root -p12345 < database-setup.sql
```

This creates the following databases:
- `inventory_service_db`
- `order_service_db`
- `payment_service_db`
- `user_service_db`

**Note:** If your MySQL password is different, edit `database-setup.sql` or run it manually.

### Step 3: Build Common Library

The common library must be built first as other services depend on it:

```bash
cd common-library
mvn clean install
cd ..
```

### Step 4: Build All Services

```bash
mvn clean install
```

This command builds all microservices and their dependencies.

### Step 5: Start Services

**IMPORTANT**: Start services in the following order!

#### 1. Discovery Server (Port 8761)

Start the Discovery Server first:

```bash
cd discovery-server
mvn spring-boot:run
```

✅ When successful: Open http://localhost:8761 in your browser and check the Eureka Dashboard.

#### 2. API Gateway (Port 8080)

Open a new terminal:

```bash
cd api-gateway
mvn spring-boot:run
```

#### 3. Microservices

Open a new terminal for each service:

**Inventory Service (Port 8084):**
```bash
cd inventory-management-service
mvn spring-boot:run
```

**Order Service (Port 8083):**
```bash
cd order-processing-service
mvn spring-boot:run
```

**Payment Service (Port 8085):**
```bash
cd payment-management-service
mvn spring-boot:run
```

**User Service (Port 8086):**
```bash
cd user-management-service
mvn spring-boot:run
```

### Step 6: Check Service Status

To verify all services have started successfully:

1. **Eureka Dashboard**: http://localhost:8761
   - You should see all services in "UP" status

2. **Health Check** (optional):
```bash
curl http://localhost:8084/inventory/products/health
curl http://localhost:8083/order/orders/health
curl http://localhost:8085/payment/payments/health
curl http://localhost:8086/user/users/health
```

### Step 7: Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will automatically open at http://localhost:3000.

---

## 🚀 Usage

### Service URLs

| Service | Direct URL | Via Gateway | Description |
|---------|-----------|-------------|-------------|
| **Discovery Server** | http://localhost:8761 | - | Eureka Dashboard |
| **API Gateway** | http://localhost:8080 | - | Entry point for all APIs |
| **Inventory Service** | http://localhost:8084 | http://localhost:8080/inventory | Product management |
| **Order Service** | http://localhost:8083 | http://localhost:8080/order | Order management |
| **Payment Service** | http://localhost:8085 | http://localhost:8080/payment | Payment processing |
| **User Service** | http://localhost:8086 | http://localhost:8080/user | User management |
| **Frontend** | http://localhost:3000 | - | React application |

### Eureka Dashboard

To view the status of all services:
- **URL**: http://localhost:8761
- View all registered services
- Check service health statuses

### Frontend Usage

1. **Dashboard**: http://localhost:3000
   - View real-time status of all services
   - Monitor health check results

2. **Products Page**:
   - Add products
   - List products
   - Edit products
   - Delete products

3. **Orders Page**:
   - View orders
   - Track order status

### API Examples

#### 1. Create Product

```bash
curl -X POST http://localhost:8080/inventory/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 9999.99,
    "stockQuantity": 10,
    "category": "Electronics",
    "sku": "LAP-001"
  }'
```

#### 2. List Products

```bash
curl http://localhost:8080/inventory/products
```

#### 3. User Registration

```bash
curl -X POST http://localhost:8080/user/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "username",
    "email": "email@example.com",
    "password": "password123",
    "firstName": "First",
    "lastName": "Last"
  }'
```

#### 4. User Login

```bash
curl -X POST http://localhost:8080/user/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "username",
    "password": "password123"
  }'
```

#### 5. Create Order

```bash
curl -X POST http://localhost:8080/order/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 9999.99
      }
    ]
  }'
```

---

## 📚 API Documentation

Swagger UI documentation is available for each service. In Swagger UI, you can view all endpoints, test APIs, and examine request/response examples.

| Service | Swagger UI URL |
|---------|----------------|
| **Inventory Service** | http://localhost:8084/swagger-ui.html |
| **Order Service** | http://localhost:8083/swagger-ui.html |
| **Payment Service** | http://localhost:8085/swagger-ui.html |
| **User Service** | http://localhost:8086/swagger-ui.html |

### Swagger UI Features

- ✅ View all endpoints
- ✅ Examine request/response schemas
- ✅ Test APIs directly
- ✅ View model definitions
- ✅ Authentication support (JWT ready)

---

## 📁 Project Structure

```
enterprise-application-suite/
│
├── api-gateway/                    # API Gateway Service
│   └── src/main/java/com/ecommerce/api_gateway/
│
├── discovery-server/               # Eureka Discovery Server
│   └── src/main/java/com/ecommerce/discovery_server/
│
├── common-library/                 # Shared Common Library
│   └── src/main/java/com/ecommerce/common/
│       ├── entity/
│       ├── repository/
│       ├── service/
│       ├── controller/
│       ├── mapper/
│       ├── dto/
│       ├── response/
│       ├── exception/
│       └── util/
│
├── inventory-management-service/   # Inventory Microservice
│   └── src/main/java/com/ecommerce/inventory_service/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
│
├── order-processing-service/       # Order Microservice
│   └── src/main/java/com/ecommerce/order_service/
│
├── payment-management-service/     # Payment Microservice
│   └── src/main/java/com/ecommerce/payment_service/
│
├── user-management-service/        # User Microservice
│   └── src/main/java/com/ecommerce/user_service/
│
├── frontend/                       # React Frontend Application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
│
├── database-setup.sql              # Database setup script
├── setup-databases.sh              # Database setup (Linux/Mac)
├── setup-databases.bat             # Database setup (Windows)
├── ARCHITECTURE.md                 # Detailed architecture docs
├── SETUP.md                        # Detailed setup guide
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT License
└── README.md                       # This file
```

---

## 🤝 Contributing

We welcome your contributions! To help improve this project:

1. ⭐ Star the project
2. 🍴 Fork the project
3. 🌿 Create a new branch (`git checkout -b feature/amazing-feature`)
4. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
5. 📤 Push to the branch (`git push origin feature/amazing-feature`)
6. 🔄 Open a Pull Request

### Contribution Guidelines

- ✅ Follow code standards (Google Java Style Guide)
- ✅ Write tests for new features
- ✅ Update documentation
- ✅ Use descriptive commit messages
- ✅ Explain your changes in detail in Pull Requests

For more details, see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👥 Author

**unknown1fsh**

- GitHub: [@unknown1fsh](https://github.com/unknown1fsh)

---

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- Netflix for Eureka service discovery
- Material-UI team for React component library
- All open source communities and contributors

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/unknown1fsh/enterprise-application-suite?style=social)
![GitHub forks](https://img.shields.io/github/forks/unknown1fsh/enterprise-application-suite?style=social)
![GitHub issues](https://img.shields.io/github/issues/unknown1fsh/enterprise-application-suite)
![GitHub pull requests](https://img.shields.io/github/issues-pr/unknown1fsh/enterprise-application-suite)
![GitHub license](https://img.shields.io/github/license/unknown1fsh/enterprise-application-suite)

---

<div align="center">

**⭐ If you liked this project, don't forget to star it! ⭐**

Made with ❤️ by [unknown1fsh](https://github.com/unknown1fsh)

</div>
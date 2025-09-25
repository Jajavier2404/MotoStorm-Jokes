# 🏍️ MotoStorm-Jokes - Documentación de Arquitectura

## 📋 Tabla de Contenido

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Base de Datos - Servicio Reloj](#base-de-datos---servicio-reloj)
4. [Componentes de Microservicios](#componentes-de-microservicios)
   - [Servicio Reloj (Tienda)](#servicio-reloj-tienda)
   - [Servicio Chistes](#servicio-chistes)
   - [Servicio Clima](#servicio-clima)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [APIs y Servicios Externos](#apis-y-servicios-externos)

---

## 🎯 Resumen Ejecutivo

MotoStorm-Jokes es una aplicación web moderna construida con arquitectura de microservicios que combina entretenimiento y funcionalidad. La plataforma ofrece una experiencia integral que incluye:

- **🎭 Sistema de Chistes**: Integración con Chuck Norris API para contenido humorístico
- **🌤️ Información Meteorológica**: Datos climáticos en tiempo real
- **🛍️ Tienda de Relojes**: Sistema completo de e-commerce con autenticación y gestión de compras

---

## 🏗️ Arquitectura del Sistema

La arquitectura sigue el patrón de microservicios con separación clara de responsabilidades:

```mermaid
graph TD
    subgraph "🎨 Frontend Layer"
        A[React + Vite Application<br/>Puerto: 3000]
    end
    
    subgraph "🔧 API Gateway / Load Balancer"
        LB[Nginx / Traefik<br/>Puerto: 80/443]
    end
    
    subgraph "⚙️ Backend Microservices"
        B1[🎭 Servicio Chistes<br/>Puerto: 8001]
        B2[🌤️ Servicio Clima<br/>Puerto: 8002]
        B3[🛍️ Servicio Reloj<br/>Puerto: 8003]
    end
    
    subgraph "💾 Bases de Datos"
        D1[(PostgreSQL<br/>Puerto: 5432)]
        D2[(Redis Cache<br/>Puerto: 6379)]
    end
    
    subgraph "🌐 APIs Externas"
        E1[Chuck Norris API<br/>api.chucknorris.io]
        E2[OpenWeatherMap API<br/>api.openweathermap.org]
    end
    
    A --> LB
    LB --> B1
    LB --> B2
    LB --> B3
    
    B1 -.->|Cache| D2
    B1 --> E1
    B2 -.->|Cache| D2
    B2 --> E2
    B3 --> D1
    B3 -.->|Sesiones| D2
    
    style A fill:#e1f5fe
    style B1 fill:#f3e5f5
    style B2 fill:#e8f5e8
    style B3 fill:#fff3e0
    style D1 fill:#fce4ec
    style D2 fill:#f1f8e9
```

---

## 🗄️ Base de Datos - Servicio Reloj

### Diagrama Entidad-Relación

```mermaid
erDiagram
    USERS {
        serial id PK "Primary Key"
        varchar email UK "Unique, Not Null"
        varchar password_hash "BCrypt Hash"
        varchar first_name "Not Null"
        varchar last_name "Not Null"
        timestamp created_at "Default NOW()"
        timestamp updated_at "Default NOW()"
        boolean is_active "Default true"
    }
    
    PRODUCTS {
        serial id PK "Primary Key"
        varchar name "Not Null"
        text description "Product Description"
        decimal price "Not Null, Check > 0"
        varchar image_url "Product Image"
        integer stock "Default 0"
        varchar category "Watch Category"
        varchar brand "Watch Brand"
        boolean is_featured "Default false"
        timestamp created_at "Default NOW()"
        timestamp updated_at "Default NOW()"
    }
    
    PURCHASES {
        serial id PK "Primary Key"
        integer user_id FK "References USERS(id)"
        decimal total_amount "Not Null"
        varchar status "pending/completed/cancelled"
        varchar payment_method "credit_card/paypal/etc"
        text shipping_address "JSON Format"
        timestamp purchase_date "Default NOW()"
        timestamp shipped_date "Nullable"
        varchar tracking_number "Nullable"
    }
    
    PURCHASE_ITEMS {
        serial id PK "Primary Key"
        integer purchase_id FK "References PURCHASES(id)"
        integer product_id FK "References PRODUCTS(id)"
        integer quantity "Not Null, Check > 0"
        decimal unit_price "Price at time of purchase"
        decimal total_price "quantity * unit_price"
        timestamp created_at "Default NOW()"
    }
    
    USERS ||--o{ PURCHASES : "realiza"
    PRODUCTS ||--o{ PURCHASE_ITEMS : "se_incluye_en"
    PURCHASES ||--o{ PURCHASE_ITEMS : "contiene"
```

### Índices Recomendados

```sql
-- Índices para optimización de consultas
CREATE INDEX idx_users_email ON USERS(email);
CREATE INDEX idx_products_category ON PRODUCTS(category);
CREATE INDEX idx_products_price ON PRODUCTS(price);
CREATE INDEX idx_purchases_user_id ON PURCHASES(user_id);
CREATE INDEX idx_purchases_date ON PURCHASES(purchase_date);
CREATE INDEX idx_purchase_items_purchase_id ON PURCHASE_ITEMS(purchase_id);
CREATE INDEX idx_purchase_items_product_id ON PURCHASE_ITEMS(product_id);
```

---

## 🔧 Componentes de Microservicios

### 🛍️ Servicio Reloj (Tienda)

```mermaid
graph TB
    subgraph "🛍️ Servicio Reloj - Arquitectura Interna"
        
        subgraph "🌐 HTTP Layer"
            R1[main.go<br/>Router & Server Setup]
        end
        
        subgraph "🎯 Handlers Layer"
            RH1[auth_handler.go<br/>Login, Register, Logout]
            RH2[product_handler.go<br/>CRUD Productos]
            RH3[purchase_handler.go<br/>Gestión Compras]
            RH4[user_handler.go<br/>Perfil Usuario]
        end
        
        subgraph "🔒 Middleware Layer"
            RM1[auth_middleware.go<br/>JWT Validation]
            RM2[cors_middleware.go<br/>CORS Policy]
            RM3[rate_limiter.go<br/>API Rate Limiting]
            RM4[logging_middleware.go<br/>Request Logging]
        end
        
        subgraph "⚙️ Services Layer"
            RS1[database.go<br/>DB Connection Pool]
            RS2[product_service.go<br/>Business Logic Productos]
            RS3[purchase_service.go<br/>Business Logic Compras]
            RS4[user_service.go<br/>Business Logic Usuarios]
            RS5[auth_service.go<br/>JWT & Password Utils]
            RS6[email_service.go<br/>Email Notifications]
        end
        
        subgraph "📊 Models Layer"
            RMd1[product.go<br/>Product Struct & Validations]
            RMd2[purchase.go<br/>Purchase & PurchaseItem Structs]
            RMd3[user.go<br/>User Struct & Methods]
            RMd4[response.go<br/>API Response Structs]
        end
        
        subgraph "🗄️ Repository Layer"
            RR1[product_repository.go<br/>Product DB Operations]
            RR2[purchase_repository.go<br/>Purchase DB Operations]
            RR3[user_repository.go<br/>User DB Operations]
        end
    end
    
    subgraph "💾 External Dependencies"
        D1[(PostgreSQL Database)]
        D2[(Redis Cache)]
        D3[📧 SMTP Server]
    end
    
    R1 --> RH1
    R1 --> RH2
    R1 --> RH3
    R1 --> RH4
    R1 --> RM1
    R1 --> RM2
    R1 --> RM3
    R1 --> RM4
    
    RH1 --> RS4
    RH1 --> RS5
    RH2 --> RS2
    RH3 --> RS3
    RH4 --> RS4
    
    RM1 --> RS5
    
    RS2 --> RR1
    RS3 --> RR2
    RS4 --> RR3
    RS6 --> D3
    
    RR1 --> D1
    RR2 --> D1
    RR3 --> D1
    
    RS2 -.->|Cache| D2
    RS3 -.->|Cache| D2
    RS4 -.->|Sessions| D2
    
    RMd1 -.-> RS2
    RMd2 -.-> RS3
    RMd3 -.-> RS4
    RMd4 -.-> RH1
    RMd4 -.-> RH2
    RMd4 -.-> RH3
    RMd4 -.-> RH4
```

### 🎭 Servicio Chistes

```mermaid
graph TB
    subgraph "🎭 Servicio Chistes - Arquitectura Interna"
        
        subgraph "🌐 HTTP Layer"
            C1[main.go<br/>Gin Router Setup]
        end
        
        subgraph "🎯 Handlers Layer"
            CH1[jokes_handler.go<br/>GET /jokes<br/>GET /jokes/random<br/>GET /jokes/categories]
        end
        
        subgraph "🔒 Middleware Layer"
            CM1[cors_middleware.go<br/>CORS Headers]
            CM2[rate_limiter.go<br/>Rate Limiting]
            CM3[cache_middleware.go<br/>Response Caching]
        end
        
        subgraph "⚙️ Services Layer"
            CS1[jokes_service.go<br/>Business Logic<br/>Cache Management<br/>Error Handling]
            CS2[http_client.go<br/>HTTP Client Wrapper<br/>Retry Logic<br/>Timeout Handling]
        end
        
        subgraph "📊 Models Layer"
            CMd1[joke.go<br/>Joke Struct<br/>Category Enum<br/>Validation Rules]
            CMd2[api_response.go<br/>Chuck Norris API Response<br/>Error Response Structs]
        end
    end
    
    subgraph "🌐 External Dependencies"
        E1[Chuck Norris API<br/>api.chucknorris.io]
        D2[(Redis Cache<br/>TTL: 1 hora)]
    end
    
    C1 --> CH1
    C1 --> CM1
    C1 --> CM2
    C1 --> CM3
    
    CH1 --> CS1
    CS1 --> CS2
    CS2 --> E1
    
    CS1 -.->|Cache Hit/Miss| D2
    
    CMd1 -.-> CS1
    CMd2 -.-> CS2
    
    style E1 fill:#ffecb3
    style D2 fill:#f1f8e9
```

### 🌤️ Servicio Clima

```mermaid
graph TB
    subgraph "🌤️ Servicio Clima - Arquitectura Interna"
        
        subgraph "🌐 HTTP Layer"
            CL1[main.go<br/>Echo Framework Setup]
        end
        
        subgraph "🎯 Handlers Layer"
            CLH1[weather_handler.go<br/>GET /weather/current<br/>GET /weather/forecast<br/>GET /weather/cities]
        end
        
        subgraph "🔒 Middleware Layer"
            CLM1[cors_middleware.go<br/>CORS Configuration]
            CLM2[rate_limiter.go<br/>IP-based Rate Limiting]
            CLM3[api_key_middleware.go<br/>API Key Validation]
        end
        
        subgraph "⚙️ Services Layer"
            CLS1[weather_service.go<br/>Weather Data Processing<br/>Unit Conversions<br/>Cache Management]
            CLS2[geolocation_service.go<br/>City/Coordinate Resolution]
            CLS3[http_client.go<br/>OpenWeatherMap Client<br/>Request/Response Handling]
        end
        
        subgraph "📊 Models Layer"
            CLMd1[weather.go<br/>Current Weather Struct<br/>Forecast Struct<br/>Temperature Units]
            CLMd2[location.go<br/>City, Coordinates<br/>Timezone Information]
            CLMd3[api_models.go<br/>OpenWeatherMap API<br/>Response Structures]
        end
    end
    
    subgraph "🌐 External Dependencies"
        E2[OpenWeatherMap API<br/>api.openweathermap.org]
        D2[(Redis Cache<br/>TTL: 10 minutos)]
        GEO[IP Geolocation<br/>ipapi.co]
    end
    
    CL1 --> CLH1
    CL1 --> CLM1
    CL1 --> CLM2
    CL1 --> CLM3
    
    CLH1 --> CLS1
    CLH1 --> CLS2
    CLS1 --> CLS3
    CLS2 --> GEO
    CLS3 --> E2
    
    CLS1 -.->|Weather Cache| D2
    CLS2 -.->|Location Cache| D2
    
    CLMd1 -.-> CLS1
    CLMd2 -.-> CLS2
    CLMd3 -.-> CLS3
    
    style E2 fill:#e3f2fd
    style GEO fill:#fff3e0
    style D2 fill:#f1f8e9
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI con hooks modernos
- **Vite** - Build tool y dev server ultrarrápido
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router** - Navegación del lado del cliente
- **Axios** - Cliente HTTP para llamadas a APIs

### Backend
- **Go 1.21+** - Lenguaje de programación principal
- **Gin/Echo** - Frameworks web HTTP para Go
- **GORM** - ORM para Go con soporte PostgreSQL
- **JWT-Go** - JSON Web Tokens para autenticación
- **bcrypt** - Hashing de contraseñas
- **go-redis** - Cliente Redis para Go

### Base de Datos y Cache
- **PostgreSQL 14+** - Base de datos relacional principal
- **Redis 7** - Cache en memoria y gestión de sesiones

### DevOps y Deployment
- **Docker** - Containerización de servicios
- **Docker Compose** - Orquestación de contenedores
- **Nginx** - Proxy reverso y load balancer
- **GitHub Actions** - CI/CD pipeline

---

## 🌐 APIs y Servicios Externos

### Chuck Norris API
- **URL Base**: `https://api.chucknorris.io/jokes/`
- **Endpoints Utilizados**:
  - `GET /random` - Chiste aleatorio
  - `GET /categories` - Lista de categorías
  - `GET /random?category={category}` - Chiste por categoría
- **Rate Limit**: Sin límites documentados
- **Autenticación**: No requerida

### OpenWeatherMap API
- **URL Base**: `https://api.openweathermap.org/data/2.5/`
- **Endpoints Utilizados**:
  - `GET /weather` - Clima actual
  - `GET /forecast` - Pronóstico 5 días
  - `GET /geocoding/direct` - Geocodificación
- **Rate Limit**: 60 llamadas/minuto (plan gratuito)
- **Autenticación**: API Key requerida

### Consideraciones de Seguridad
- **API Keys** almacenadas en variables de entorno
- **Rate Limiting** implementado en todos los servicios
- **HTTPS** obligatorio en producción
- **CORS** configurado restrictivamente
- **JWT Tokens** con expiración corta (15 minutos)
- **Refresh Tokens** para renovación automática

---

## 📈 Métricas y Monitoreo

### Health Checks
Cada servicio expone un endpoint `/health` que verifica:
- Conectividad a base de datos
- Disponibilidad de APIs externas
- Estado de cache Redis
- Uso de memoria y CPU

### Logging
- **Formato**: JSON estructurado
- **Niveles**: ERROR, WARN, INFO, DEBUG
- **Correlación**: Request ID para trazabilidad
- **Agregación**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

*Última actualización: Septiembre 2025*
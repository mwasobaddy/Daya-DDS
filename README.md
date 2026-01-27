# Daya Digital Distribution System (DDS)

## Overview

The Digital Distribution Service (DDS) is a cloud-native platform connecting Clients, Digital Content Distributors (DCDs), and Digital Ambassadors (DAs) under a community-led distribution model. It enables targeted digital content distribution through unique QR codes and integrates with the Digital Wallet Service (DWS) for seamless payouts.

## System Architecture

### Core Components

#### User Roles
- **Clients**: Businesses that create and fund digital content campaigns
- **Digital Content Distributors (DCDs)**: Physical locations that display QR codes for content distribution
- **Digital Ambassadors (DAs)**: Community members who promote and distribute content
- **Administrators**: System administrators who manage the platform

#### Key Workflows

1. **Campaign Creation**: Clients create targeted campaigns with specific budgets and objectives
2. **Content Distribution**: DCDs display QR codes at their physical locations
3. **Community Engagement**: DAs promote campaigns and earn referral rewards
4. **Scan Tracking**: System tracks QR code scans and engagement metrics
5. **Reward Distribution**: Automated token rewards for successful distributions

## Technical Stack

### Backend
- **Framework**: Laravel 12.x
- **Language**: PHP 8.4+
- **Database**: MySQL/PostgreSQL with Eloquent ORM
- **Authentication**: Laravel Fortify with 2FA support
- **API**: RESTful API with JSON responses
- **Queue System**: Laravel Queues for background processing
- **Notifications**: Laravel Notifications with email and database channels

### Frontend
- **Framework**: React 19.x with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Hooks with Inertia.js
- **UI Components**: Radix UI primitives
- **Routing**: Laravel Wayfinder for type-safe routing
- **Forms**: Inertia.js form handling with validation

### Infrastructure
- **Server**: Laravel application server
- **Database**: Relational database for data persistence
- **Queue**: Background job processing
- **Mail**: Email delivery service
- **File Storage**: Local/cloud storage for assets

## Features

### Campaign Management
- **Campaign Creation**: Clients can create targeted campaigns with specific parameters
- **Budget Allocation**: Credit-based system for campaign funding
- **Geographic Targeting**: Location-based campaign targeting (Country, County, Subcounty, Ward)
- **Content Types**: Support for various digital content formats
- **Performance Tracking**: Real-time campaign analytics and ROI metrics

### Digital Content Distribution
- **QR Code Generation**: Unique QR codes for each campaign and location
- **Location Management**: Physical location registration and management
- **Scan Tracking**: Real-time tracking of QR code scans and user engagement
- **Device Fingerprinting**: Unique device identification for accurate metrics

### Digital Ambassador Program
- **Referral System**: Multi-level referral rewards with token incentives
- **Community Building**: Social platform integration for DA networking
- **Performance Rewards**: Automated reward distribution based on engagement
- **Wallet Integration**: Seamless integration with DWS for token management

### Token Economy
- **DDS Tokens**: Primary reward tokens for distribution activities
- **DWS Tokens**: Secondary tokens for wallet and payment services
- **Automated Rewards**: Smart contract-based reward distribution
- **Balance Tracking**: Real-time balance monitoring and transaction history

### Administrative Features
- **User Management**: Comprehensive user role and permission management
- **Campaign Oversight**: Administrative review and approval workflows
- **Analytics Dashboard**: System-wide performance metrics and insights
- **Notification Management**: Centralized notification and communication system

## Database Schema

### Core Tables

#### Users Table
- **Purpose**: Central user management for all system roles
- **Key Fields**:
  - Basic authentication (email, password)
  - Role-based access (admin, da, dcd, client)
  - Profile information (name, phone, national_id, dob, gender)
  - Geographic location (country, county, subcounty, ward)
  - Wallet information (type, status, pin, balance)
  - Token balances (total_DDS_balance, total_DWS_balance)
  - Referral system (referral_code)

#### Campaigns Table
- **Purpose**: Campaign definition and management
- **Key Fields**:
  - Campaign metadata (name, type, objectives)
  - Budget and credit allocation
  - Geographic targeting
  - Content links and media
  - Performance tracking (credits used, scans)

#### Digital Ambassadors (DA) Table
- **Purpose**: DA-specific profile and preference management
- **Key Fields**:
  - Social platform integrations
  - Preferred contact methods
  - Performance metrics

#### Digital Content Distributors (DCD) Table
- **Purpose**: Physical location and business management
- **Key Fields**:
  - Business information and operating hours
  - Location and accessibility details
  - Campaign preferences and capabilities

#### Scans Table
- **Purpose**: QR code scan tracking and analytics
- **Key Fields**:
  - Device identification and geolocation
  - Timestamp and engagement metrics
  - Campaign and location association

#### Earnings Table
- **Purpose**: Reward distribution and payment tracking
- **Key Fields**:
  - Credit earnings and payment status
  - Transaction history and audit trail
  - Performance-based reward calculations

#### Venture Shares Table
- **Purpose**: Token reward transaction history
- **Key Fields**:
  - DDS and DWS token earnings
  - Reward reasons and categories
  - User balance tracking

### Geographic Tables
- **Countries, Counties, Subcounties, Wards**: Hierarchical geographic targeting system

## API Endpoints

### Public Endpoints

#### DA Registration
- `GET /da` - DA program information and landing page
- `GET /da/register` - DA registration form
- `POST /da/register` - Process DA registration with referral logic

#### Location Services
- `GET /api/locations/countries` - List available countries
- `GET /api/locations/counties?country_id={id}` - List counties by country
- `GET /api/locations/subcounties?county_id={id}` - List subcounties by county
- `GET /api/locations/wards?subcounty_id={id}` - List wards by subcounty

### Authenticated Endpoints

#### Dashboard
- `GET /dashboard` - User dashboard with role-specific content

#### Settings
- `GET /settings/profile` - User profile management
- `PATCH /settings/profile` - Update user profile
- `GET /settings/password` - Password change form
- `PUT /settings/password` - Update password
- `GET /settings/two-factor` - Two-factor authentication setup

## Business Logic

### Referral System
- **Optional Referrals**: Users can register with or without referral codes
- **Validation**: Referral codes must exist in the system when provided
- **Auto-Assignment**: System assigns admin with least tokens when no referral provided
- **Reward Distribution**: 200 DDS + 200 DWS tokens for successful referrals
- **Cap Management**: Token rewards only distributed when DA count < 3000

### Token Economy Rules
- **DA Cap**: System stops token rewards after 3000 DAs are registered
- **Admin Selection**: Automatic assignment to admin with lowest combined token balance
- **Reward Tracking**: All token transactions recorded in venture_shares table
- **Balance Updates**: Real-time balance updates for all token operations

### Notification System
- **Referral Rewards**: Email and database notifications for token earnings
- **Account Setup**: Welcome emails for new DA registrations
- **Wallet Creation**: Security-focused wallet setup notifications
- **Admin Alerts**: System notifications for all new registrations

## Installation & Setup

### Prerequisites
- PHP 8.4+
- Node.js 18+
- Composer
- MySQL/PostgreSQL database
- Redis (for queues, optional)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd daya-dds
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Start Development Server**
   ```bash
   composer run dev
   ```

### Development Workflow

#### Available Commands
- `composer run dev` - Start development servers (Laravel + Vite)
- `npm run dev` - Start Vite development server only
- `npm run build` - Build production assets
- `php artisan test` - Run test suite
- `composer run lint` - Run code linting

#### Code Quality
- **PHP**: Laravel Pint for code formatting
- **JavaScript/TypeScript**: ESLint + Prettier for code quality
- **Testing**: Pest PHP testing framework

## Security Features

### Authentication & Authorization
- **Multi-Factor Authentication**: 2FA support for enhanced security
- **Role-Based Access Control**: Granular permissions for different user types
- **Secure Password Policies**: Enforced password complexity requirements

### Data Protection
- **Encrypted Storage**: Sensitive data encryption at rest
- **Secure Communications**: HTTPS-only communication channels
- **Input Validation**: Comprehensive input sanitization and validation
- **CSRF Protection**: Cross-site request forgery prevention

### Wallet Security
- **PIN-Based Access**: Secure wallet access with PIN authentication
- **Transaction Logging**: Complete audit trail for all token transactions
- **Balance Verification**: Real-time balance validation and fraud detection

## Performance & Scalability

### Optimization Features
- **Database Indexing**: Optimized queries with proper indexing
- **Caching Strategy**: Redis-based caching for frequently accessed data
- **Queue Processing**: Background job processing for heavy operations
- **Asset Optimization**: Minified and compressed frontend assets

### Monitoring & Analytics
- **Performance Metrics**: Real-time system performance monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **User Analytics**: Engagement and conversion tracking
- **Campaign Analytics**: ROI and performance measurement

## Deployment

### Production Requirements
- **Web Server**: Nginx or Apache with PHP-FPM
- **Database**: Production-grade database server
- **Queue Worker**: Supervised queue processing
- **SSL Certificate**: Valid SSL certificate for HTTPS
- **Backup System**: Automated database and file backups

### Environment Configuration
- **Production ENV**: Secure environment variable configuration
- **Database Optimization**: Connection pooling and query optimization
- **Caching**: Redis or Memcached for session and data caching
- **CDN**: Content delivery network for static assets

## Contributing

### Development Guidelines
- **Code Standards**: PSR-12 for PHP, Airbnb for JavaScript
- **Testing**: 100% test coverage for critical business logic
- **Documentation**: Comprehensive inline documentation
- **Version Control**: Git flow with feature branches

### Code Review Process
- **Pull Request Template**: Standardized PR format
- **Automated Testing**: CI/CD pipeline with automated tests
- **Security Review**: Security-focused code review checklist
- **Performance Review**: Performance impact assessment

## Support & Maintenance

### System Monitoring
- **Health Checks**: Automated system health monitoring
- **Alert System**: Real-time alerting for system issues
- **Log Management**: Centralized logging and log analysis
- **Performance Monitoring**: Application performance tracking

### Backup & Recovery
- **Automated Backups**: Daily database and file system backups
- **Disaster Recovery**: Comprehensive disaster recovery plan
- **Data Retention**: Configurable data retention policies
- **Recovery Testing**: Regular recovery procedure testing

## Future Roadmap

### Planned Features
- **Mobile Application**: Native mobile apps for iOS and Android
- **Advanced Analytics**: Machine learning-powered insights
- **Multi-Currency Support**: Support for multiple fiat currencies
- **API Marketplace**: Third-party integration marketplace
- **Advanced Targeting**: AI-powered audience targeting

### Technology Upgrades
- **Microservices Architecture**: Service-oriented architecture migration
- **GraphQL API**: Enhanced API capabilities with GraphQL
- **Real-time Features**: WebSocket-based real-time updates
- **Blockchain Integration**: Enhanced token security and transparency

---

## License

This project is proprietary software. All rights reserved.

## Contact Information

For technical support or inquiries, please contact the development team.</content>
<parameter name="filePath">/Users/app/Desktop/Laravel/Daya-DDS/README.md
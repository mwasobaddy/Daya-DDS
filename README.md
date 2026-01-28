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

### Digital Content Distributor (DCD) Program
- **Business Registration**: Comprehensive business profile setup for physical locations
- **QR Code Distribution**: Automated QR code generation and PDF guide creation
- **Content Preferences**: Campaign type and audience targeting preferences
- **Operating Hours**: Flexible scheduling for content distribution availability
- **Foot Traffic Analytics**: Business location performance metrics
- **Token Rewards**: Automated earnings from successful content distribution
- **Referral System**: Multi-level referral rewards for DCD network expansion

### Digital Ambassador Program
- **Referral System**: Multi-level referral rewards with token incentives
- **Social Platform Integration**: Instagram, X/Twitter, Facebook, TikTok, LinkedIn, WhatsApp audience management
- **Community Building**: DA networking and performance tracking
- **Performance Rewards**: Automated reward distribution based on engagement
- **Wallet Integration**: Seamless integration with DWS for token management
- **Audience Reach Tracking**: Follower count and engagement metrics

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
- **Purpose**: DA-specific profile and social media platform management
- **Key Fields**:
  - Social platform integrations with audience reach metrics
  - Preferred contact method (WhatsApp, Telegram, Email, Phone)
  - User relationship (foreign key to users table)

#### Digital Content Distributors (DCD) Table
- **Purpose**: Physical location and business management for content distribution
- **Key Fields**:
  - Business information (name, address, type, operating hours)
  - Content preferences (campaign types, music preferences, safety preferences)
  - Performance metrics (foot traffic estimates)
  - Digital assets (QR code path, PDF guide path)
  - User relationship (foreign key to users table)

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

#### DCD Registration
- `GET /dcd` - DCD program information and landing page
- `GET /dcd/register` - Multi-step DCD registration form
- `POST /dcd/register` - Process DCD registration with complete workflow

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

## Frontend Components

### DCD Registration Flow

The DCD registration uses a sophisticated multi-step form built with React and TypeScript:

#### Landing Page (`/dcd`)
- **Hero Section**: Program introduction with explainer video
- **Benefits Overview**: Key advantages of becoming a DCD
- **Call-to-Action**: Prominent registration button
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### Multi-Step Registration Form (`/dcd/register`)
- **Step 1 - Account Setup**: Personal and contact information collection
- **Step 2 - Business Information**: Business details and operating hours
- **Step 3 - Content Preferences**: Campaign types and audience targeting
- **Step 4 - Wallet Setup**: PIN creation and terms acceptance
- **Step 5 - Review & Submit**: Form validation and final submission

#### Form Components
- **AccountSetupStep**: Personal information with location selection
- **BusinessInformationStep**: Business categorization with grouped type selection
- **ContentPreferenceStep**: Multi-select preferences with validation
- **WalletSetupStep**: Secure PIN creation with confirmation
- **ReviewSubmitStep**: Complete form review with real-time submission

#### Key Features
- **Real-time Validation**: Client-side validation with server-side confirmation
- **Progress Tracking**: Visual progress indicator through registration steps
- **Responsive Design**: Optimized for mobile and desktop devices
- **Error Handling**: Comprehensive error display and user feedback
- **Data Persistence**: Form state management across steps

### DA Registration Flow

The DA registration uses a streamlined 4-step form built with React and TypeScript:

#### Landing Page (`/da`)
- **Hero Section**: Program introduction with explainer video
- **Benefits Overview**: Key advantages of becoming a DA
- **Call-to-Action**: Prominent registration button
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### Multi-Step Registration Form (`/da/register`)
- **Step 1 - Account Setup**: Personal information and location collection
- **Step 2 - Social Media**: Platform selection with audience reach specification
- **Step 3 - Wallet Setup**: Contact preferences and PIN creation
- **Step 4 - Review & Submit**: Form validation and final submission

#### Form Components
- **AccountSetupStep**: Personal information with location selection
- **SocialMediaStep**: Multi-platform selection with audience categorization
- **WalletSetupStep**: Contact method and PIN creation with confirmation
- **ReviewSubmitStep**: Complete form review with validation

#### Key Features
- **Platform Flexibility**: Support for Instagram, X/Twitter, Facebook, TikTok, LinkedIn, WhatsApp
- **Audience Tracking**: Granular follower/following count categorization
- **Dynamic Validation**: Platform-specific audience size requirements
- **Contact Preferences**: Multiple communication channel options

### Referral System
- **Multi-Role Support**: Referrals work across all user roles (admin, DA, DCD)
- **Referral Types**: admin-to-DA, admin-to-DCD, DA-to-DA, DA-to-DCD, DCD-to-DA, DCD-to-DCD
- **Optional Referrals**: Users can register with or without referral codes
- **Validation**: Referral codes must exist in the system when provided
- **Auto-Assignment**: System assigns admin with least tokens when no referral provided
- **Reward Distribution**: 200 DDS + 200 DWS tokens for DA referrals, 500 DDS + 500 DWS tokens for DCD referrals
- **Cap Management**: Token rewards only distributed when total user count < 3000

### Token Economy Rules
- **DA Cap**: System stops token rewards after 3000 DAs are registered
- **DCD Cap**: System stops token rewards after 3000 DCDs are registered
- **Signup Bonuses**: 1000 DDS + 1000 DWS tokens for both DA and DCD registrations
- **Referral Rewards**: 
  - DA referrals: 200 DDS + 200 DWS tokens
  - DCD referrals: 500 DDS + 500 DWS tokens
- **Admin Selection**: Automatic assignment to admin with lowest combined token balance when no referral provided
- **Reward Tracking**: All token transactions recorded in venture_shares table
- **Balance Updates**: Real-time balance updates for all token operations

### Notification System
- **Welcome Emails**: Comprehensive onboarding emails for DA and DCD registrations
- **Token Notifications**: Real-time notifications for signup bonuses and referral rewards
- **PDF Attachments**: QR code guides automatically attached to DCD welcome emails
- **Referral Rewards**: Email notifications for successful referral earnings
- **Wallet Security**: PIN setup and security-focused notifications
- **Admin Alerts**: System notifications for all new user registrations
- **Business Onboarding**: DCD-specific guidance for content distribution setup
- **DA Onboarding**: Referral program guidance and network building tips

### Validation Rules

#### DCD Registration Validation
- **Age Verification**: Minimum 18 years old, maximum 100 years old
- **Unique Constraints**: Email, phone, and national ID must be unique
- **Location Requirements**: Country always required, sub-location fields required for Kenya/Nigeria
- **Business Validation**: Business name, type, and operating hours required
- **Content Preferences**: At least one campaign type and safety preference required
- **PIN Security**: 4-digit numeric PIN with confirmation
- **Terms Acceptance**: Mandatory terms and conditions agreement
- **Referral Validation**: Referral codes must exist when provided

#### DA Registration Validation
- **Age Verification**: Minimum 18 years old, maximum 100 years old
- **Unique Constraints**: Email, phone, and national ID must be unique
- **Location Requirements**: Country always required, sub-location fields required for Kenya/Nigeria
- **Social Platform Validation**: At least one platform must be selected with audience reach specified
- **Platform-Specific Rules**: Each platform has defined audience size categories
- **Contact Method**: Required selection from WhatsApp, Telegram, Email, or Phone
- **Wallet Type**: Required selection from Personal, Business, or Both
- **PIN Security**: 4-digit numeric PIN with confirmation

## DCD Workflow

### DCD Registration Process

The Digital Content Distributor (DCD) registration is a comprehensive 5-step process designed to onboard physical business locations for content distribution:

#### Step 1: Account Setup
- **Personal Information**: Full name, national ID, date of birth, gender
- **Contact Details**: Email address and phone number
- **Business Address**: Physical location address
- **Referral Code**: Optional referral code for bonus rewards
- **Location Selection**: Country, county, subcounty, and ward selection
- **Validation**: Comprehensive validation including age verification (18+), unique email/phone

#### Step 2: Business Information
- **Business Name**: Official business name registration
- **Business Type**: Multi-select from categorized options:
  - **Retail**: Kiosk/duka, mini supermarket, wholesale shop, hardware store, agrovet, butchery, boutique, electronics, stationery, general store
  - **Services**: Salon, barber shop, beauty parlour, tailor, Uber, shoe repair, photography studio, printing/cyber, laundry
  - **Food**: Cafe, restaurant, fast food, mama mboga, milk ATM, bakery
  - **Financial**: Mobile money, bank agent, bill payment, betting shop
  - **Transport**: Boda boda, matatu sacco, fuel station, car wash
  - **Community**: Church, school canteen
  - **Entertainment**: Bar/lounge
  - **Healthcare**: Pharmacy, clinic
  - **Other**: Custom business type specification
- **Operating Days**: Multi-select days of operation (Monday-Sunday)
- **Operating Hours**: Opening and closing times (24-hour format)
- **Foot Traffic Estimate**: Business volume categorization (1-10, 11-50, 51-100, 101-500, 500+ people)

#### Step 3: Content Preferences
- **Campaign Types**: Multi-select content categories:
  - Artwork, Music, Fashion, Food & Beverage, Health & Wellness, Technology, Education, Entertainment, Sports, News & Media, Religious, Political, Non-Profit, Other
- **Music Preferences**: Optional music genre preferences for audio content
- **Safety Preferences**: Required audience targeting preferences:
  - Family-friendly, General audience, Mature content (18+), All ages

#### Step 4: Wallet Setup
- **PIN Creation**: 4-digit numeric PIN for wallet security
- **Terms Agreement**: Mandatory terms and conditions acceptance
- **Wallet Type**: Automatically set to "Business" for DCD accounts

#### Step 5: Review & Submission
- **Form Review**: Complete form data validation and preview
- **QR Code Generation**: Automatic QR code creation with unique user ID
- **PDF Guide Creation**: Automated PDF guide generation with QR code instructions
- **Account Creation**: User account and DCD profile creation
- **Token Rewards**: Automatic signup bonus (1000 DDS + 1000 DWS tokens if under cap)
- **Referral Processing**: Referral relationship creation and reward distribution
- **Notification Dispatch**: Welcome emails and admin notifications

### DCD Business Logic

#### QR Code System
- **Unique Identification**: Each DCD receives a unique QR code containing their user ID
- **PNG Generation**: High-quality PNG format with error correction
- **Storage**: Secure storage in public disk with organized file structure
- **PDF Integration**: QR codes embedded in downloadable PDF guides

#### PDF Guide Generation
- **Multi-Page Format**: Two-page PDF with different QR code sizes
- **Page 1**: Full-scale QR code for large displays
- **Page 2**: Mobile-optimized QR code for smaller displays
- **Branded Design**: Professional layout with Daya DDS branding
- **Downloadable**: Automatic attachment to welcome emails

#### Token Economy for DCDs
- **Signup Bonus**: 1000 DDS + 1000 DWS tokens upon successful registration
- **Referral Rewards**: 500 DDS + 500 DWS tokens for each successful referral
- **Cap Management**: Token rewards suspended after 3000 total DCD registrations
- **Balance Tracking**: Real-time balance updates with transaction history
- **Venture Shares**: All token transactions recorded for audit trails

#### Referral System for DCDs
- **Multi-Level Referrals**: Support for admin-to-DCD, DA-to-DCD, and DCD-to-DCD referrals
- **Auto-Assignment**: Automatic assignment to admin with lowest token balance when no referral provided
- **Validation**: Referral code verification with existence checks
- **Reward Distribution**: Immediate token rewards for successful referrals
- **Relationship Tracking**: Complete referral chain recording in database

#### Notification System for DCDs
- **Welcome Email**: Comprehensive onboarding email with account details and token balances
- **PDF Attachment**: QR code guide automatically attached to welcome emails
- **Referral Notifications**: Reward notifications for successful referrals
- **Wallet Setup**: Security-focused wallet PIN notifications
- **Admin Alerts**: System-wide notifications for new DCD registrations

### DCD API Endpoints

#### Public Registration Endpoints
- `GET /dcd` - DCD program information and landing page
- `GET /dcd/register` - Multi-step DCD registration form
- `POST /dcd/register` - Process DCD registration with complete workflow

#### QR Code Management
- `POST /api/scan` - QR code scanning endpoint for content distribution

### DCD Database Schema

#### DCD Table Structure
```sql
CREATE TABLE dcd (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_address TEXT NOT NULL,
    business_type JSON NOT NULL,
    operating_days JSON NOT NULL,
    opening_time TIME NULL,
    closing_time TIME NULL,
    foot_traffic_estimate VARCHAR(255) NOT NULL,
    campaign_types JSON NOT NULL,
    music_preferences JSON NULL,
    safety_preferences JSON NOT NULL,
    qr_code_path VARCHAR(255) NOT NULL,
    pdf_guide_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Key DCD Features
- **JSON Storage**: Flexible storage for multi-select preferences and business types
- **File Paths**: QR code and PDF guide file path storage
- **User Relationship**: Direct foreign key relationship with users table
- **Timestamps**: Automatic creation and update timestamp tracking

### DCD Service Architecture

#### DcdService
- **Registration Orchestration**: Coordinates complete DCD registration workflow
- **Referral Processing**: Handles referral validation and reward distribution
- **Token Management**: Manages signup bonuses and referral rewards
- **Notification Dispatch**: Sends welcome emails and admin notifications
- **QR Code Integration**: Coordinates QR code generation and PDF creation

#### QrCodeService
- **QR Generation**: Creates unique QR codes using endroid/qr-code library
- **High Error Correction**: Ensures QR codes remain scannable under damage
- **File Management**: Secure storage and path management for QR assets
- **User ID Encoding**: Embeds user ID in QR code for identification

#### PdfService
- **Guide Generation**: Creates professional PDF guides for DCDs
- **Multi-Page Layout**: Full-scale and mobile-optimized QR code displays
- **Branded Design**: Consistent Daya DDS branding and messaging
- **Attachment Ready**: Optimized for email attachment and download

#### ScanService
- **QR Processing**: Handles QR code scanning and user identification
- **Engagement Tracking**: Records scan events and user interactions
- **Reward Distribution**: Processes earnings from successful scans
- **Analytics Integration**: Feeds data to performance tracking systems

## DA Workflow

### DA Registration Process

The Digital Ambassador (DA) registration is a streamlined 4-step process designed to onboard community members for referral-based earnings:

#### Step 1: Account Setup
- **Personal Information**: Full name, email, phone, national ID, date of birth, gender
- **Referral Code**: Optional referral code for bonus rewards and network building
- **Location Selection**: Country, county, subcounty, and ward selection
- **Validation**: Comprehensive validation including age verification (18+), unique email/phone/ID

#### Step 2: Social Media Platforms
- **Platform Selection**: Multi-select from available social platforms:
  - **Instagram**: Audience reach (Less than 1K, 1K-10K, 10K-50K, 50K-100K, 100K+)
  - **X (Twitter)**: Follower count categories
  - **Facebook**: Audience size tracking
  - **TikTok**: Creator audience metrics
  - **LinkedIn**: Professional network reach
  - **WhatsApp**: Group/channel viewership (Less than 50, 51-100, 101-200, 201-500, 500+ views)
- **Reach Validation**: Each selected platform requires audience size specification
- **Dynamic Selection**: Users can select multiple platforms with different reach levels

#### Step 3: Contact & Wallet Setup
- **Preferred Contact Method**: WhatsApp, Telegram, Email, or Phone
- **Wallet Type**: Personal, Business, or Both account types
- **PIN Creation**: 4-digit numeric PIN for wallet security
- **Terms Agreement**: Mandatory terms and conditions acceptance

#### Step 4: Review & Submission
- **Form Review**: Complete form data validation and preview
- **Account Creation**: User account and DA profile creation
- **Referral Processing**: Referral relationship creation and reward distribution
- **Notification Dispatch**: Welcome emails and admin notifications

### DA Business Logic

#### Social Platform Integration
- **Multi-Platform Support**: Comprehensive social media ecosystem coverage
- **Audience Segmentation**: Granular follower/following count categorization
- **Reach Validation**: Platform-specific audience size requirements
- **Dynamic Form Fields**: Conditional validation based on selected platforms

#### Referral System for DAs
- **Multi-Level Referrals**: Support for admin-to-DA, DA-to-DA, and DCD-to-DA referrals
- **Auto-Assignment**: Automatic assignment to admin with lowest token balance when no referral provided
- **Validation**: Referral code verification with existence checks
- **Reward Distribution**: Immediate token rewards for successful referrals
- **Relationship Tracking**: Complete referral chain recording in database

#### Token Economy for DAs
- **Referral Rewards**: 200 DDS + 200 DWS tokens for each successful referral
- **Cap Management**: Token rewards suspended after 3000 total DA registrations
- **Balance Tracking**: Real-time balance updates with transaction history
- **Venture Shares**: All token transactions recorded for audit trails

#### Notification System for DAs
- **Welcome Email**: Comprehensive onboarding email with account details
- **Referral Rewards**: Email notifications for successful referral earnings
- **Wallet Security**: PIN setup and security-focused notifications
- **Admin Alerts**: System-wide notifications for new DA registrations

### DA API Endpoints

#### Public Registration Endpoints
- `GET /da` - DA program information and landing page
- `GET /da/register` - Multi-step DA registration form
- `POST /da/register` - Process DA registration with complete workflow

### DA Database Schema

#### DA Table Structure
```sql
CREATE TABLE da (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    social_platforms JSON NULL,
    prefered_contact_method VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Key DA Features
- **JSON Storage**: Flexible storage for multi-platform social media data
- **User Relationship**: Direct foreign key relationship with users table
- **Optional Platforms**: Social platforms field allows for future expansion
- **Contact Preferences**: Preferred communication method storage

### DA Service Architecture

#### DaService
- **Registration Orchestration**: Coordinates complete DA registration workflow
- **Referral Processing**: Handles referral validation and reward distribution
- **Social Platform Management**: Processes multi-platform audience data
- **Token Management**: Manages referral rewards and balance updates
- **Notification Dispatch**: Sends welcome emails and admin notifications

#### Key DA Features
- **Social Platform Flexibility**: Support for multiple social media platforms with varying audience metrics
- **Referral Network Building**: Automated referral relationship creation and reward distribution
- **Audience Reach Tracking**: Granular follower/following count categorization
- **Contact Method Preferences**: Flexible communication channel selection

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
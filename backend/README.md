# Backend - Laravel API Server

## Overview
This is the backend API server for the Deepfake Detection application built with Laravel 11. It provides RESTful APIs for user authentication, file analysis, and admin management.

## 🚀 Tech Stack
- **Framework**: Laravel 11
- **Database**: SQLite (development) / MySQL (production)
- **Authentication**: Laravel Sanctum (API tokens)
- **File Storage**: Local storage with public disk
- **Queue**: Database driver for background jobs
- **Testing**: PHPUnit

## 📁 Project Structure
```
backend/
├── app/
│   ├── Http/Controllers/     # API Controllers
│   ├── Models/              # Eloquent Models
│   ├── Providers/           # Service Providers
│   └── ...
├── config/                  # Configuration files
├── database/
│   ├── migrations/          # Database migrations
│   ├── seeders/            # Database seeders
│   └── database.sqlite     # SQLite database
├── routes/
│   ├── api.php             # API routes
│   └── web.php             # Web routes (admin)
├── storage/                # File storage
├── tests/                  # Unit & Feature tests
└── vendor/                 # Composer dependencies
```

## 🔧 Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- SQLite or MySQL

### Installation
```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Create storage link
php artisan storage:link

# Start development server
php artisan serve
```

## 🔐 Environment Configuration
Create `.env` file with these key variables:
```env
APP_NAME="Deepfake Detection API"
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user

### File Analysis
- `POST /api/analyses` - Submit file for analysis
- `GET /api/analyses` - Get user's analysis history
- `GET /api/analyses/{id}` - Get specific analysis result

### Admin Routes (Web)
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin authentication
- `POST /admin/logout` - Admin logout
- `GET /admin/dashboard` - Main admin dashboard with statistics
- `GET /admin/users` - User management interface
- `POST /admin/users/{user}/limit` - Update user API limits
- `GET /admin/analytics` - System analytics and reports
- `GET /admin/settings` - System configuration and settings

## 🎨 Admin Dashboard Features

### Modern Admin Interface
The admin dashboard has been completely redesigned with modern UI/UX principles:

#### 🖥️ Dashboard Overview
- **Modern Layout**: Clean, responsive design using Tailwind CSS
- **Statistics Cards**: Real-time system metrics and key performance indicators
- **Interactive Charts**: Visual analytics powered by Chart.js
- **Mobile Responsive**: Fully optimized for all device sizes
- **Dark Mode Support**: Modern color scheme with proper contrast

#### 📊 Key Metrics Display
- **Total Users**: Complete user count with growth indicators
- **Total Analyses**: All-time analysis statistics
- **Daily Analyses**: Current day's activity metrics
- **Active Users**: Real-time user engagement data

#### 🎯 Navigation & UX
- **Sidebar Navigation**: Collapsible sidebar with intuitive icons
- **Breadcrumb Navigation**: Clear page hierarchy and navigation
- **Flash Messages**: User-friendly success/error notifications
- **Modal Dialogs**: Smooth user interactions for confirmations
- **Loading States**: Professional loading indicators

### 👥 User Management
- **User Listing**: Paginated table with search and filter capabilities
- **Role Management**: Admin/User role assignment and permissions
- **API Limit Controls**: Configurable daily API request limits per user
- **User Statistics**: Individual user analytics and usage patterns
- **Bulk Actions**: Efficient bulk user operations

### 📈 Analytics Dashboard
- **System Performance**: Server metrics and performance indicators
- **Usage Analytics**: Detailed analysis service usage statistics
- **Growth Charts**: User registration and engagement trends
- **Service Distribution**: Analysis type popularity and usage patterns
- **Real-time Data**: Live updates and current system status

### ⚙️ Settings Management
- **System Configuration**: Core application settings management
- **API Integration**: External service configuration (Sightengine)
- **Rate Limiting**: Global API rate limit configuration
- **File Upload Settings**: Upload restrictions and file type management
- **Quick Actions**: Common administrative tasks and shortcuts

### 🔐 Security & Access Control
- **Admin Authentication**: Secure admin-only access with middleware protection
- **Session Management**: Proper session handling and timeout controls
- **CSRF Protection**: Full CSRF token validation on all forms
- **Input Validation**: Comprehensive server-side validation
- **Audit Logging**: Admin action tracking and logging

## 🛠️ Admin Technical Implementation

### Middleware & Routing
```php
// AdminMiddleware ensures admin-only access
Route::prefix('admin')->group(function () {
    Route::get('login', [AdminController::class, 'showLogin'])->name('admin.login');
    Route::post('login', [AdminController::class, 'login']);
    
    Route::middleware('admin')->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('users', [AdminController::class, 'users'])->name('admin.users');
        Route::get('analytics', [AdminController::class, 'analytics'])->name('admin.analytics');
        Route::get('settings', [AdminController::class, 'settings'])->name('admin.settings');
    });
});
```

### Frontend Technologies
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Alpine.js**: Lightweight JavaScript framework for interactive components
- **Chart.js**: Responsive charts and data visualization
- **Blade Templates**: Laravel's templating engine with component inheritance

### Database Schema Updates
```sql
-- Added admin functionality to users table
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN api_calls_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN daily_limit INTEGER DEFAULT 10;

-- Enhanced analyses table
ALTER TABLE analyses ADD COLUMN service VARCHAR(50);
```

### Admin Blade Components
```
resources/views/admin/
├── layout.blade.php      # Shared admin layout with sidebar
├── dashboard.blade.php   # Main dashboard with statistics
├── login.blade.php       # Admin authentication form
├── users.blade.php       # User management interface
├── analytics.blade.php   # Analytics and reporting
└── settings.blade.php    # System configuration
```

## 🗄️ Database Schema

### Users Table
```sql
- id (primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp)
- password (string)
- api_token (string, nullable)
- is_admin (boolean, default: false)
- api_calls_today (integer, default: 0)
- daily_limit (integer, default: 10)
- created_at, updated_at (timestamps)
```

### Analyses Table
```sql
- id (primary key)
- user_id (foreign key)
- filename (string)
- service (enum: deepfake, face, weapons, offensive, properties, celebrity)
- result (json)
- status (enum: pending, completed, failed)
- created_at, updated_at (timestamps)
```

## 🔒 Security Features
- **API Rate Limiting**: Configured per user with daily limits
- **CORS Protection**: Configured for frontend domains
- **Input Validation**: Request validation for all endpoints
- **File Upload Security**: Type and size validation
- **Authentication**: Sanctum token-based auth

## 🧪 Testing
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Generate coverage report
php artisan test --coverage
```

## 📊 Performance
- **Caching**: Redis/File cache for configuration
- **Database**: Optimized queries with eager loading
- **Queue Jobs**: Background processing for heavy tasks
- **File Storage**: Efficient file handling with Laravel Storage

## 🚀 Deployment
```bash
# Production setup
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

## 🐛 Debugging
- Enable debug mode in `.env`: `APP_DEBUG=true`
- Check logs: `storage/logs/laravel.log`
- Use Laravel Telescope for detailed debugging (if installed)

## 📚 Additional Resources
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [API Documentation](../docs/api.md) (if available)

## 🤝 Contributing
1. Follow PSR-12 coding standards
2. Write tests for new features
3. Update API documentation
4. Ensure all tests pass before PR

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

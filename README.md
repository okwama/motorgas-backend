# MotorGas Backend API

A robust NestJS backend API for the MotorGas staff management and forecourt operations system.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **Staff Management**: Complete staff profile and role management
- **Check-in/Check-out System**: Location-based attendance tracking
- **Leave Management**: Leave applications, approvals, and balance tracking
- **Station Management**: Multi-station support with location tracking
- **Real-time Notifications**: SOS alerts and emergency response
- **File Upload**: Document and image upload support
- **API Documentation**: Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd motorgas-backend
```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_HOST=YOUR IP
   DB_PORT=3306
   DB_USERNAME=
   DB_PASSWORD=
   DB_DATABASE=
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MySQL is running
   - The database schema is already provided in `db.sql`
   - Import the schema if needed

5. **Run the application**
```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **API Base URL**: `http://localhost:3000/api`

## 🔐 Authentication

The API uses JWT-based authentication:

1. **Login**: `POST /api/auth/login`
   ```json
   {
     "phone": "0712345678",
     "password": "password123"
   }
   ```

2. **Refresh Token**: `POST /api/auth/refresh`
   ```json
   {
     "refreshToken": "your-refresh-token"
   }
   ```

3. **Logout**: `POST /api/auth/logout` (requires Bearer token)

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── checkin/             # Check-in/out module
│   ├── checkin.controller.ts
│   ├── checkin.service.ts
│   └── dto/
├── leave/               # Leave management
│   ├── leave.controller.ts
│   ├── leave.service.ts
│   └── dto/
├── entities/            # Database entities
│   ├── user.entity.ts
│   ├── staff.entity.ts
│   ├── station.entity.ts
│   ├── checkin-record.entity.ts
│   ├── leave-type.entity.ts
│   ├── staff-leave.entity.ts
│   ├── staff-leave-balance.entity.ts
│   ├── token.entity.ts
│   └── notice.entity.ts
└── main.ts             # Application entry point
```

## 🔧 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## 📊 Database Schema

The application uses the following main entities:

- **users**: System users (admin/user roles)
- **staff**: Staff members with roles and stations
- **stations**: Gas stations/locations
- **checkin_records**: Attendance tracking
- **leave_types**: Available leave types
- **staff_leaves**: Leave applications
- **staff_leave_balances**: Leave balance tracking
- **tokens**: JWT token management
- **notices**: System notices and announcements

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with class-validator
- CORS enabled
- Rate limiting (can be added)

## 📱 Flutter Integration

This backend is designed to work with the MotorGas Flutter app. The API endpoints match the existing Flutter app's expectations:

- Authentication endpoints for staff login
- Check-in/out with GPS coordinates
- Leave management system
- Station and staff data management

## 🚀 Deployment

1. **Build the application**
```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for MotorGas operations BUILD BY BENJAMIN OKWAMA CITLOGISTICS SYSTEMS.

## 🆘 Support

For support and questions, please contact the development team.

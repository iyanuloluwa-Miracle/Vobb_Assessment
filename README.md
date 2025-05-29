# Vobb API

A robust authentication service built with Node.js, TypeScript, and MongoDB.

## 🔗 Quick Links

- **Live API**: [https://vobb-api.render.com](https://vobb-api.render.com) (Update this link once deployed)
- **API Documentation**: [Postman Collection](https://documenter.getpostman.com/view/your-collection-id) (Update this link once created)

## 🚀 Features

- User Authentication (JWT-based)
- Role-based Authorization (Managers & Customers)
- Secure Password Hashing
- TypeScript Support
- MongoDB Integration
- Environment Variables Configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vobb.git
   cd vobb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Replace the placeholders with your actual values.

   To generate a secure JWT secret, you can use this command:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Start production server**
   ```bash
   npm start
   ```

## 🔑 API Endpoints

### Authentication

#### Manager Routes
```
POST /api/auth/manager/register
POST /api/auth/manager/login
```

#### Customer Routes
```
POST /api/auth/customer/register
POST /api/auth/customer/login
```

### Request & Response Examples

#### Register Manager
```http
POST /api/auth/manager/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "manager": {
    "id": "manager_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager"
  },
  "token": "jwt_token"
}
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- Input validation and sanitization

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Dependencies

- `express`: Web framework
- `typescript`: Programming language
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT implementation
- `bcryptjs`: Password hashing
- `dotenv`: Environment variables
- `cors`: Cross-Origin Resource Sharing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Node.js community
- TypeScript team
- MongoDB team 
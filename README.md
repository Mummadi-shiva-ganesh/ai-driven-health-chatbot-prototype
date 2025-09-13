# HealthBot - AI-Driven Health Chatbot

A comprehensive AI-powered health chatbot designed to educate rural and semi-urban populations about preventive healthcare, disease symptoms, and vaccination schedules. The application integrates with Google Gemini AI and provides real-time health information in multiple languages.

## 🌟 Features

### Core Functionality
- **AI-Powered Chatbot**: Powered by Google Gemini API for intelligent health conversations
- **Multilingual Support**: Available in 10+ languages including Hindi, Bengali, Telugu, and more
- **User Authentication**: Secure login/signup system with JWT tokens
- **Disease Information**: Comprehensive database of diseases with symptoms and prevention
- **Vaccination Schedules**: Age-appropriate vaccination recommendations
- **Health Alerts**: Real-time outbreak alerts and health notifications
- **Data Export**: Excel export functionality for chat history and health data

### User Interface
- **Modern Design**: Beautiful, responsive UI with gradient backgrounds and glassmorphism effects
- **Mobile-First**: Optimized for mobile devices to serve rural populations
- **Accessibility**: Easy-to-use interface with clear navigation
- **Real-time Chat**: Interactive chat interface with typing indicators
- **Dashboard**: Comprehensive health dashboard with statistics and quick actions

### Technical Features
- **Database Integration**: SQLite/PostgreSQL support with SQLAlchemy ORM
- **RESTful API**: Flask-based backend with comprehensive endpoints
- **React Frontend**: Modern React application with styled-components
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Export**: Excel file generation for data export
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-chatbot
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Create environment file
   cp env.example .env
   
   # Edit .env file with your configuration
   # Add your Gemini API key and other settings
   ```

3. **Frontend Setup**
   ```bash
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

4. **Database Setup**
   ```bash
   # Initialize database (SQLite by default)
   python app.py
   ```

5. **Run the Application**
   ```bash
   # Terminal 1: Start backend
   python app.py
   
   # Terminal 2: Start frontend
   cd client
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=sqlite:///health_chatbot.db
# For PostgreSQL: postgresql://username:password@localhost/health_chatbot

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5000
FLASK_ENV=development

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file

## 📱 Usage

### For Users

1. **Registration**: Create an account with your personal information
2. **Login**: Access your personalized health dashboard
3. **Chat**: Start conversations with the AI health assistant
4. **Explore**: Browse disease information and vaccination schedules
5. **Alerts**: Stay informed about health alerts in your area
6. **Export**: Download your chat history and health data

### For Administrators

1. **Disease Management**: Add/update disease information in the database
2. **Vaccination Schedules**: Manage vaccination recommendations
3. **Health Alerts**: Create and manage outbreak alerts
4. **User Management**: Monitor user activity and health data

## 🏗️ Architecture

### Backend (Flask)
- **Models**: User, ChatHistory, Disease, VaccinationSchedule, OutbreakAlert
- **Routes**: Authentication, chat, diseases, vaccination, alerts, profile
- **Services**: Gemini AI integration, data export, authentication
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support

### Frontend (React)
- **Components**: Reusable UI components with styled-components
- **Pages**: Home, Login, Register, Dashboard, Chat, Diseases, Vaccination, Alerts, Profile
- **Context**: Authentication context for user management
- **Services**: API integration with axios

### Database Schema
```sql
-- Users table
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    age INTEGER,
    gender VARCHAR(10),
    location VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Chat history table
CREATE TABLE chat_history (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    language VARCHAR(10) DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Diseases table
CREATE TABLE disease (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    symptoms TEXT NOT NULL,
    prevention TEXT NOT NULL,
    treatment TEXT,
    severity VARCHAR(20),
    category VARCHAR(50)
);

-- Vaccination schedules table
CREATE TABLE vaccination_schedule (
    id INTEGER PRIMARY KEY,
    age_group VARCHAR(50) NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    country VARCHAR(50) DEFAULT 'India'
);

-- Outbreak alerts table
CREATE TABLE outbreak_alert (
    id INTEGER PRIMARY KEY,
    disease_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Chat
- `POST /api/chat` - Send message to AI chatbot

### Data
- `GET /api/diseases` - Get disease information
- `GET /api/vaccination-schedule` - Get vaccination schedules
- `GET /api/outbreak-alerts` - Get health alerts
- `GET /api/export-data` - Export user data to Excel

## 🌍 Multilingual Support

The application supports the following languages:
- English (en)
- Hindi (hi)
- Bengali (bn)
- Telugu (te)
- Marathi (mr)
- Tamil (ta)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)

## 🚀 Deployment

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   EXPOSE 5000
   CMD ["python", "app.py"]
   ```

2. **Build and run**
   ```bash
   docker build -t health-chatbot .
   docker run -p 5000:5000 health-chatbot
   ```

### Using Heroku

1. **Create Procfile**
   ```
   web: gunicorn app:app
   ```

2. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Using Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel
   ```

## 🧪 Testing

### Backend Testing
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
```

### Frontend Testing
```bash
cd client
npm test
```

## 📊 Data Sources

- **Disease Information**: Kaggle Disease-Symptom Dataset
- **Vaccination Schedules**: WHO and national health authority recommendations
- **Health Alerts**: Government health databases and news sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@healthbot.com or create an issue in the repository.

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Kaggle for the disease-symptom dataset
- WHO for vaccination schedule recommendations
- The open-source community for various libraries and tools

## 📈 Future Enhancements

- [ ] Voice chat integration
- [ ] Image analysis for symptoms
- [ ] Integration with wearable devices
- [ ] Telemedicine features
- [ ] Community health forums
- [ ] Health tracking and analytics
- [ ] SMS/WhatsApp integration
- [ ] Offline mode support
- [ ] Advanced AI models for better diagnosis
- [ ] Integration with local health centers

---

**HealthBot** - Empowering communities with accessible healthcare information through AI technology.

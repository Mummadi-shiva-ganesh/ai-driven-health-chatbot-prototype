# HealthBot Deployment Guide

This guide provides step-by-step instructions for deploying the HealthBot application to various platforms.

## 🚀 Quick Deployment Options

### Option 1: Local Development Setup

1. **Prerequisites**
   - Python 3.8+
   - Node.js 16+
   - Git

2. **Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd health-chatbot
   
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Install Node.js dependencies
   cd client
   npm install
   cd ..
   
   # Configure environment
   cp env.example .env
   # Edit .env with your settings
   
   # Test setup
   python test_setup.py
   ```

3. **Run**
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   ./start.sh
   
   # Manual
   python run.py  # Backend
   cd client && npm start  # Frontend
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   
   WORKDIR /app
   
   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       gcc \
       && rm -rf /var/lib/apt/lists/*
   
   # Copy requirements and install Python dependencies
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   # Copy application code
   COPY . .
   
   # Expose port
   EXPOSE 5000
   
   # Run the application
   CMD ["python", "run.py"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     backend:
       build: .
       ports:
         - "5000:5000"
       environment:
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - JWT_SECRET_KEY=${JWT_SECRET_KEY}
         - DATABASE_URL=sqlite:///health_chatbot.db
       volumes:
         - ./data:/app/data
   
     frontend:
       build: ./client
       ports:
         - "3000:3000"
       depends_on:
         - backend
       environment:
         - REACT_APP_API_URL=http://localhost:5000
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Option 3: Heroku Deployment

1. **Prepare for Heroku**
   ```bash
   # Install Heroku CLI
   # Create Procfile
   echo "web: gunicorn app:app" > Procfile
   
   # Create runtime.txt
   echo "python-3.9.16" > runtime.txt
   ```

2. **Deploy**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create your-healthbot-app
   
   # Set environment variables
   heroku config:set GEMINI_API_KEY=your-api-key
   heroku config:set JWT_SECRET_KEY=your-secret-key
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 4: Vercel + Railway Deployment

1. **Backend (Railway)**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Frontend (Vercel)**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy frontend
   cd client
   vercel
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=sqlite:///health_chatbot.db
# For production: postgresql://user:pass@host:port/db

# Security
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=5000
FLASK_ENV=production

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Getting API Keys

1. **Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to your environment variables

2. **Database (Production)**
   - Use PostgreSQL for production
   - Services: Railway, Heroku Postgres, AWS RDS
   - Update DATABASE_URL accordingly

## 🗄️ Database Setup

### SQLite (Development)
```bash
# Automatic setup
python run.py
```

### PostgreSQL (Production)
```bash
# Install PostgreSQL
# Create database
createdb health_chatbot

# Update DATABASE_URL
DATABASE_URL=postgresql://username:password@localhost/health_chatbot

# Run migrations
python run.py
```

## 📱 Frontend Deployment

### Vercel (Recommended)
```bash
cd client
npm install -g vercel
vercel
```

### Netlify
```bash
cd client
npm run build
# Upload dist folder to Netlify
```

### GitHub Pages
```bash
cd client
npm install --save-dev gh-pages
npm run build
npx gh-pages -d build
```

## 🔒 Security Considerations

### Production Security
1. **Environment Variables**
   - Never commit .env files
   - Use secure secret management
   - Rotate keys regularly

2. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL certificates
   - Use secure headers

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

4. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration

## 📊 Monitoring and Logging

### Application Monitoring
```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/healthbot.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('HealthBot startup')
```

### Health Checks
```python
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })
```

## 🚀 Performance Optimization

### Backend Optimization
1. **Database Indexing**
   ```python
   # Add indexes to models
   class User(db.Model):
       email = db.Column(db.String(120), unique=True, nullable=False, index=True)
   ```

2. **Caching**
   ```python
   from flask_caching import Cache
   cache = Cache(app, config={'CACHE_TYPE': 'simple'})
   ```

3. **Connection Pooling**
   ```python
   # For PostgreSQL
   DATABASE_URL=postgresql://user:pass@host:port/db?pool_size=20&max_overflow=0
   ```

### Frontend Optimization
1. **Code Splitting**
   ```javascript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

2. **Bundle Optimization**
   ```bash
   npm run build
   # Analyze bundle
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy HealthBot

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run tests
        run: python test_setup.py

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-healthbot-app"
          heroku_email: "your-email@example.com"
```

## 📈 Scaling Considerations

### Horizontal Scaling
1. **Load Balancer**
   - Use nginx or cloud load balancer
   - Configure sticky sessions if needed

2. **Database Scaling**
   - Read replicas for read-heavy workloads
   - Connection pooling
   - Database sharding for large datasets

3. **Caching Layer**
   - Redis for session storage
   - CDN for static assets
   - Application-level caching

### Vertical Scaling
1. **Resource Monitoring**
   - CPU and memory usage
   - Database performance
   - Response times

2. **Auto-scaling**
   - Cloud provider auto-scaling
   - Container orchestration (Kubernetes)
   - Serverless functions

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check database URL
   echo $DATABASE_URL
   
   # Test connection
   python -c "from app import db; print(db.engine.execute('SELECT 1').fetchone())"
   ```

2. **API Key Issues**
   ```bash
   # Test Gemini API
   python -c "import google.generativeai as genai; genai.configure(api_key='your-key'); print('OK')"
   ```

3. **Frontend Build Issues**
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Logs and Debugging
```bash
# Backend logs
tail -f logs/healthbot.log

# Frontend logs
cd client
npm start  # Check console for errors

# Database logs
# Check your database provider's logging interface
```

## 📞 Support

For deployment issues:
1. Check the logs
2. Verify environment variables
3. Test individual components
4. Check network connectivity
5. Review security settings

---

**Happy Deploying! 🚀**

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
import os
import pandas as pd
import json
from datetime import datetime, timedelta
import google.generativeai as genai
from dotenv import load_dotenv
import sqlite3
import xlsxwriter
from io import BytesIO
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///health_chatbot.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

# Configure Gemini AI
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Gemini AI configured successfully")
except Exception as e:
    print(f"❌ Error configuring Gemini AI: {e}")
    model = None

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    location = db.Column(db.String(100))
    preferred_language = db.Column(db.String(10), default='en')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    language = db.Column(db.String(10), default='en')

class Disease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    symptoms = db.Column(db.Text, nullable=False)
    prevention = db.Column(db.Text, nullable=False)
    treatment = db.Column(db.Text)
    severity = db.Column(db.String(20))
    category = db.Column(db.String(50))

class VaccinationSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age_group = db.Column(db.String(50), nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    is_mandatory = db.Column(db.Boolean, default=False)
    country = db.Column(db.String(50), default='India')

class OutbreakAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    disease_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text)
    alert_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

# Comprehensive Disease-Symptom Dataset
disease_data = {
    "Common Cold": {
        "symptoms": ["runny nose", "sneezing", "cough", "sore throat", "mild fever", "congestion"],
        "prevention": ["wash hands frequently", "avoid close contact with sick people", "cover mouth when coughing", "avoid touching face"],
        "treatment": "rest, fluids, over-the-counter medications, steam inhalation",
        "severity": "mild",
        "category": "respiratory"
    },
    "Flu (Influenza)": {
        "symptoms": ["high fever", "body aches", "fatigue", "cough", "headache", "chills", "sore throat"],
        "prevention": ["annual flu vaccination", "good hygiene", "avoid touching face", "stay home when sick"],
        "treatment": "antiviral medications, rest, fluids, fever reducers",
        "severity": "moderate",
        "category": "respiratory"
    },
    "Diabetes": {
        "symptoms": ["increased thirst", "frequent urination", "fatigue", "blurred vision", "slow healing wounds", "weight loss"],
        "prevention": ["maintain healthy weight", "regular exercise", "balanced diet", "limit sugar intake"],
        "treatment": "insulin therapy, medication, lifestyle changes, blood sugar monitoring",
        "severity": "chronic",
        "category": "metabolic"
    },
    "Thyroid Disorders": {
        "symptoms": ["unexpected weight changes", "fatigue or excessive energy", "constipation or diarrhea", "dry skin", "brittle nails", "hair loss", "mood changes", "sensitivity to cold or heat", "neck swelling"],
        "prevention": ["regular check-ups", "iodine-rich diet", "avoid excessive stress", "limit processed foods"],
        "treatment": "hormone replacement therapy, medication, regular monitoring, dietary changes",
        "severity": "chronic",
        "category": "endocrine"
    },
    "Hypertension (High Blood Pressure)": {
        "symptoms": ["often no symptoms", "headaches", "shortness of breath", "nosebleeds", "dizziness"],
        "prevention": ["reduce salt intake", "regular exercise", "maintain healthy weight", "limit alcohol", "quit smoking"],
        "treatment": "medication, lifestyle changes, regular monitoring",
        "severity": "chronic",
        "category": "cardiovascular"
    },
    "Malaria": {
        "symptoms": ["high fever", "chills", "sweating", "headache", "nausea", "vomiting", "muscle pain"],
        "prevention": ["use mosquito nets", "apply insect repellent", "eliminate standing water", "wear long sleeves"],
        "treatment": "antimalarial medications, rest, fluids, hospital care if severe",
        "severity": "moderate to severe",
        "category": "infectious"
    },
    "Tuberculosis (TB)": {
        "symptoms": ["persistent cough", "chest pain", "coughing up blood", "fatigue", "weight loss", "night sweats", "fever"],
        "prevention": ["BCG vaccination", "good ventilation", "avoid close contact with infected persons", "cover mouth when coughing"],
        "treatment": "antibiotic treatment for 6-9 months, rest, proper nutrition",
        "severity": "moderate to severe",
        "category": "infectious"
    },
    "Pneumonia": {
        "symptoms": ["cough with phlegm", "fever", "chills", "shortness of breath", "chest pain", "fatigue"],
        "prevention": ["pneumonia vaccination", "flu vaccination", "good hygiene", "avoid smoking", "proper nutrition"],
        "treatment": "antibiotics, rest, fluids, oxygen therapy if needed",
        "severity": "moderate to severe",
        "category": "respiratory"
    },
    "Dengue Fever": {
        "symptoms": ["high fever", "severe headache", "pain behind eyes", "muscle and joint pain", "rash", "nausea", "vomiting"],
        "prevention": ["eliminate standing water", "use mosquito nets", "apply repellent", "wear protective clothing"],
        "treatment": "rest, fluids, pain relievers (avoid aspirin), hospital care if severe",
        "severity": "moderate to severe",
        "category": "infectious"
    },
    "Chikungunya": {
        "symptoms": ["fever", "severe joint pain", "muscle pain", "headache", "rash", "fatigue"],
        "prevention": ["eliminate standing water", "use mosquito nets", "apply repellent", "wear long sleeves"],
        "treatment": "rest, fluids, pain relievers, physical therapy for joint pain",
        "severity": "moderate",
        "category": "infectious"
    },
    "Jaundice": {
        "symptoms": ["yellow skin and eyes", "dark urine", "pale stools", "fatigue", "abdominal pain", "nausea"],
        "prevention": ["hepatitis vaccination", "avoid contaminated water", "good hygiene", "safe food handling"],
        "treatment": "rest, fluids, avoid alcohol, treat underlying cause",
        "severity": "moderate to severe",
        "category": "hepatic"
    },
    "Anemia": {
        "symptoms": ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands and feet"],
        "prevention": ["iron-rich diet", "vitamin B12 and folate", "regular check-ups", "avoid blood loss"],
        "treatment": "iron supplements, dietary changes, treat underlying cause",
        "severity": "mild to moderate",
        "category": "hematologic"
    },
    "Asthma": {
        "symptoms": ["wheezing", "shortness of breath", "chest tightness", "coughing", "difficulty breathing"],
        "prevention": ["avoid triggers", "use inhalers as prescribed", "avoid smoking", "manage stress"],
        "treatment": "inhalers, medications, avoid triggers, emergency care if severe",
        "severity": "chronic",
        "category": "respiratory"
    },
    "Heart Disease": {
        "symptoms": ["chest pain", "shortness of breath", "fatigue", "irregular heartbeat", "swelling in legs"],
        "prevention": ["healthy diet", "regular exercise", "avoid smoking", "manage stress", "control blood pressure"],
        "treatment": "medication, lifestyle changes, surgery if needed, cardiac rehabilitation",
        "severity": "moderate to severe",
        "category": "cardiovascular"
    },
    "Kidney Disease": {
        "symptoms": ["fatigue", "swelling in legs", "changes in urination", "nausea", "loss of appetite", "muscle cramps"],
        "prevention": ["control diabetes and blood pressure", "avoid excessive salt", "stay hydrated", "avoid NSAIDs"],
        "treatment": "medication, dietary changes, dialysis if severe, kidney transplant",
        "severity": "chronic",
        "category": "renal"
    },
    "Arthritis": {
        "symptoms": ["joint pain", "stiffness", "swelling", "reduced range of motion", "fatigue"],
        "prevention": ["maintain healthy weight", "regular exercise", "protect joints", "avoid repetitive stress"],
        "treatment": "pain relievers, physical therapy, exercise, joint protection",
        "severity": "chronic",
        "category": "musculoskeletal"
    },
    "Migraine": {
        "symptoms": ["severe headache", "nausea", "vomiting", "sensitivity to light and sound", "visual disturbances"],
        "prevention": ["identify triggers", "regular sleep", "stress management", "avoid certain foods"],
        "treatment": "pain relievers, rest in dark room, preventive medications",
        "severity": "moderate to severe",
        "category": "neurological"
    },
    "Depression": {
        "symptoms": ["persistent sadness", "loss of interest", "fatigue", "sleep problems", "appetite changes", "difficulty concentrating"],
        "prevention": ["regular exercise", "social connections", "stress management", "healthy lifestyle"],
        "treatment": "therapy, medication, lifestyle changes, support groups",
        "severity": "moderate to severe",
        "category": "mental health"
    },
    "Anxiety": {
        "symptoms": ["excessive worry", "restlessness", "fatigue", "difficulty concentrating", "irritability", "sleep problems"],
        "prevention": ["stress management", "regular exercise", "adequate sleep", "avoid caffeine"],
        "treatment": "therapy, medication, relaxation techniques, lifestyle changes",
        "severity": "mild to severe",
        "category": "mental health"
    },
    "Skin Infections": {
        "symptoms": ["redness", "swelling", "pain", "warmth", "pus", "fever"],
        "prevention": ["good hygiene", "keep wounds clean", "avoid sharing personal items", "proper wound care"],
        "treatment": "antibiotics, wound care, rest, elevation if on limbs",
        "severity": "mild to moderate",
        "category": "dermatological"
    },
    "Food Poisoning": {
        "symptoms": ["nausea", "vomiting", "diarrhea", "stomach cramps", "fever", "dehydration"],
        "prevention": ["proper food handling", "cook food thoroughly", "avoid contaminated water", "good hygiene"],
        "treatment": "rest, fluids, oral rehydration, avoid solid foods initially",
        "severity": "mild to moderate",
        "category": "gastrointestinal"
    }
}

# Routes
@app.route('/')
def home():
    return jsonify({
        'message': 'HealthBot API is running!',
        'status': 'success',
        'frontend_url': 'http://localhost:3000',
        'api_docs': {
            'register': '/api/register',
            'login': '/api/login',
            'chat': '/api/chat',
            'diseases': '/api/diseases',
            'vaccination_schedule': '/api/vaccination-schedule',
            'outbreak_alerts': '/api/outbreak-alerts',
            'user_profile': '/api/user/profile'
        }
    })

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash,
            full_name=data['full_name'],
            phone=data.get('phone'),
            age=data.get('age'),
            gender=data.get('gender'),
            location=data.get('location'),
            preferred_language=data.get('preferred_language', 'en')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and bcrypt.check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'preferred_language': user.preferred_language
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        message = data['message']
        language = data.get('language', user.preferred_language)
        
        # Check if Gemini model is available
        if model is None:
            # Fallback response when Gemini is not available
            bot_response = f"""## 🏥 Health Assistant Response

**Your Question:** "{message}"

### ⚠️ Current Status
• AI service temporarily unavailable
• Providing general health guidance

### 💡 General Health Tips
• **Always consult** healthcare professionals for serious concerns
• **Maintain good hygiene** and regular exercise
• **Eat a balanced diet** with fresh fruits and vegetables
• **Get adequate sleep** (7-9 hours daily)
• **Stay hydrated** (8-10 glasses of water daily)

### 🚨 When to Seek Medical Help
• Persistent or severe symptoms
• Difficulty breathing
• High fever (above 101°F/38.3°C)
• Severe pain or discomfort
• Any emergency symptoms

### 📞 Next Steps
• Contact your nearest health clinic
• Ask about telehealth options if travel is difficult
• Don't delay seeking professional medical advice

**Note:** This is general guidance only. Always consult a healthcare provider for proper diagnosis and treatment."""
        else:
            try:
                # Create context for Gemini with specific formatting instructions
                context = f"""You are a helpful health assistant for rural and semi-urban populations. 
        User's preferred language: {language}
        
IMPORTANT FORMATTING RULES:
- Always answer in clear, structured bullet points
- Use emojis for visual appeal and easy reading
- Avoid long paragraphs - break information into digestible points
- Use headers and subheaders for organization
- Include actionable steps and clear next steps
- Make information culturally appropriate for rural/semi-urban areas

RESPONSE FORMAT:
## 🏥 [Main Topic]
**Your Question:** [Brief summary]

### 📋 [Section 1]
• [Bullet point 1]
• [Bullet point 2]
• [Bullet point 3]

### 💡 [Section 2]
• [Actionable advice 1]
• [Actionable advice 2]

### ⚠️ [Important Notes]
• [Warning or important info]

### 📞 [Next Steps]
• [What to do next]
        
        Available disease information: {json.dumps(disease_data, indent=2)}
        
User message: {message}"""
        
                # Generate response using Gemini
                response = model.generate_content(context)
                bot_response = response.text
                
            except Exception as gemini_error:
                print(f"Gemini API error: {gemini_error}")
                # Fallback response with proper formatting
                bot_response = f"""## 🏥 Health Assistant Response

**Your Question:** "{message}"

### ⚠️ Current Status
• AI service experiencing technical difficulties
• Providing general health guidance

### 💡 General Health Guidelines
• **Always consult** healthcare professionals for medical concerns
• **Maintain good hygiene** practices (handwashing, clean environment)
• **Follow a balanced diet** with local, fresh foods
• **Exercise regularly** (30 minutes daily if possible)
• **Get sufficient rest** and manage stress

### 🚨 When to Seek Immediate Help
• Severe symptoms or pain
• Difficulty breathing
• High fever or persistent illness
• Any emergency health situation

### 📞 Next Steps
• Contact your nearest health center
• Ask about telehealth options if available
• Don't delay seeking professional medical advice

**Note:** This is general guidance only. Always consult a healthcare provider for proper diagnosis and treatment."""
        
        # Save chat history
        chat_record = ChatHistory(
            user_id=user_id,
            message=message,
            response=bot_response,
            language=language
        )
        db.session.add(chat_record)
        db.session.commit()
        
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error. Please try again.'}), 500

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    try:
        diseases = Disease.query.all()
        disease_list = []
        
        for disease in diseases:
            disease_list.append({
                'id': disease.id,
                'name': disease.name,
                'symptoms': disease.symptoms,
                'prevention': disease.prevention,
                'treatment': disease.treatment,
                'severity': disease.severity,
                'category': disease.category
            })
        
        return jsonify({'diseases': disease_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vaccination-schedule', methods=['GET'])
def get_vaccination_schedule():
    try:
        age_group = request.args.get('age_group')
        country = request.args.get('country', 'India')
        
        query = VaccinationSchedule.query.filter_by(country=country)
        if age_group:
            query = query.filter_by(age_group=age_group)
        
        schedules = query.all()
        schedule_list = []
        
        for schedule in schedules:
            schedule_list.append({
                'id': schedule.id,
                'age_group': schedule.age_group,
                'vaccine_name': schedule.vaccine_name,
                'description': schedule.description,
                'is_mandatory': schedule.is_mandatory
            })
        
        return jsonify({'schedules': schedule_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/outbreak-alerts', methods=['GET'])
def get_outbreak_alerts():
    try:
        alerts = OutbreakAlert.query.filter_by(is_active=True).all()
        alert_list = []
        
        for alert in alerts:
            alert_list.append({
                'id': alert.id,
                'disease_name': alert.disease_name,
                'location': alert.location,
                'severity': alert.severity,
                'description': alert.description,
                'alert_date': alert.alert_date.isoformat()
            })
        
        return jsonify({'alerts': alert_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export-data', methods=['GET'])
@jwt_required()
def export_data():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's chat history
        chat_history = ChatHistory.query.filter_by(user_id=user_id).all()
        
        # Create Excel file
        output = BytesIO()
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet('Chat History')
        
        # Headers
        headers = ['Timestamp', 'Message', 'Response', 'Language']
        for col, header in enumerate(headers):
            worksheet.write(0, col, header)
        
        # Data
        for row, chat in enumerate(chat_history, 1):
            worksheet.write(row, 0, chat.timestamp.strftime('%Y-%m-%d %H:%M:%S'))
            worksheet.write(row, 1, chat.message)
            worksheet.write(row, 2, chat.response)
            worksheet.write(row, 3, chat.language)
        
        workbook.close()
        output.seek(0)
        
        # Convert to base64
        excel_data = base64.b64encode(output.getvalue()).decode()
        
        return jsonify({
            'excel_data': excel_data,
            'filename': f'health_chat_history_{user.username}_{datetime.now().strftime("%Y%m%d")}.xlsx'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone,
            'age': user.age,
            'gender': user.gender,
            'location': user.location,
            'preferred_language': user.preferred_language,
            'created_at': user.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update user fields
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'age' in data:
            user.age = data['age']
        if 'gender' in data:
            user.gender = data['gender']
        if 'location' in data:
            user.location = data['location']
        if 'preferred_language' in data:
            user.preferred_language = data['preferred_language']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reset-database', methods=['POST'])
def reset_database():
    """Reset and reinitialize database with comprehensive disease data."""
    try:
        # Clear existing disease data
        Disease.query.delete()
        VaccinationSchedule.query.delete()
        OutbreakAlert.query.delete()
        
        # Reinitialize with comprehensive data
        initialize_database()
        
        return jsonify({
            'message': 'Database reset successfully with comprehensive disease data',
            'diseases_count': len(disease_data),
            'status': 'success'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database and comprehensive disease data
def initialize_database():
    """Initialize database with comprehensive disease data."""
    try:
        db.create_all()
        
        # Add comprehensive disease data
        if not Disease.query.first():
            print("📚 Adding comprehensive disease database...")
            
            # Add all diseases from the disease_data dictionary
            for disease_name, disease_info in disease_data.items():
                disease = Disease(
                    name=disease_name,
                    symptoms=", ".join(disease_info["symptoms"]),
                    prevention=", ".join(disease_info["prevention"]),
                    treatment=disease_info["treatment"],
                    severity=disease_info["severity"],
                    category=disease_info["category"]
                )
                db.session.add(disease)
            
            # Add comprehensive vaccination schedules
            vaccination_schedules = [
                # Birth to 2 months
                VaccinationSchedule(age_group="Birth", vaccine_name="BCG", 
                                  description="Protects against tuberculosis", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="Birth", vaccine_name="Hepatitis B", 
                                  description="Protects against hepatitis B", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="6 weeks", vaccine_name="DPT-1", 
                                  description="Diphtheria, Pertussis, Tetanus - First dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="6 weeks", vaccine_name="OPV-1", 
                                  description="Oral Polio Vaccine - First dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="6 weeks", vaccine_name="Hib-1", 
                                  description="Haemophilus influenzae type b - First dose", is_mandatory=True, country="India"),
                
                # 2-4 months
                VaccinationSchedule(age_group="10 weeks", vaccine_name="DPT-2", 
                                  description="Diphtheria, Pertussis, Tetanus - Second dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="10 weeks", vaccine_name="OPV-2", 
                                  description="Oral Polio Vaccine - Second dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="10 weeks", vaccine_name="Hib-2", 
                                  description="Haemophilus influenzae type b - Second dose", is_mandatory=True, country="India"),
                
                # 6-9 months
                VaccinationSchedule(age_group="14 weeks", vaccine_name="DPT-3", 
                                  description="Diphtheria, Pertussis, Tetanus - Third dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="14 weeks", vaccine_name="OPV-3", 
                                  description="Oral Polio Vaccine - Third dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="14 weeks", vaccine_name="Hib-3", 
                                  description="Haemophilus influenzae type b - Third dose", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="9 months", vaccine_name="Measles", 
                                  description="Protects against measles", is_mandatory=True, country="India"),
                
                # 12-15 months
                VaccinationSchedule(age_group="12-15 months", vaccine_name="MMR", 
                                  description="Measles, Mumps, Rubella", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="12-15 months", vaccine_name="Chickenpox", 
                                  description="Protects against chickenpox", is_mandatory=False, country="India"),
                
                # 16-24 months
                VaccinationSchedule(age_group="16-24 months", vaccine_name="DPT Booster", 
                                  description="Diphtheria, Pertussis, Tetanus Booster", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="16-24 months", vaccine_name="OPV Booster", 
                                  description="Oral Polio Vaccine Booster", is_mandatory=True, country="India"),
                
                # 5-6 years
                VaccinationSchedule(age_group="5-6 years", vaccine_name="DPT Booster 2", 
                                  description="Diphtheria, Pertussis, Tetanus Second Booster", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="5-6 years", vaccine_name="OPV Booster 2", 
                                  description="Oral Polio Vaccine Second Booster", is_mandatory=True, country="India"),
                
                # 10-12 years
                VaccinationSchedule(age_group="10-12 years", vaccine_name="Tdap", 
                                  description="Tetanus, Diphtheria, Pertussis", is_mandatory=True, country="India"),
                VaccinationSchedule(age_group="10-12 years", vaccine_name="HPV", 
                                  description="Human Papillomavirus (for girls)", is_mandatory=False, country="India"),
                
                # Adults
                VaccinationSchedule(age_group="Adults", vaccine_name="Td Booster", 
                                  description="Tetanus, Diphtheria (every 10 years)", is_mandatory=False, country="India"),
                VaccinationSchedule(age_group="Adults", vaccine_name="Influenza", 
                                  description="Annual flu vaccine", is_mandatory=False, country="India"),
                VaccinationSchedule(age_group="Adults", vaccine_name="COVID-19", 
                                  description="COVID-19 vaccine and boosters", is_mandatory=False, country="India"),
                
                # Elderly (65+)
                VaccinationSchedule(age_group="65+ years", vaccine_name="Pneumococcal", 
                                  description="Protects against pneumonia", is_mandatory=False, country="India"),
                VaccinationSchedule(age_group="65+ years", vaccine_name="Shingles", 
                                  description="Protects against shingles", is_mandatory=False, country="India")
            ]
            
            for vaccine in vaccination_schedules:
                db.session.add(vaccine)
            
            # Add sample outbreak alerts
            outbreak_alerts = [
                OutbreakAlert(disease_name="Dengue Fever", location="Mumbai", severity="High", 
                             description="Increased cases reported in suburban areas. Use mosquito nets and repellents."),
                OutbreakAlert(disease_name="Malaria", location="Rural Maharashtra", severity="Medium", 
                             description="Seasonal increase in malaria cases. Ensure proper mosquito control measures."),
                OutbreakAlert(disease_name="Chikungunya", location="Delhi", severity="Medium", 
                             description="Rising cases in certain districts. Take preventive measures against mosquito bites.")
            ]
            
            for alert in outbreak_alerts:
                db.session.add(alert)
            
            db.session.commit()
            print(f"✅ Added {len(disease_data)} diseases to database")
            print(f"✅ Added {len(vaccination_schedules)} vaccination schedules")
            print(f"✅ Added {len(outbreak_alerts)} outbreak alerts")
            print("✅ Comprehensive health database initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

if __name__ == '__main__':
    with app.app_context():
        initialize_database()
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))

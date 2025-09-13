#!/usr/bin/env python3
"""
HealthBot Setup Test Script
This script tests if all required dependencies and configurations are properly set up.
"""

import sys
import os
import importlib.util

def test_python_version():
    """Test if Python version is compatible."""
    print("🐍 Testing Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.8+")
        return False

def test_required_packages():
    """Test if required Python packages are installed."""
    print("\n📦 Testing required Python packages...")
    required_packages = [
        'flask', 'flask_cors', 'flask_sqlalchemy', 'flask_migrate',
        'flask_jwt_extended', 'flask_bcrypt', 'google.generativeai',
        'pandas', 'openpyxl', 'python_dotenv', 'requests', 'nltk',
        'scikit_learn', 'numpy', 'gunicorn'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            if package == 'google.generativeai':
                import google.generativeai as genai
            elif package == 'flask_cors':
                import flask_cors
            elif package == 'flask_sqlalchemy':
                import flask_sqlalchemy
            elif package == 'flask_migrate':
                import flask_migrate
            elif package == 'flask_jwt_extended':
                import flask_jwt_extended
            elif package == 'flask_bcrypt':
                import flask_bcrypt
            elif package == 'python_dotenv':
                import dotenv
            elif package == 'scikit_learn':
                import sklearn
            else:
                __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - Not installed")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All required packages are installed")
        return True

def test_environment_file():
    """Test if environment file exists and has required variables."""
    print("\n🔧 Testing environment configuration...")
    
    if not os.path.exists('.env'):
        print("❌ .env file not found")
        print("Please copy env.example to .env and configure your settings")
        return False
    
    print("✅ .env file exists")
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = ['GEMINI_API_KEY', 'JWT_SECRET_KEY']
        missing_vars = []
        
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
            return False
        else:
            print("✅ Required environment variables are set")
            return True
            
    except Exception as e:
        print(f"❌ Error loading environment: {e}")
        return False

def test_database_connection():
    """Test database connection."""
    print("\n🗄️  Testing database connection...")
    
    try:
        from app import app, db
        with app.app_context():
            # Try to create a simple query
            db.engine.execute('SELECT 1')
            print("✅ Database connection successful")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_gemini_api():
    """Test Gemini API connection."""
    print("\n🤖 Testing Gemini API connection...")
    
    try:
        import google.generativeai as genai
        api_key = os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            print("❌ GEMINI_API_KEY not found in environment")
            return False
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Test with a simple prompt
        response = model.generate_content("Hello")
        if response.text:
            print("✅ Gemini API connection successful")
            return True
        else:
            print("❌ Gemini API returned empty response")
            return False
            
    except Exception as e:
        print(f"❌ Gemini API connection failed: {e}")
        return False

def test_node_js():
    """Test if Node.js is available."""
    print("\n🟢 Testing Node.js availability...")
    
    try:
        import subprocess
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Node.js {version} is available")
            return True
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found in PATH")
        return False
    except Exception as e:
        print(f"❌ Error checking Node.js: {e}")
        return False

def test_client_dependencies():
    """Test if client dependencies are installed."""
    print("\n📱 Testing client dependencies...")
    
    client_package_json = 'client/package.json'
    client_node_modules = 'client/node_modules'
    
    if not os.path.exists(client_package_json):
        print("❌ client/package.json not found")
        return False
    
    if not os.path.exists(client_node_modules):
        print("❌ client/node_modules not found")
        print("Run: cd client && npm install")
        return False
    
    print("✅ Client dependencies are installed")
    return True

def main():
    """Main test function."""
    print("🏥 HealthBot Setup Test")
    print("=" * 50)
    
    tests = [
        test_python_version,
        test_required_packages,
        test_environment_file,
        test_database_connection,
        test_gemini_api,
        test_node_js,
        test_client_dependencies
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! HealthBot is ready to run.")
        print("\nTo start the application:")
        print("1. Run: python run.py (for backend)")
        print("2. Run: cd client && npm start (for frontend)")
        print("3. Or use: start.bat (Windows) or ./start.sh (Linux/Mac)")
    else:
        print("⚠️  Some tests failed. Please fix the issues above before running HealthBot.")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())

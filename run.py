#!/usr/bin/env python3
"""
HealthBot Application Launcher
This script initializes the database and starts the Flask application.
"""

import os
import sys
from app import app, db

def create_tables():
    """Create database tables if they don't exist."""
    try:
        with app.app_context():
            db.create_all()
            print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        sys.exit(1)

def check_environment():
    """Check if required environment variables are set."""
    required_vars = ['GEMINI_API_KEY', 'JWT_SECRET_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease create a .env file with the required variables.")
        print("You can copy env.example to .env and fill in the values.")
        sys.exit(1)
    
    print("✅ Environment variables check passed!")

def main():
    """Main function to start the application."""
    print("🏥 Starting HealthBot Application...")
    print("=" * 50)
    
    # Check environment
    check_environment()
    
    # Create database tables
    create_tables()
    
    # Start the application
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Debug mode: {'ON' if debug else 'OFF'}")
    print("=" * 50)
    
    try:
        app.run(
            host='0.0.0.0',
            port=port,
            debug=debug
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down HealthBot...")
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

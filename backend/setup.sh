#!/bin/bash

# Backend Setup Script for Event Planner
# This script sets up the backend environment, installs dependencies,
# initializes the database, and creates the admin user.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_info "Starting backend setup for Event Planner..."
echo ""

# Check Python version
print_info "Checking Python version..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
print_success "Python 3 found: $(python3 --version)"
echo ""

# Check if .env file exists
print_info "Checking for .env file..."
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cat > .env << EOF
# Email Configuration
MAIL_USERNAME=noreplyeventplanner1@gmail.com
MAIL_PASSWORD=wgjvzmlqkznveorl
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587

# Application Configuration
SECRET_KEY=change-me-in-production
JWT_SECRET_KEY=change-me-in-production-too
FLASK_ENV=development

# Database
DATABASE_URL=sqlite:///event_planner.db

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@garissaeventplanner.com
ADMIN_PASSWORD=Admin@123456
EOF
    print_success ".env file created with default configuration."
    echo ""
else
    print_info ".env file already exists."
    echo ""
fi

# Create virtual environment if it doesn't exist
print_info "Setting up virtual environment..."
if [ ! -d "venv" ]; then
    print_info "Creating virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created."
else
    print_info "Virtual environment already exists."
fi
echo ""

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated."
echo ""

# Upgrade pip
print_info "Upgrading pip..."
pip install --upgrade pip --quiet
print_success "pip upgraded."
echo ""

# Install dependencies
print_info "Installing dependencies from requirements.txt..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_success "Dependencies installed."
else
    print_error "requirements.txt not found!"
    exit 1
fi
echo ""

# Install development dependencies if file exists
if [ -f "requirements-dev.txt" ]; then
    print_info "Installing development dependencies..."
    pip install -r requirements-dev.txt
    print_success "Development dependencies installed."
    echo ""
fi

# Initialize database
print_info "Initializing database..."
if python3 -m flask --app run init-db 2>/dev/null; then
    print_success "Database initialized."
else
    print_warning "Database initialization command failed. This might be normal if the database already exists."
fi
echo ""

# Create admin user
print_info "Creating admin user..."
if python3 -m flask --app run create-admin 2>/dev/null; then
    print_success "Admin user created/verified."
else
    print_warning "Admin user creation failed. You may need to run this manually: flask --app run create-admin"
fi
echo ""

# Summary
print_success "Backend setup completed!"
echo ""
print_info "Next steps:"
echo "  1. Review and update the .env file with your actual configuration"
echo "  2. Activate the virtual environment: source venv/bin/activate"
echo "  3. Run the server: python3 run.py"
echo "     Or use Flask CLI: flask --app run run"
echo ""
print_info "The server will be available at: http://localhost:5000"
echo ""


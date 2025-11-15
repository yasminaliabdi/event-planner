#!/usr/bin/env python3
"""Test script to verify email configuration."""

from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage

# Load environment variables
load_dotenv()

# Get email configuration
username = os.environ.get("MAIL_USERNAME")
password = os.environ.get("MAIL_PASSWORD")
host = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
port = int(os.environ.get("MAIL_PORT", 587))

print("=" * 60)
print("Email Configuration Test")
print("=" * 60)
print(f"Username: {username}")
print(f"Password: {'*' * len(password) if password else 'NOT SET'}")
print(f"Server: {host}")
print(f"Port: {port}")
print("=" * 60)

if not username or not password:
    print("\n❌ ERROR: Email credentials not configured in .env file")
    print("Please check your .env file in the backend directory.")
    exit(1)

# Test email sending
test_recipient = input("\nEnter your email address to test: ").strip()

if not test_recipient:
    print("No email address provided. Exiting.")
    exit(1)

message = EmailMessage()
message["Subject"] = "Test Email - Garissa Event Planner"
message["From"] = username
message["To"] = test_recipient
message.set_content("This is a test email from Garissa Event Planner. If you receive this, email configuration is working correctly!")

print(f"\nAttempting to send test email to {test_recipient}...")

try:
    with smtplib.SMTP(host, port, timeout=10) as server:
        print("✓ SMTP connection established")
        server.starttls()
        print("✓ TLS started")
        server.login(username, password)
        print("✓ SMTP login successful")
        server.send_message(message)
        print(f"✓ Email sent successfully to {test_recipient}")
        print("\n✅ SUCCESS! Check your inbox (and spam folder) for the test email.")
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ SMTP Authentication failed: {e}")
    print("\nPossible issues:")
    print("1. The app password might be incorrect")
    print("2. Gmail might require 'Less secure app access' (deprecated)")
    print("3. You might need to enable 2-Step Verification and use an App Password")
    print("4. Check if the email account has 2FA enabled and use an App Password")
except smtplib.SMTPException as e:
    print(f"\n❌ SMTP error: {e}")
except Exception as e:
    print(f"\n❌ Error: {e}")


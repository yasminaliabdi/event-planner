from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from flask import current_app

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_email(subject: str, recipient: str, body: str) -> None:
        username = current_app.config.get("MAIL_USERNAME")
        password = current_app.config.get("MAIL_PASSWORD")
        
        # Debug logging
        logger.info("Email service - Username configured: %s", bool(username))
        logger.info("Email service - Password configured: %s", bool(password))
        
        if not username or not password:
            # In development, log the email content instead of sending
            logger.warning("Email credentials not configured; skipping email send.")
            logger.info("=" * 60)
            logger.info("DEVELOPMENT MODE - Email would be sent:")
            logger.info(f"To: {recipient}")
            logger.info(f"Subject: {subject}")
            logger.info(f"Body:\n{body}")
            logger.info("=" * 60)
            # Force output to console immediately
            import sys
            message = f"""
{'=' * 60}
DEVELOPMENT MODE - Email would be sent:
To: {recipient}
Subject: {subject}
Body:
{body}
{'=' * 60}
"""
            print(message, flush=True)
            sys.stdout.flush()
            return

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = username
        message["To"] = recipient
        message.set_content(body)

        host = current_app.config.get("MAIL_SERVER", "smtp.gmail.com")
        port = current_app.config.get("MAIL_PORT", 587)

        logger.info("Attempting to send email via %s:%s to %s", host, port, recipient)
        
        try:
            with smtplib.SMTP(host, port, timeout=10) as server:
                logger.info("SMTP connection established")
                server.starttls()
                logger.info("TLS started")
                server.login(username, password)
                logger.info("SMTP login successful")
                server.send_message(message)
                logger.info("Email sent successfully to %s", recipient)
                print(f"\n✓ Email sent successfully to {recipient}\n", flush=True)
        except smtplib.SMTPAuthenticationError as e:
            error_msg = f"SMTP Authentication failed: {str(e)}"
            logger.error(error_msg)
            print(f"\n✗ {error_msg}\n", flush=True)
            raise
        except smtplib.SMTPException as e:
            error_msg = f"SMTP error: {str(e)}"
            logger.error(error_msg)
            print(f"\n✗ {error_msg}\n", flush=True)
            raise
        except Exception as e:  # pragma: no cover - depends on external service
            error_msg = f"Failed to send email to {recipient}: {str(e)}"
            logger.exception(error_msg)
            print(f"\n✗ {error_msg}\n", flush=True)
            raise

    @classmethod
    def send_otp(cls, email: str, otp_code: str) -> None:
        subject = "Your Garissa Event Planner verification code"
        body = (
            f"Hello,\n\nYour verification code is {otp_code}. "
            "It will expire in 10 minutes.\n\nBest regards,\nGarissa Event Planner Team"
        )
        cls.send_email(subject, email, body)

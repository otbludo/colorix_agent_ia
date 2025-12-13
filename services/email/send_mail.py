import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from fastapi import HTTPException
from services.email.model import Model

load_dotenv()

async def send_email(subject: str, html_content: str, recipient_email: str):

    from_email = os.getenv("EMAIL_SENDER")
    password = os.getenv("EMAIL_PASSWORD")

    if not from_email or not password:
        raise HTTPException(status_code=500, detail="EMAIL_SENDER ou EMAIL_PASSWORD non configuré")

    # Créer le message HTML
    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = recipient_email

    try:
        print("📨 Tentative de connexion au SMTP...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        print("🔐 Tentative de login...")
        server.login(from_email, password)

        print("✉️ Envoi de l'email...")
        server.sendmail(from_email, recipient_email, msg.as_string())

        server.quit()
        print("✅ Email envoyé avec succès !")

    except Exception as e:
        print("❌ ERREUR SMTP :", e)
        raise HTTPException(status_code=500, detail=f"Erreur SMTP : {e}")
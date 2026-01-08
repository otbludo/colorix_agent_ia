import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from fastapi import HTTPException

load_dotenv()

async def send_email(subject: str, html_content: str, recipient_email: str, pdf_path: str = None):
    from_email = os.getenv("EMAIL_SENDER")
    password = os.getenv("EMAIL_PASSWORD")

    if not from_email or not password:
        raise HTTPException(status_code=500, detail="Configuration email manquante")

    # Créer un message multi-parties
    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = recipient_email

    # Attacher le corps HTML
    msg.attach(MIMEText(html_content, "html"))

    # Attacher le PDF si présent
    if pdf_path and os.path.exists(pdf_path):
        try:
            with open(pdf_path, "rb") as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            filename = os.path.basename(pdf_path)
            part.add_header("Content-Disposition", f"attachment; filename={filename}")
            msg.attach(part)
        except Exception as e:
            print(f"❌ Erreur lors de l'attachement du PDF : {e}")

    try:
        print("📨 Tentative de connexion au SMTP...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        print("🔐 Tentative de login...")
        server.login(from_email, password)
        print("✉️ Envoi de l'email...")
        server.sendmail(from_email, recipient_email, msg.as_string())
        server.quit()
        print(f"✅ Email avec PDF envoyé à {recipient_email}")
    except Exception as e:
        print("❌ ERREUR SMTP :", e)
        raise HTTPException(status_code=500, detail=f"Erreur SMTP : {e}")
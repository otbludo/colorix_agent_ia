import os
from fpdf import FPDF
from datetime import datetime


def generate_invoice_pdf(devis):
    try:
        output_dir = "invoices"
        os.makedirs(output_dir, exist_ok=True)

        pdf_filename = (
            f"facture_{devis['id']}_"
            f"{devis['name_customer'].replace(' ', '_')}.pdf"
        )
        full_path = os.path.join(output_dir, pdf_filename)

        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # =========================
        # COULEURS
        # =========================
        PRIMARY = (40, 90, 160)
        LIGHT_GRAY = (240, 240, 240)
        DARK_GRAY = (80, 80, 80)

        # =========================
        # HEADER
        # =========================
        pdf.set_fill_color(*PRIMARY)
        pdf.rect(0, 0, 210, 30, "F")

        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Helvetica", "B", 18)
        pdf.cell(0, 18, "FACTURE PRO FORMA", 0, 1, "C")

        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 8, f"Référence devis : {devis['id']}", 0, 1, "C")

        pdf.ln(10)
        pdf.set_text_color(0, 0, 0)

        # =========================
        # INFOS CLIENT
        # =========================
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 8, "Informations Client", 0, 1)

        pdf.set_fill_color(*LIGHT_GRAY)
        pdf.rect(10, pdf.get_y(), 190, 26, "F")

        pdf.ln(3)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, f"Client : {devis['name_customer']} {devis['first_name_customer']}", 0, 1)
        pdf.cell(0, 6, f"Email  : {devis['email_customer']}", 0, 1)
        pdf.cell(0, 6, f"Date   : {datetime.now().strftime('%d/%m/%Y')}", 0, 1)

        pdf.ln(10)

        # =========================
        # TABLEAU PRODUIT
        # =========================
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_fill_color(*PRIMARY)
        pdf.set_text_color(255, 255, 255)

        widths = [70, 15, 30, 25, 40]
        headers = ["Produit", "Qté", "Prix HT", "Taux", "Total HT"]

        for i, h in enumerate(headers):
            pdf.cell(widths[i], 8, h, 1, 0, "C", fill=True)
        pdf.ln()

        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Helvetica", "", 10)

        pdf.cell(widths[0], 8, devis["name_product"], 1)
        pdf.cell(widths[1], 8, str(devis["quantity"]), 1, 0, "C")
        pdf.cell(widths[2], 8, f"{devis['prix_base']:.2f}", 1, 0, "R")
        pdf.cell(widths[3], 8, f"{devis['taux_applique']:.2f}%", 1, 0, "R")
        pdf.cell(widths[4], 8, f"{devis['price_taux']:.2f}", 1, 1, "R")

        pdf.ln(12)

        # =========================
        # RÉCAPITULATIF
        # =========================
        pdf.set_x(110)
        pdf.set_fill_color(*LIGHT_GRAY)
        pdf.rect(110, pdf.get_y(), 90, 32, "F")

        pdf.ln(2)
        pdf.set_x(112)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(40, 8, "Sous-total HT :", 0, 0)
        pdf.cell(38, 8, f"{devis['price_taux']:.2f} FCFA", 0, 1, "R")

        pdf.set_x(112)
        pdf.cell(40, 8, f"TVA ({devis['tva']*100:.0f}%) :", 0, 0)
        pdf.cell(38, 8, f"{devis['montant_tva']:.2f} FCFA", 0, 1, "R")

        pdf.set_x(112)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(*PRIMARY)
        pdf.cell(40, 10, "TOTAL TTC :", 0, 0)
        pdf.cell(38, 10, f"{devis['montant_ttc']:.2f} FCFA", 0, 1, "R")

        pdf.set_text_color(0, 0, 0)

        # =========================
        # FOOTER
        # =========================
        pdf.set_y(-25)
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(*DARK_GRAY)
        pdf.cell(0, 6, "Merci pour votre confiance.", 0, 1, "C")
        pdf.cell(0, 6, "Ce document est généré automatiquement.", 0, 1, "C")

        pdf.output(full_path)
        return full_path

    except Exception as e:
        print("Erreur PDF :", e)
        return None

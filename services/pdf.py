import os
from fpdf import FPDF
from datetime import datetime

def generate_invoice_pdf(devis):
    try:
        output_dir = "invoices"
        os.makedirs(output_dir, exist_ok=True)

        pdf_filename = f"facture_{devis['id']}_{devis['name_customer'].replace(' ', '_')}.pdf"
        full_path = os.path.join(output_dir, pdf_filename)

        # Utilisation du format A4
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # 1. ARRIÈRE-PLAN (Papier en-tête avec logo et footer)
        background_path = "assets/Background_facture.png"
        if os.path.exists(background_path):
            pdf.image(background_path, x=0, y=0, w=210, h=297)

        # 2. TITRE ET RÉFÉRENCE (Positionné à droite comme sur l'image)
        pdf.set_y(35)
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(100, 100, 100) # Gris
        pdf.cell(120) # Décalage à droite
        pdf.cell(60, 10, "PROFORMA", 0, 1, "R")
        
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(120)
        pdf.cell(60, 5, f"NUMBER : 001-{devis['id']}-{datetime.now().strftime('%d%m%y')}-RN-DA", 0, 1, "R")
        pdf.cell(120)
        pdf.cell(60, 5, f"DATE : {datetime.now().strftime('%A %d %B %Y')}", 0, 1, "R")

        # 3. INFOS CLIENT (Positionné à gauche)
        pdf.set_y(65)
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 5, f"{devis['name_customer']} {devis['first_name_customer']}", 0, 1)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 5, f"Email : {devis['email_customer']}", 0, 1)
        
        pdf.ln(10)
        pdf.multi_cell(0, 5, "Nous vous remercions de votre demande de prix et avons le plaisir de vous soumettre la proforma suivante :")
        pdf.ln(5)

        # 4. TABLEAU (Style spécifique Colorix)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(220, 220, 220) # Gris clair pour l'entête tableau
        
        # Colonnes : REF, DESCRIPTION, Quantité, Prix Unitaire, PT (XAF)
        widths = [15, 95, 20, 30, 30]
        headers = ["REF", "DESCRIPTION", "Quantité", "Prix Unitaire", "PT (XAF)"]
        
        for i, h in enumerate(headers):
            pdf.cell(widths[i], 7, h, 1, 0, "C", fill=True)
        pdf.ln()

        pdf.set_font("Helvetica", "", 9)
        # Ligne de contenu
        start_y_table = pdf.get_y()
        pdf.cell(widths[0], 40, "BRO", 1, 0, "C")
        
        # Multi-cell pour la description longue
        x, y = pdf.get_x(), pdf.get_y()
        pdf.multi_cell(widths[1], 5, f"{devis['name_product']}\n{devis['description_devis']}", 1, "L")
        pdf.set_xy(x + widths[1], y)
        
        pdf.cell(widths[2], 40, str(devis["quantity"]), 1, 0, "C")
        pdf.cell(widths[3], 40, f"{devis['prix_base']:,.0f}", 1, 0, "C")
        pdf.cell(widths[4], 40, f"{devis['price_taux']:,.0f}", 1, 1, "C")

        # 5. RÉCAPITULATIF FINANCIER (Aligné sur la colonne de droite)
        pdf.set_x(10 + widths[0] + widths[1] + widths[2])
        pdf.set_font("Helvetica", "B", 9)
        
        totals = [
            ("TOTAL HT", devis['price_taux']),
            ("TVA 19,25 %", devis['montant_tva']),
            ("TOTAL TTC", devis['montant_ttc'])
        ]
        
        for label, value in totals:
            pdf.set_x(130)
            pdf.cell(40, 7, label, 1, 0, "R")
            pdf.cell(30, 7, f"{value:,.0f}", 1, 1, "C")

        # 6. MOYENS DE PAIEMENT & SIGNATURE
        pdf.ln(10)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(0, 5, "Moyens de paiements:", 0, 1)
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 4, "1. Espèces", 0, 1)
        pdf.cell(0, 4, "2. Orange Money / Mobile Money", 0, 1)
        pdf.cell(0, 4, f"3. Virement bancaire à l'ordre de Colorix SARL", 0, 1)
        
        # Bloc Signature (à gauche)
        pdf.set_y(pdf.get_y() - 10)
        pdf.set_x(30)
        pdf.set_font("Helvetica", "I", 10)
        # Espace pour le tampon/signature comme sur la photo
        pdf.ln(15)
        pdf.cell(60, 5, "Kamdem Stephane", 0, 0, "C")

        # 7. ARRÊTÉ DE LA SOMME
        pdf.set_y(230)
        pdf.set_font("Helvetica", "B", 9)
        pdf.multi_cell(0, 5, f"Arrêté la présente Proforma à la somme de : {devis['montant_ttc']:,.0f} CFA-TTC")

        # Sauvegarde
        pdf.output(full_path)
        return full_path

    except Exception as e:
        print(f"Erreur lors de la génération du PDF : {e}")
        return None
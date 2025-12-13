class Model:
    @staticmethod
    def html_update_template(subject: str, content: str):
        return f"""
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>{subject}</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }}
                .container {{
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    max-width: 550px;
                    margin: auto;
                }}
                a {{
                    display: block;
                    margin-top: 15px;
                    font-size: 18px;
                    color: #0066ff;
                    text-decoration: none;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>{subject}</h2>
                <p>{content}</p>
            </div>
        </body>
        </html>
        """
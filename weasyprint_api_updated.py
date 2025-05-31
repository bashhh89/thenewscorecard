from flask import Flask, request, send_file
import weasyprint
import tempfile
import os

app = Flask(__name__)

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    
    # Check if HTML content is provided
    html_content = data.get('html')
    if html_content:
        # Generate PDF from HTML content
        pdf = weasyprint.HTML(string=html_content).write_pdf()
    else:
        # Fallback to URL if no HTML content (for backward compatibility)
        url = data.get('url')
        if not url:
            return {'error': 'Either html or url parameter is required'}, 400
        pdf = weasyprint.HTML(url).write_pdf()
    
    # Write PDF to output file
    with open('output.pdf', 'wb') as f:
        f.write(pdf)
    
    return send_file('output.pdf', as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001) 
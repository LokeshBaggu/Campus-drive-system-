from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        cgpa = float(data.get('cgpa', 0))
        skills_count = int(data.get('skills', 0))
        projects_count = int(data.get('projects', 0))

        # Simple prediction logic
        if cgpa >= 7.5 and skills_count >= 2 and projects_count >= 1:
            eligibility = "Eligible for Placement"
            status_code = 1
        elif cgpa >= 6.5 and (skills_count >= 3 or projects_count >= 2):
            eligibility = "Eligible with conditions (Focus on Aptitude)"
            status_code = 1
        else:
            eligibility = "Not Eligible for Top Tier Placements"
            status_code = 0

        return jsonify({
            'status': 'success',
            'prediction': eligibility,
            'status_code': status_code
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True)

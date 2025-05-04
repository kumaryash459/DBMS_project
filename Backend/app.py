from flask import Flask, request, jsonify
from flask_cors import CORS
from inference import generate_sql_query

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Text-to-SQL API. Use POST /api/text-to-sql to convert text to SQL queries.'}), 200

@app.route('/api/text-to-sql', methods=['POST'])
def text_to_sql():
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'No query provided'}), 400
        
        query = data['query']
        if not isinstance(query, str) or not query.strip():
            return jsonify({'error': 'Invalid query'}), 400

        sql_query = generate_sql_query(query)
        return jsonify({'sql_query': sql_query}), 200

    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
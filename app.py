
from flask import Flask, request, jsonify
from flask_cors import CORS
import fasttext
import pickle
import re
import string

app = Flask(__name__)
CORS(app, resources={r"/index": {"origins": "*"}}) 

fasttext_model = fasttext.load_model('cc.en.300.bin')

with open('model.pkl', 'rb') as model_file:
    your_model = pickle.load(model_file)

def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

@app.route('/index', methods=['POST'])
def index():
    if request.method == 'POST':
        try:
            data = request.get_json()
            user_input = data.get('news', '')
            
           
            preprocessed_input = wordopt(user_input)
            
            vector = fasttext_model.get_sentence_vector(preprocessed_input)
            vector = vector.reshape(1, -1)
            model_output = your_model.predict(vector)

            print("Model output:", model_output)

            
            prediction = int(model_output.item())

            if prediction == 0:
                response_data = {'message': 'false'}
            else:
                response_data = {'message': 'true'}

            return jsonify(response_data)

        except Exception as e:
            print("Error processing request:", str(e))
            response_data = {'error': 'Internal server error'}
            return jsonify(response_data), 500  

if __name__ == '__main__':
    app.run(debug=True)

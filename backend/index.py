from flask import Flask, request, jsonify
import os
import uuid
from flask_cors import CORS  # Import CORS
from werkzeug.utils import secure_filename


from generate_llm_scores import generate_llm_scores
from parser import parser
from dmsa import dmsa

import spacy


app = Flask(__name__)
CORS(app) 

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/api/uploadData",methods=['POST'])
def upload_file():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file"}),400
    
    file = request.files['resume']
    job_description = request.form.get('jobDescription')

    if file.filename == "":
        return jsonify({"error":"No selected resume file"}),400
    
    if file:
        unique_filename = str(uuid.uuid4()) + "_" +secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'],unique_filename)
        file.save(filepath)


    result = run_python_script(filepath, job_description)
    os.remove(filepath)
    return jsonify({"result":result}),200

def run_python_script(filepath,job_description):
    parser(filepath)
    job_description = dmsa(job_description)
    md = generate_llm_scores(job_description,filepath)
    return md
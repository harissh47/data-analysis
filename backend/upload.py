from flask import request, jsonify
import pandas as pd
from db import collection  

def upload():
    try:
        file=request.files['file']
        df=pd.read_csv(file)
        data=df.to_dict('records')
        collection.insert_many(data)
        return jsonify({'message': 'File uploaded successfully','records':len(data)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
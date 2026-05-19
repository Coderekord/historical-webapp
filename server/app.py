from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)


def dani_u_mjesecu(month, year):
    if month==2:
        if(year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)):
            return 29
        return 28        
    elif month in [4, 6, 9, 11]:
        return 30
    else:
        return 31        
@app.route('/random-brojevi', methods=['GET'])
def random_brojevi():
    year = random.randint(1900,2025)
    month = random.randint(1,12)
    day = random.randint(1,dani_u_mjesecu(month, year))
    return jsonify({
        'year': year,
        'month': month,
        'day': day
    })
if __name__ == '__main__':
    app.run(debug=False, port=8000)
    
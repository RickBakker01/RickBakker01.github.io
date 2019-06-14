import sqlite3
from io import StringIO, BytesIO
from base64 import b64encode
import json
import torch
from PIL import Image
from flask import Flask, send_file, jsonify, request
from flask_cors import CORS
# from omniart_eye_dataset import OmniArtEyeDataset, OA_DATASET_COLOR_25x25
# from omniart_eye_generator import generate_eye, classes, generate_noise, eye_generator
import random
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
import random
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

ds = ImageFolder(root='./Colours')
df = pd.read_csv('Final.csv', index_col = 'Omni_ID')
indices1 = [range(47)]
indices2 = [range(48, 95)]
i = 0

def get_encoded_real_eyes(count):
    global i
    total_eyes = []
    # length = len(ds)
    ids = []
    i += 1
    while len(total_eyes) < count:
        if i%2==0:
            index = random.choice(range(47))
            while True:
                if index in ids:
                    index = random.choice(range(47))
                    continue
                else:
                    break
            ids.append(index)
        else:
            index = random.choice(range(48, 95))
            while True:
                if index in ids:
                    index = random.choice(range(48, 95))
                    continue
                else:
                    break
            ids.append(index)
        # print(indices)

        image, color = ds[index]
        omni_id = os.path.basename(ds.samples[index][0]).split('.')[0][:-2]

        sentiment = df.loc[int(omni_id)]['Dominant_sentiment']

        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        b64_image = b64encode(buffered.getvalue()).decode('utf-8')
        total_eyes.append({'image': b64_image, 'sentiment': sentiment, 'colour': '-', 'omni_id': omni_id})
    print(i, ids)
    return total_eyes[:count]


@app.route("/load_real_eyes")
def load_real_eyes():
    eyes = get_encoded_real_eyes(5)

    return jsonify(eyes)


@app.route("/evaluation_sample")
def sample_for_eval():
    real_eyes = get_encoded_real_eyes(8)

    eyes = real_eyes
    random.shuffle(eyes)
    return jsonify(eyes)


@app.route("/add_result", methods=["POST"])
def add_result():
    db = sqlite3.connect('./results.db');
    cursor = db.cursor()

    cursor.execute('''create table if not exists results
(
    id          integer
            constraint results_pk
            primary key autoincrement,
    colour       text,
    sentiment text,
    omni_id text
);

''')
    db.commit()

    results = request.get_json()['results']

    data = [((json.dumps(eye['colour']), eye['sentiment'], eye['omni_id'])) for eye in results]
    cursor.executemany('''INSERT INTO results (colour, sentiment, omni_id) VALUES (?, ?, ?)''', data)
    db.commit()
    return ('', 204)


if __name__ == '__main__':
    app.run()


@app.route("/app")
def index_page():
    import requests
    url = 'http://localhost:3000'
    try:
        r = requests.get(url)
    except Exception as e:
        return "proxy service error: " + str(e), 503

    return r.content


# 필수 패키지를 import합니다.

from keras.preprocessing.image import img_to_array
import numpy as np
import flask
import io
from keras.models import load_model
from mpl_toolkits.mplot3d import Axes3D
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt # plotting
import numpy as np # linear algebra
import os # accessing directory structure
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from keras.preprocessing.text import Tokenizer
from flask import request

# Flask 애플리케이션과 Keras 모델을 초기화합니다.
app = flask.Flask(__name__)
model = None
tokenizer = None

#Helper function
def vectorize_sequences(sequences, dimension=10000):
    # 크기가 (len(sequences), dimension))이고 모든 원소가 0인 행렬을 만듭니다
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        results[i, sequence] = 1.  # results[i]에서 특정 인덱스의 위치를 1로 만듭니다
    return results

def remove_values_from_list(the_list, val):
   return [value for value in the_list if value != val]

def load_info():
    global model 
    model = load_model('spoiler_detect_model3.h5')
 
    PATH = os.getcwd() + "/mvdataset"
    df_reviews = pd.read_json(PATH+'/IMDB_reviews.json/IMDB_reviews.json', lines=True).sample(frac=1).reset_index(drop=True)

    review_text = df_reviews.review_text

    max_words = 10000
    global tokenizer
    tokenizer = Tokenizer(num_words=max_words)
    tokenizer.fit_on_texts(review_text)




def predict_text(texts):

    x = remove_values_from_list(tokenizer.texts_to_sequences(texts),None)
    x_t = vectorize_sequences(x)

    # 스포일러 판별 결과를 반환
    return model.predict_classes(x_t)


@app.route("/predict", methods=["POST"])
def predict():
    # view로부터 반환될 데이터 딕셔너리를 초기화합니다.
    data = {"success": False, "predictions": []}
    # 이미지가 엔트포인트에 올바르게 업로드 되었는지 확인하세요
    if flask.request.method == "POST":
        if (request.get_json()):

            data = request.get_json()
            data["predictions"] = []
            reviews = data.get("reviews",None)
            
            review_list = reviews.split('\n')
            #예측한 결과를 prds에 넣는다

            preds = predict_text(review_list)

            for i in range(len(preds)):
                #각각의 결과는 배열 안에 있으므로 0 index를 참조한다. ex) preds = [[0],[1],[1]]
                if(preds[i][0] == 1):
                    data["predictions"].append({"spoiler":review_list[i]})
            data["success"] = True
            print(data)

    # JSON 형식으로 데이터 딕셔너리를 반환합니다.
    return flask.jsonify(data)

    # 실행에서 메인 쓰레드인 경우, 먼저 모델을 불러온 뒤 서버를 시작합니다.
if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
        "please wait until server has fully started"))
    load_info()
    host_addr = "192.168.0.90"
    port_num = "24"
    app.run(host=host_addr, port=port_num)




import cv2
from pyzbar import pyzbar
import mysql.connector
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_stage"
)
cursor = db.cursor()


class BarcodeScanner:

    def __init__(self, image_path):
        self.image_path = image_path

    def scan_and_decode(self):
        image = cv2.imread(self.image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        thresholded = cv2.adaptiveThreshold(blurred,
                                            255,
                                            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                            cv2.THRESH_BINARY,
                                            11,
                                            2)
        barcodes = pyzbar.decode(thresholded)

        for barcode in barcodes:
            (x, y, w, h) = barcode.rect
            cv2.rectangle(image,
                          (x, y),
                          (x + w, y + h),
                          (0, 255, 0),
                          2)
            barcode_data = barcode.data.decode("utf-8")
            barcode_type = barcode.type
            text = f"{barcode_data} ({barcode_type})"
            cv2.putText(image,
                        text,
                        (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 0),
                        2)
            print("Barcode Type:", barcode_type)
            print("Barcode Data:", barcode_data)
            cv2.imshow("Image", image)
            cv2.waitKey(0)
            cv2.destroyAllWindows()

        if barcodes:
            barcode_data = barcodes[0].data.decode("utf-8")
            barcode_type = barcodes[0].type
            return {"barcode_data": barcode_data, "barcode_type": barcode_type}
        else:
            return None


@app.route('/')
def index():
    return render_template('HTML.html')


@app.route('/process_image', methods=['POST'])
def process_image():
    barcode_image = request.files['image']
    image_path = 'C:\\ProjetRoufa\\Imageprocessing\\data\\ea.jpg'
    barcode_image.save(image_path)
    scanner = BarcodeScanner(image_path)
    result = scanner.scan_and_decode()

    if result:
        barcode_data = result['barcode_data']
        barcode_type = result['barcode_type']
        cursor.execute(
            "SELECT * FROM article"
            "WHERE barcode_data = %s AND"
            "barcode_type = %s",
         (barcode_data, barcode_type))
        article = cursor.fetchone()

        if article:
            article_name = article[1]
            article_description = article[2]
            return jsonify({"name": article_name,
                            "description": article_description})
        else:
            return jsonify({"barcode_data": barcode_data,
                            "barcode_type": barcode_type})
    else:
        return jsonify({"error": "Barcode not detected"})


@app.route('/add_article', methods=['POST'])
def add_article():
    data = request.json
    article_name = data['name']
    article_description = data['description']
    barcode_data = data['barcodeData']
    barcode_type = data['barcodeType']
    cursor.execute(
        "INSERT INTO article"
        "(name,description, barcode_data, barcode_type)"
        "VALUES (%s, %s, %s, %s)",
        (article_name, article_description,
         barcode_data, barcode_type))
    db.commit()

    return jsonify({"message": "Article added successfully"})


@app.route('/list_articles', methods=['GET'])
def list_articles():
    cursor.execute("SELECT * FROM article")
    articles = cursor.fetchall()
    article_list = []

    for article in articles:
        article_data = {
            "id": article[0],
            "name": article[1],
            "description": article[2],
            "barcode_data": article[3],
            "barcode_type": article[4]
        }
        article_list.append(article_data)

    return jsonify(article_list)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

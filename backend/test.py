#Text Extractor

from paddleocr import PaddleOCR
import re

ocr = PaddleOCR(use_angle_cls=True, lang='en')

image_path = "C:\\Users\\User\\Downloads\\07.jpg"


known_laptop_brands = ["Apple", "Dell", "HP", "Lenovo", "Acer","Asus", "Msi"]
brand = ''


result = ocr.ocr(image_path, cls=True)
print(result)

for line in result[0]:
    detected_text = line[1][0]
    print(detected_text)


    for brand_name in known_laptop_brands:
        if re.search(r'\b' + re.escape(brand_name) + r'\b', detected_text, re.IGNORECASE):
            brand = brand_name
            break
    if brand:
        break

if brand:
    print("Brand found:", brand)
else:
    print("Brand not found.")
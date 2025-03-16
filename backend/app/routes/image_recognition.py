import base64
import os
import io
import json
import torch
import re
import cv2
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel
from torchvision import models, transforms
from PIL import Image
import numpy as np
from paddleocr import PaddleOCR

from app.dependencies.response_handler import ResponseHandler, get_response_handler
from app.models import Product


router = APIRouter()

# Directory for saved models
MODEL_DIR = "C:\\Users\\User\\.cache\\torch\\hub\\checkpoints"
os.makedirs(MODEL_DIR, exist_ok=True)


# Load pre-trained models
def load_models():
    # Define model paths
    object_model_path = os.path.join(MODEL_DIR, "resnet50_model.pth")
    brand_model_path = os.path.join(MODEL_DIR, "resnet34_model.pth")

    # Check if models exist on disk, if not download and save
    if os.path.exists(object_model_path):
        print("Loading object detection model from disk...")
        model = models.resnet50(pretrained=False)
        model.load_state_dict(torch.load(object_model_path))
    else:
        print("Downloading object detection model...")
        model = models.resnet50(pretrained=True)
        # Save the model for future use
        torch.save(model.state_dict(), object_model_path)

    if os.path.exists(brand_model_path):
        print("Loading brand recognition model from disk...")
        brand_model = models.resnet34(pretrained=False)
        brand_model.load_state_dict(torch.load(brand_model_path))
    else:
        print("Downloading brand recognition model...")
        brand_model = models.resnet34(pretrained=True)
        # Save the model for future use
        torch.save(brand_model.state_dict(), brand_model_path)

    # Set models to evaluation mode
    model.eval()
    brand_model.eval()

    # Load ImageNet class labels
    imagenet_path = os.path.join(MODEL_DIR, "imagenet_classes.json")
    if os.path.exists(imagenet_path):
        with open(imagenet_path, "r") as f:
            class_idx = json.load(f)
    else:
        # If running for the first time, create the file
        if not os.path.exists("imagenet_classes.json"):
            raise FileNotFoundError("imagenet_classes.json not found. Please create this file first.")

        # Copy the file to the models directory
        with open("imagenet_classes.json", "r") as src, open(imagenet_path, "w") as dst:
            class_idx = json.load(src)
            json.dump(class_idx, dst)

    return model, class_idx, brand_model,


# Initialize models
model, class_idx, brand_model = load_models()
ocr = PaddleOCR(use_angle_cls=True, lang='en')


# Image preprocessing
def preprocess_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    image = Image.open(io.BytesIO(image_bytes))
    image_tensor = transform(image).unsqueeze(0)
    return image_tensor, image


# Predict object class
def predict_object(image_tensor):
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted = outputs.max(1)

        # Get top 5 predictions
        percentage = torch.nn.functional.softmax(outputs, dim=1)[0] * 100
        _, indices = torch.sort(outputs, descending=True)
        top5_idx = [(idx.item(), percentage[idx].item()) for idx in indices[0][:5]]

        # Map to class names
        results = [(class_idx[str(idx)], score) for idx, score in top5_idx]

        return results


def predict_brand(img):
    try:
        known_laptop_brands = ["Apple", "Dell", "HP", "Lenovo", "Acer", "Asus", "MSI", "Samsung"]
        brand = "Unknown"

        result = ocr.ocr(img, cls=True)

        for line in result[0]:
            detected_text = line[1][0]

            for brand_name in known_laptop_brands:
                if re.search(r'\b' + re.escape(brand_name) + r'\b', detected_text, re.IGNORECASE):
                    brand = brand_name
                    break
            if brand:
                break

        return brand
    except Exception as e:
        print(e)
        return "Unknown"


# Map object classes to product categories
def map_object_to_category(object_name):
    category_mapping = {
        "mouse": "Mouse",
        "computer mouse": "Mouse",
        "laptop": "Laptops",
        "notebook": "Laptops",
        "desktop computer": "Desktops",
        "monitor": "Monitors",
        "keyboard": "Peripherals",
        "headphone": "Audio",
        "printer": "Printers",
        "cellular telephone, cellular phone, cellphone, cell, mobile phone": "Smartphones",
        "joystick": "Gaming Accessories",
        "game controller": "Gaming Accessories",
    }

    # Check for keywords in the object name
    for key, value in category_mapping.items():
        if key in object_name.lower():
            return value

    # Default category if no match found
    return None


# Get related products from MongoDB
async def get_related_products(object_name, brand):
    # Map the object to a product category
    category = map_object_to_category(object_name)

    # Build match stage for aggregation
    match_stage = {}

    # Filter by brand if available
    if brand and brand != "Unknown":
        match_stage["brand"] = {"$regex": f".*{brand}.*", "$options": "i"}

    # Filter by category if available
    if category:
        match_stage["category"] = {"$regex": f".*{category}.*", "$options": "i"}

    # If we have neither brand nor category, use the object name as a keyword
    if not match_stage:
        match_stage["$or"] = [
            {"title": {"$regex": f".*{object_name}.*", "$options": "i"}},
            {"description": {"$regex": f".*{object_name}.*", "$options": "i"}}
        ]

    # Build the aggregation pipeline
    pipeline = [
        {"$match": match_stage},
        {"$limit": 5},
        # Add lookup stage to connect with shops collection
        {"$lookup": {
            "from": "shops",
            "localField": "shop_id",
            "foreignField": "_id",
            "as": "shop_info"
        }},
        # Unwind shop_info array to make it a single object
        {"$unwind": {
            "path": "$shop_info",
            "preserveNullAndEmptyArrays": True  # Keep products even if no shop is found
        }},
        {"$project": {
            "_id": {"$toString": "$_id"},  # Convert ObjectId to string
            "title": 1,
            "subtitle": 1,
            "price": 1,
            "original_price": 1,
            "ratings": 1,
            "discount": 1,
            "category": 1,
            "brand": 1,
            "images": 1,
            "specifications": 1,
            "qty": 1,
            # Include shop information
            "shop": {
                "_id": {"$toString": "$shop_info._id"},
                "name": "$shop_info.name",
            }
        }}
    ]

    related_products = await Product.aggregate(pipeline)

    return related_products


class ImageRecognitionRequest(BaseModel):
    uri: Optional[str] = None
    type: Optional[str] = None
    name: Optional[str] = None
    file: Optional[Any] = None


class ImageRecognition:
    @staticmethod
    @router.post("/image-recognition", response_model=Dict[str, Any])
    async def index(data: ImageRecognitionRequest, response_handler: ResponseHandler = Depends(get_response_handler)):
        try:
            # Check if base64 image or file was provided
            if data.uri and data.uri.startswith('data:image'):
                # Extract base64 data
                format, imgstr = data.uri.split(';base64,')
                image_bytes = base64.b64decode(imgstr)
            elif data.file:
                # Read image file
                image_bytes = await data.file.read()
            else:
                return response_handler.send_error_response(
                    message="No image data provided",
                    status_code=400
                )

            # Process image
            image_tensor, _ = preprocess_image(image_bytes)

            # Predict object class
            predictions = predict_object(image_tensor)

            # Get all predictions with confidence scores
            all_predictions = [
                {"object": obj, "confidence": float(conf)}
                for obj, conf in predictions
            ]

            # Prepare response
            response = {
                "predictions": all_predictions,
                "top_prediction": {
                    "object": predictions[0][0],
                    "confidence": float(predictions[0][1])
                },
            }

            # Convert to numpy array for OpenCV
            nparr = np.frombuffer(image_bytes, np.uint8)

            # Decode image with OpenCV
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Predict the brand
            brand = predict_brand(img)
            response["brand"] = brand

            # Find related products based on the top prediction and brand
            top_object = predictions[0][0]
            related_products = await get_related_products(top_object, brand)
            response["related_products"] = related_products

            return response_handler.send_success_response(data=response)
        except Exception as e:
            print(e)
            return response_handler.send_error_response(message=str(e), status_code=500)

from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from PIL import Image
import io

app = FastAPI()

print("🌱 Loading plant disease AI model...")

classifier = pipeline(
    "image-classification",
    model="kimcomehome/plantvillage-vit-leaf-disease"
)

print("✅ Plant disease AI model loaded!")


@app.get("/")
def home():
    return {
        "message": "Plant Disease AI Service is running 🌱🤖"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:
        # Read uploaded image
        image_bytes = await file.read()

        # Convert image bytes to PIL image
        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        # Run AI prediction
        predictions = classifier(image)

        # Get top prediction
        top_prediction = predictions[0]

        disease = top_prediction["label"]
        confidence = top_prediction["score"]

        return {
            "success": True,
            "disease": disease,
            "confidence": round(confidence * 100, 2)
        }

    except Exception as error:

        print("❌ Prediction error:", error)

        return {
            "success": False,
            "message": "Unable to analyze the crop image."
        }
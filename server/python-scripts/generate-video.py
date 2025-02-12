import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import textwrap
from flask import Flask, request, jsonify, send_file, Response, render_template
from flask_cors import CORS

app = Flask(__name__, static_folder="static")

# Allow all origins, methods, and headers
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

     
# Paths for static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
IMAGE_DIR = os.path.join(BASE_DIR, "static/generated_images")
VIDEO_OUTPUT = os.path.join(BASE_DIR, "static/output_video.mp4")


def ensure_directory(directory):
    """Ensure the directory exists, create if necessary."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"✅ Directory created: {directory}")


def text_to_image(text, image_name, width=1280, height=720, font_size=40):
    """Convert text to an image and save it."""
    ensure_directory(IMAGE_DIR)
    image_path = os.path.join(IMAGE_DIR, image_name)

    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except Exception as e:
        print(f"⚠️ Font loading error: {e}, using default font.")
        font = ImageFont.load_default()

    wrapped_text = textwrap.fill(text, width=50)
    
    draw.text((50, 50), wrapped_text, fill='black', font=font)
    
    img.save(image_path)
    print(f"✅ Image saved: {image_path}")

    return image_path


def images_to_video(image_dir=IMAGE_DIR, output_video=VIDEO_OUTPUT, frame_rate=1):
    """Convert images in a directory to a video."""
    images = sorted([img for img in os.listdir(image_dir) if img.endswith(".png")])
    
    if not images:
        print("❌ No images found to create video.")
        return False
    
    first_image = cv2.imread(os.path.join(image_dir, images[0]))

    if first_image is None:
        print(f"❌ Failed to read the first image: {images[0]}")
        return False

    height, width, _ = first_image.shape

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video = cv2.VideoWriter(output_video, fourcc, frame_rate, (width, height))

    for image in images:
        img_path = os.path.join(image_dir, image)
        frame = cv2.imread(img_path)
        if frame is None:
            print(f"❌ Skipping unreadable image: {img_path}")
            continue
        video.write(frame)

    video.release()
    print(f"✅ Video saved as {output_video}")
    
    return True


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-video', methods=['POST'])
def generate_video():
    """Generate a video from text data sent in a POST request and send it to the frontend."""
    data = request.json
    texts = data.get("texts", [])

    if not texts:
        return jsonify({"error": "No texts provided"}), 400

    ensure_directory(IMAGE_DIR)

    # Clear old images
    for filename in os.listdir(IMAGE_DIR):
        file_path = os.path.join(IMAGE_DIR, filename)
        if filename.endswith(".png"):
            os.remove(file_path)

    # Generate images from texts
    for i, text in enumerate(texts):
        text_to_image(text, f"image_{i}.png")

    # Convert images to video
    if not images_to_video():
        return jsonify({"error": "Failed to generate video"}), 500

    if not os.path.exists(VIDEO_OUTPUT):
        return jsonify({"error": "Video file not found after generation"}), 500

    # 🔥 Send the generated video directly to the frontend
    return send_file(VIDEO_OUTPUT, mimetype="video/mp4", as_attachment=True)

@app.route('/serve-video')
def serve_video():
    if not os.path.exists(VIDEO_OUTPUT):
        print(f"❌ Video file not found at {VIDEO_OUTPUT}")
        return jsonify({"error": "Video file not found"}), 404

    range_header = request.headers.get("Range", None)
    if not range_header:
        print("✅ Serving full video file")
        return send_file(VIDEO_OUTPUT, mimetype="video/mp4", as_attachment=False)

    file_size = os.path.getsize(VIDEO_OUTPUT)
    byte_start, byte_end = 0, file_size - 1

    range_match = range_header.replace("bytes=", "").split("-")
    if range_match[0]:
        byte_start = int(range_match[0])
    if range_match[1]:
        byte_end = int(range_match[1])

    byte_start = max(0, byte_start)
    byte_end = min(file_size - 1, byte_end)
    chunk_size = byte_end - byte_start + 1

    print(f"✅ Serving video chunk: bytes {byte_start}-{byte_end}/{file_size}")

    with open(VIDEO_OUTPUT, "rb") as f:
        f.seek(byte_start)
        chunk = f.read(chunk_size)

    response = Response(chunk, 206, mimetype="video/mp4", direct_passthrough=True)
    response.headers.add("Content-Range", f"bytes {byte_start}-{byte_end}/{file_size}")
    response.headers.add("Accept-Ranges", "bytes")
    response.headers.add("Content-Length", str(chunk_size))

    return response





if __name__ == '__main__':
    print(f"🚀 Server running at http://127.0.0.1:5000")
    app.run(port=5000, debug=True)



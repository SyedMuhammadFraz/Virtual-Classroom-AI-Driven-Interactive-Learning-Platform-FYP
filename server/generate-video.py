import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import textwrap
import json
import io
import uuid
from flask import Flask, request, jsonify, send_file, Response, render_template
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import supabase
import subprocess
import hashlib

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder="static")

# Allow all origins, methods, and headers
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_bucket = os.getenv("SUPABASE_BUCKET", "fyplessonvideo1")

print(f"Supabase URL: {supabase_url}")
print(f"Supabase Key: {supabase_key}")

# Initialize Supabase client
client = supabase.create_client(supabase_url, supabase_key)
     
# Paths for static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
IMAGE_DIR = os.path.join(BASE_DIR, "static/generated_images")
VIDEO_OUTPUT = os.path.join(BASE_DIR, "static/output_video.mp4")
IMAGE_OUTPUT = os.path.join(BASE_DIR, "static/title_image.png")  # For title image


def ensure_directory(directory):
    """Ensure the directory exists, create if necessary."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"✅ Directory created: {directory}")
        
        
def text_to_image(text, image_name, width=1280, height=720, font_size=40, is_title=False):
    """Convert text to an image with beautiful formatting, proper spacing, and visual hierarchy."""
    ensure_directory(IMAGE_DIR)
    image_path = os.path.join(IMAGE_DIR, image_name)

    # Enhanced color scheme
    if is_title:
        bg_color = (41, 128, 185)  # Professional blue
        text_color = (255, 255, 255)  # White text
        accent_color = (241, 196, 15)  # Gold accent
    else:
        bg_color = (248, 249, 250)  # Light gray background
        text_color = (33, 37, 41)  # Dark gray text
        accent_color = (52, 152, 219)  # Blue accent

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Load fonts with fallbacks
    try:
        # Try to load different font weights
        title_font = ImageFont.truetype("arial.ttf", font_size + 20 if is_title else font_size + 10)
        header_font = ImageFont.truetype("arial.ttf", font_size + 5)
        body_font = ImageFont.truetype("arial.ttf", font_size - 5)
        bullet_font = ImageFont.truetype("arial.ttf", font_size - 8)
    except Exception as e:
        print(f"⚠️ Font loading error: {e}, using default fonts.")
        title_font = ImageFont.load_default()
        header_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
        bullet_font = ImageFont.load_default()

    # Parse and format text
    lines = text.split('\n')
    formatted_elements = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect different text types
        if line.startswith('LESSON:') or line.startswith('CONCEPT:') or line.startswith('EXAMPLE:'):
            # Main headings
            formatted_elements.append({
                'text': line,
                'type': 'title',
                'font': title_font,
                'color': accent_color if not is_title else (255, 255, 255)
            })
        elif line.endswith(':') and len(line) < 50:
            # Section headers (DEFINITIONS:, BACKGROUND:, etc.)
            formatted_elements.append({
                'text': line,
                'type': 'header',
                'font': header_font,
                'color': accent_color if not is_title else (255, 255, 255)
            })
        elif line.startswith('•'):
            # Bullet points
            formatted_elements.append({
                'text': line,
                'type': 'bullet',
                'font': bullet_font,
                'color': text_color
            })
        else:
            # Regular body text
            formatted_elements.append({
                'text': line,
                'type': 'body',
                'font': body_font,
                'color': text_color
            })

    # Calculate layout
    margin = 60
    available_width = width - (2 * margin)
    current_y = margin
    line_spacing = 15
    section_spacing = 30
    
    # Special handling for title slides
    if is_title:
        # Center the title text
        title_text = formatted_elements[0]['text'] if formatted_elements else text
        wrapped_title = wrap_text_to_width(title_text, title_font, available_width, draw)
        
        # Calculate total height to center vertically
        total_height = len(wrapped_title) * (title_font.getbbox('A')[3] + line_spacing)
        start_y = (height - total_height) // 2
        
        for i, line in enumerate(wrapped_title):
            bbox = draw.textbbox((0, 0), line, font=title_font)
            text_width = bbox[2] - bbox[0]
            x = (width - text_width) // 2
            y = start_y + i * (title_font.getbbox('A')[3] + line_spacing)
            draw.text((x, y), line, fill=(255, 255, 255), font=title_font)
    else:
        # Format content slides with proper hierarchy
        for i, element in enumerate(formatted_elements):
            element_text = element['text']
            element_font = element['font']
            element_color = element['color']
            element_type = element['type']
            
            # Add extra spacing before headers and titles
            if element_type in ['title', 'header'] and i > 0:
                current_y += section_spacing
            
            # Handle bullet points with indentation
            if element_type == 'bullet':
                # Remove bullet character and add custom bullet
                clean_text = element_text.replace('•', '').strip()
                wrapped_text = wrap_text_to_width(clean_text, element_font, available_width - 40, draw)
                
                for j, line in enumerate(wrapped_text):
                    if j == 0:
                        # Draw custom bullet point
                        bullet_x = margin + 10
                        bullet_y = current_y + element_font.getbbox('A')[3] // 2
                        draw.ellipse([bullet_x - 4, bullet_y - 4, bullet_x + 4, bullet_y + 4], 
                                   fill=accent_color)
                        
                        # Draw text with indentation
                        text_x = margin + 30
                    else:
                        text_x = margin + 30
                    
                    draw.text((text_x, current_y), line, fill=element_color, font=element_font)
                    current_y += element_font.getbbox('A')[3] + line_spacing
            else:
                # Handle regular text with wrapping
                wrapped_text = wrap_text_to_width(element_text, element_font, available_width, draw)
                
                for line in wrapped_text:
                    # Center titles and headers, left-align body text
                    if element_type in ['title', 'header']:
                        bbox = draw.textbbox((0, 0), line, font=element_font)
                        text_width = bbox[2] - bbox[0]
                        x = (width - text_width) // 2
                    else:
                        x = margin
                    
                    draw.text((x, current_y), line, fill=element_color, font=element_font)
                    current_y += element_font.getbbox('A')[3] + line_spacing
            
            # Add small spacing between elements
            current_y += 10

    # Add decorative elements for title slides
    if is_title:
        # Add decorative border
        border_width = 4
        draw.rectangle([border_width//2, border_width//2, 
                       width-border_width//2, height-border_width//2], 
                      outline=accent_color, width=border_width)

    img.save(image_path)
    print(f"✅ Enhanced image saved: {image_path}")
    return image_path


def wrap_text_to_width(text, font, max_width, draw):
    """Wrap text to fit within specified width."""
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        text_width = bbox[2] - bbox[0]
        
        if text_width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                # Handle very long words
                lines.append(word)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines


def process_lesson_data(lesson_data):
    """Process lesson JSON data and convert it to a list of well-formatted slide texts."""
    slide_texts = []
    
    # Create title slide
    topic = lesson_data.get("topic", "Lesson")
    slide_texts.append(f"LESSON: {topic}")
    
    # Process introduction
    intro = lesson_data.get("introduction", {})
    if intro:
        # Definition points
        definitions = intro.get("definition", [])
        if definitions:
            definition_text = "DEFINITIONS:\n\n"
            for d in definitions:
                definition_text += f"• {d}\n\n"
            slide_texts.append(definition_text.strip())
            
        # Background points
        background = intro.get("background", [])
        if background:
            background_text = "BACKGROUND:\n\n"
            for b in background:
                background_text += f"• {b}\n\n"
            slide_texts.append(background_text.strip())
            
        # Relevance points
        relevance = intro.get("relevance", [])
        if relevance:
            relevance_text = "RELEVANCE:\n\n"
            for r in relevance:
                relevance_text += f"• {r}\n\n"
            slide_texts.append(relevance_text.strip())
    
    # Process core concepts
    concepts = lesson_data.get("core_concepts", [])
    for concept in concepts:
        title = concept.get("title", "Concept")
        explanation = concept.get("explanation", "")
        slide_texts.append(f"CONCEPT: {title}\n\n{explanation}")
    
    # Process examples
    examples = lesson_data.get("examples", [])
    for example in examples:
        title = example.get("title", "Example")
        description = example.get("description", "")
        slide_texts.append(f"EXAMPLE: {title}\n\n{description}")
    
    # Process takeaways
    takeaways = lesson_data.get("takeaways", [])
    if takeaways:
        takeaway_text = "KEY TAKEAWAYS:\n\n"
        for t in takeaways:
            takeaway_text += f"• {t}\n\n"
        slide_texts.append(takeaway_text.strip())
    
    return slide_texts
    """Convert text to an image, center it, and save it."""
    ensure_directory(IMAGE_DIR)
    image_path = os.path.join(IMAGE_DIR, image_name)

    # For title images, use a light blue background
    bg_color = 'lightblue' if is_title else 'white'
    text_color = 'navy' if is_title else 'black'
    
    # Larger font for titles
    if is_title:
        font_size = 60

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except Exception as e:
        print(f"⚠️ Font loading error: {e}, using default font.")
        font = ImageFont.load_default()

    wrapped_text = textwrap.fill(text, width=50)
    bbox = draw.textbbox((0, 0), wrapped_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (width - text_width) // 2
    text_y = (height - text_height) // 2
    
    draw.text((text_x, text_y), wrapped_text, fill=text_color, font=font, align='center')
    
    img.save(image_path)
    print(f"✅ Image saved: {image_path}")

    return image_path



def images_to_video(image_dir=IMAGE_DIR, output_video=VIDEO_OUTPUT, duration=5, video_fps=1):
    """
    Convert images in a directory into a video file.
    
    Parameters:
        image_dir (str): Directory containing PNG images.
        output_video (str): Path to save the output video.
        duration (int): Duration (in seconds) each image appears in the video.
        video_fps (float): Frames per second for the video.
    """
    images = sorted([img for img in os.listdir(image_dir) if img.lower().endswith(".png")])
    
    if not images:
        print("❌ No images found in the directory.")
        return False

    # Read the first image to get dimensions
    first_image_path = os.path.join(image_dir, images[0])
    first_image = cv2.imread(first_image_path)
    if first_image is None:
        print(f"❌ Failed to read the first image: {first_image_path}")
        return False

    height, width, _ = first_image.shape
    frames_per_image = int(video_fps*duration)

    codecs_to_try = [
    ('avc1', '.mp4'),  # H.264 AVC — most browser-friendly
    ]

    video = None
    final_output_path = output_video

    for codec, ext in codecs_to_try:
        if not output_video.lower().endswith(ext):
            final_output_path = os.path.splitext(output_video)[0] + ext
        else:
            final_output_path = output_video

        fourcc = cv2.VideoWriter_fourcc(*codec)
        video = cv2.VideoWriter(final_output_path, fourcc, video_fps, (width, height))

        if video.isOpened():
            print(f"✅ Initialized video writer with codec: {codec}")
            break
        else:
            print(f"⚠️ Codec {codec} failed to initialize.")
            video.release()
            video = None

    if video is None:
        print("❌ Failed to initialize video writer with any codec.")
        return False

    # Process and write each image
    for i, img_name in enumerate(images):
        img_path = os.path.join(image_dir, img_name)
        frame = cv2.imread(img_path)

        if frame is None:
            print(f"⚠️ Skipping unreadable image: {img_path}")
            continue

        if frame.shape[:2] != (height, width):
            frame = cv2.resize(frame, (width, height))

        for _ in range(frames_per_image):
            video.write(frame)

        print(f"✅ Processed image {i+1}/{len(images)}: {img_name}")

    video.release()

    if os.path.exists(final_output_path) and os.path.getsize(final_output_path) > 0:
        print(f"🎉 Video successfully saved to {final_output_path}")
        return True
    else:
        print(f"❌ Failed to save video or video is empty: {final_output_path}")
        return False

# def convert_to_h264(input_path: str, output_path: str):
#     command = [
#         'ffmpeg',
#         '-i', input_path,
#         '-r', '25',
#         '-c:v', 'libx264',
#         '-profile:v', 'baseline',
#         '-level', '3.0',
#         '-pix_fmt', 'yuv420p',
#         '-c:a', 'aac',
#         '-b:a', '128k',
#         '-movflags', '+faststart',
#         output_path
#     ]
#     subprocess.run(command, check=True)

def upload_to_supabase(file_path, file_name, content_type):
    """Upload a file to Supabase storage and return the public URL."""
    try:
        with open(file_path, 'rb') as f:
            file_data = f.read()
            
        # Generate a unique file name to avoid conflicts
        unique_filename = f"{uuid.uuid4().hex[:4]}-{file_name}"
        
        # Upload the file to Supabase
        response = client.storage.from_(supabase_bucket).upload(
            path=unique_filename,
            file=file_data,
            file_options={"content-type": content_type}
        )
        
        # Check if upload was successful
        if hasattr(response, 'error') and response.error:
            print(f"❌ Supabase upload error: {response.error}")
            return None
        
        # Build the public URL manually
        public_url = f"{supabase_url}/storage/v1/object/public/{supabase_bucket}/{unique_filename}"
        
        print(f"✅ File uploaded successfully: {public_url}")
        return public_url
        
    except Exception as e:
        print(f"❌ Error uploading to Supabase: {str(e)}")
        return None




def process_lesson_data(lesson_data):
    """Process lesson JSON data and convert it to a list of slide texts."""
    slide_texts = []
    
    # Create title slide
    topic = lesson_data.get("topic", "Lesson")
    slide_texts.append(f"LESSON: {topic}")
    
    # Process introduction
    intro = lesson_data.get("introduction", {})
    if intro:
        # Definition points
        definitions = intro.get("definition", [])
        if definitions:
            slide_texts.append(f"DEFINITIONS:\n\n" + "\n".join([f"• {d}" for d in definitions]))
            
        # Background points
        background = intro.get("background", [])
        if background:
            slide_texts.append(f"BACKGROUND:\n\n" + "\n".join([f"• {b}" for b in background]))
            
        # Relevance points
        relevance = intro.get("relevance", [])
        if relevance:
            slide_texts.append(f"RELEVANCE:\n\n" + "\n".join([f"• {r}" for r in relevance]))
    
    # Process core concepts
    concepts = lesson_data.get("core_concepts", [])
    for concept in concepts:
        title = concept.get("title", "Concept")
        explanation = concept.get("explanation", "")
        slide_texts.append(f"CONCEPT: {title}\n\n{explanation}")
    
    # Process examples
    examples = lesson_data.get("examples", [])
    for example in examples:
        title = example.get("title", "Example")
        description = example.get("description", "")
        slide_texts.append(f"EXAMPLE: {title}\n\n{description}")
    
    # Process takeaways
    takeaways = lesson_data.get("takeaways", [])
    if takeaways:
        slide_texts.append(f"KEY TAKEAWAYS:\n\n" + "\n".join([f"• {t}" for t in takeaways]))
    
    return slide_texts


@app.route('/')
def index():
    return render_template('index.html')


def convert_to_h264(input_path: str, output_path: str):
    """
    Convert a video to H.264 format for browser compatibility.
    Returns True if successful, False otherwise.
    """
    try:
        command = [
            'ffmpeg',
            '-i', input_path,
            '-r', '25',
            '-c:v', 'libx264',
            '-profile:v', 'baseline',
            '-level', '3.0',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            output_path
        ]
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print(f"✅ Successfully converted video to H.264: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ FFmpeg conversion failed: {e}")
        print(f"FFmpeg stderr: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Error during video conversion: {str(e)}")
        return False

@app.route('/generate-video', methods=['POST'])
def generate_video():
    """Generate a video from lesson data sent in a POST request and upload to Supabase."""
    try:
        lesson_data = request.json
        if not lesson_data or not lesson_data.get("topic"):
            return jsonify({"error": "Invalid lesson data provided"}), 400

        slide_texts = process_lesson_data(lesson_data)
        if not slide_texts:
            return jsonify({"error": "No content could be extracted from lesson data"}), 400

        ensure_directory(IMAGE_DIR)

        # Clear old images
        for filename in os.listdir(IMAGE_DIR):
            file_path = os.path.join(IMAGE_DIR, filename)
            if filename.endswith(".png"):
                os.remove(file_path)

        # Title image
        title_image_path = text_to_image(slide_texts[0], f"image_0.png", is_title=True)
        thumbnail_image = Image.open(title_image_path)
        ensure_directory(os.path.dirname(IMAGE_OUTPUT))
        thumbnail_image.save(IMAGE_OUTPUT)

        # Remaining slides
        for i, text in enumerate(slide_texts[1:]):
            text_to_image(text, f"image_{i+1}.png")

        # ✅ Call images_to_video with longer duration
        output_video = VIDEO_OUTPUT
        if not images_to_video(duration=6):  # Set 6 seconds per image
            return jsonify({"error": "Failed to generate video"}), 500

        if not os.path.exists(output_video):
            return jsonify({"error": "Video file not found"}), 500

        file_extension = os.path.splitext(output_video)[1]
        topic = lesson_data.get('topic', 'lesson').replace(' ', '_').lower()
        short_topic = topic[:5]  # First 5 characters of topic
        hash_part = hashlib.md5(topic.encode()).hexdigest()[:2]  # 2-char hash
        video_filename = f"{short_topic}{hash_part}{file_extension}"
        content_type = "video/mp4" if file_extension == ".mp4" else "video/x-msvideo"
        video_url = upload_to_supabase(output_video, video_filename, content_type)

        topic = lesson_data.get('topic', 'lesson').replace(' ', '_').lower()
        short_topic = topic[:5]  # first 5 letters
        hash_part = hashlib.md5(topic.encode()).hexdigest()[:3]  # 3-char hash
        thumbnail_filename = f"{short_topic}{hash_part}.png"
        thumbnail_url = upload_to_supabase(IMAGE_OUTPUT, thumbnail_filename, "image/png")

        if not video_url or not thumbnail_url:
            return jsonify({"error": "Failed to upload files to Supabase"}), 500

        return jsonify({
            "image_url": thumbnail_url,
            "video_url": video_url,
            "message": "Video and thumbnail generated and uploaded to Supabase successfully"
        })

    except Exception as e:
        print(f"Error generating video: {str(e)}")
        return jsonify({"error": f"Error generating video: {str(e)}"}), 500
    
    
# Add a utility route to test video playback directly from your server
@app.route('/test-video')
def test_video():
    """Serve the most recently generated video file with proper headers."""
    video_path = VIDEO_OUTPUT
    
    # Check for both .mp4 and .avi
    if not os.path.exists(video_path):
        video_path = video_path.replace('.mp4', '.avi')
        if not os.path.exists(video_path):
            return "No video has been generated yet", 404
    
    # Determine content type based on extension
    content_type = "video/mp4" if video_path.endswith('.mp4') else "video/x-msvideo"
        
    return send_file(
        video_path,
        mimetype=content_type,
        as_attachment=False,
        download_name=os.path.basename(video_path)
    )


@app.route('/serve-video')
def serve_video():
    """
    Redirect to the Supabase storage URL for the requested video.
    This endpoint is maintained for backward compatibility.
    """
    # You can either redirect to a default video or return an error
    # Ideally, clients should use the URLs returned from /generate-video
    return jsonify({"error": "Videos are now served directly from Supabase. Use the URL returned from the /generate-video endpoint."}), 301


if __name__ == '__main__':
    # Ensure the Supabase bucket exists
    try:
        # Check if bucket exists
        buckets = client.storage.list_buckets()
        bucket_exists = any(bucket.name == supabase_bucket for bucket in buckets)
        
        if not bucket_exists:
            # Create the bucket if it doesn't exist
            client.storage.create_bucket(supabase_bucket, options={"public": True})
            print(f"✅ Supabase bucket '{supabase_bucket}' created")
    except Exception as e:
        print(f"⚠️ Error checking/creating Supabase bucket: {str(e)}")

print(f"🚀 Server running at http://127.0.0.1:5003")
app.run(port=5003, debug=True)





from PIL import Image
import os

def resize_image(input_path, output_path, target_width=600):
    try:
        with Image.open(input_path) as img:
            # Calculate new height to maintain aspect ratio
            w_percent = (target_width / float(img.size[0]))
            h_size = int((float(img.size[1]) * float(w_percent)))

            # Resize
            img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)

            # Save
            img.save(output_path, "JPEG", quality=80, optimize=True)
            print(f"Resized {input_path} -> {output_path} ({os.path.getsize(output_path)/1024:.2f} KB)")
    except Exception as e:
        print(f"Error resizing {input_path}: {e}")

resize_image("320x480_hyundai_interstitial/images/hyundai_i20.jpg", "320x480_hyundai_interstitial/images/hyundai_i20_opt.jpg")
resize_image("320x480_hyundai_interstitial/images/hyundai_tucson.jpg", "320x480_hyundai_interstitial/images/hyundai_tucson_opt.jpg")

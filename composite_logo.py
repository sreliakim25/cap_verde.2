from PIL import Image

def main():
    # Load original background backup and logo
    bg = Image.open('public/menu_background_clean_backup.png').convert("RGBA")
    logo = Image.open('public/logo.png').convert("RGBA")
    
    # The bg is 1024x572. The logo is 957x1920
    # Let's scale logo down. Its height is very large, maybe it has blank space.
    # Let's set a target height of smaller size so it fits well.
    target_height = 160
    aspect_ratio = logo.width / logo.height
    target_width = int(target_height * aspect_ratio)
    
    logo_resized = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # position: center horizontally, top area
    x = (bg.width - target_width) // 2
    # Moving y further up (closer to the top edge)
    y = 5
    
    # Paste logo onto background using logo's alpha channel as mask
    bg.paste(logo_resized, (x, y), logo_resized)
    
    # Save the composited image
    bg.save('public/menu_background_clean.png')
    print("Composition successful.")
    
if __name__ == "__main__":
    main()

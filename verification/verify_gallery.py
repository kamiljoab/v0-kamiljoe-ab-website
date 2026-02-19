import time
from playwright.sync_api import sync_playwright

def test_gallery_image():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to page...")
        # Navigate to the page
        page.goto("http://localhost:3000/vvs-portal-access")

        print("Injecting dummy image data...")
        # Inject dummy image data into local storage
        # A simple red dot image
        dummy_image_json = '[{"id": 1, "name": "test_image.png", "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "addedAt": "2023-01-01T00:00:00.000Z"}]'

        # Set localStorage
        page.evaluate(f"localStorage.setItem('kamiljo_gallery', '{dummy_image_json}')")

        print("Reloading page...")
        # Reload to load data
        page.reload()

        print("Clicking 'Galeria zdjec' tab...")
        # Click on "Galeria zdjec" tab
        page.get_by_role("button", name="Galeria zdjec").click()

        print("Waiting for image...")
        # Wait for the image to be visible
        img = page.get_by_alt_text("test_image.png")
        img.wait_for()

        print("Taking screenshot...")
        # Take screenshot
        page.screenshot(path="verification/gallery_verification.png")

        print("Done.")
        browser.close()

if __name__ == "__main__":
    test_gallery_image()

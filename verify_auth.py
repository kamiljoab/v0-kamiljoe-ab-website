from playwright.sync_api import sync_playwright
import time

def verify(page):
    print("Navigating to /vvs-portal-access")
    try:
        page.goto("http://localhost:3000/vvs-portal-access", timeout=10000)
    except Exception as e:
        print(f"Error navigating: {e}")
        # Maybe server not ready? Retry once
        time.sleep(2)
        page.goto("http://localhost:3000/vvs-portal-access")

    # Should redirect to signin
    print("Checking redirect")
    # Wait for URL to change or content
    try:
        page.wait_for_url("**/auth/signin*", timeout=5000)
        print("Redirected to signin page")
    except:
        print(f"Failed to redirect. Current URL: {page.url}")
        page.screenshot(path="failed_redirect.png")
        return

    page.screenshot(path="login_page.png")

    # Fill login form
    print("Filling login form")
    page.fill("input[name='password']", "ChangeMe123!")
    page.click("button[type='submit']")

    # Should redirect to admin panel
    print("Waiting for admin panel")
    try:
        page.wait_for_url("**/vvs-portal-access", timeout=5000)
        print("Redirected to admin panel")
    except:
        print(f"Failed to login. Current URL: {page.url}")
        # Check for error message
        if page.locator("text=Nieprawidlowe haslo").is_visible():
            print("Invalid password error visible")
        page.screenshot(path="failed_login.png")
        return

    # Check for specific element
    try:
        page.wait_for_selector("text=Panel Administracyjny", timeout=5000)
    except:
        print("Panel header not found")
        page.screenshot(path="failed_panel_load.png")
        return

    page.screenshot(path="admin_panel.png")

    # Test sign out
    print("Testing sign out")
    page.click("button:has-text('Wyloguj')")

    # Should redirect to signin
    print("Waiting for signin page again")
    try:
        page.wait_for_url("**/auth/signin*", timeout=5000)
        print("Redirected to signin page")
    except:
        print(f"Failed to sign out. Current URL: {page.url}")
        page.screenshot(path="failed_signout.png")
        return

    page.screenshot(path="signed_out.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    verify(page)
    browser.close()

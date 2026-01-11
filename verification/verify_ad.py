
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set viewport to mobile interstitial size
        context = browser.new_context(viewport={'width': 320, 'height': 480})
        page = context.new_page()

        # 1. Load the page
        page.goto("http://localhost:8000")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="verification/1_intro.png")
        print("Intro screenshot taken")

        # 2. Click Start -> Model Select
        page.click('#btn-start')
        page.wait_for_timeout(600) # Wait for transition
        page.screenshot(path="verification/2_model_select.png")
        print("Model Select screenshot taken")

        # 3. Select i20 -> Configurator
        page.click('[data-model="i20"]')
        page.wait_for_timeout(600)
        page.screenshot(path="verification/3_config_white.png")
        print("Config screenshot taken (White)")

        # 4. Change Color to Red
        page.click('[data-color="red"]')
        page.wait_for_timeout(300)
        page.screenshot(path="verification/4_config_red.png")
        print("Config screenshot taken (Red)")

        # 5. Finish -> End Card
        page.click('#btn-finish')
        page.wait_for_timeout(600)
        page.screenshot(path="verification/5_end.png")
        print("End screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()

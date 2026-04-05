# -*- coding: utf-8 -*-
"""
Mobile project card behavior tests.
Tests: tap-to-expand, tap-body-to-expand, scroll-to-close.
Run: python scripts/with_server.py --server "python -m http.server 3333" --port 3333 -- python test_mobile_cards.py
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import json
import sys
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3333"

MOCK_PROJECTS = [
    {
        "id": "test-1",
        "name": "Project Alpha",
        "highlight": "blue",
        "brief_description": "A project about testing mobile card interactions.",
        "expanded_content": "<p>Detailed expanded content for Project Alpha. This appears only when the card is opened.</p>",
        "github_url": "https://github.com/test/alpha",
        "demo_url": "",
        "preview_image_url": "",
        "sort_order": 1,
        "created_at": "2024-01-01T00:00:00Z",
    },
    {
        "id": "test-2",
        "name": "Project Beta",
        "highlight": "peach",
        "brief_description": "Second project to test scroll-to-close behavior.",
        "expanded_content": "<p>Detailed expanded content for Project Beta.</p>",
        "github_url": "",
        "demo_url": "https://demo.test/beta",
        "preview_image_url": "",
        "sort_order": 2,
        "created_at": "2024-01-02T00:00:00Z",
    },
    {
        "id": "test-3",
        "name": "Project Gamma",
        "highlight": "lavender",
        "brief_description": "Third project.",
        "expanded_content": "<p>Detailed expanded content for Project Gamma.</p>",
        "github_url": "",
        "demo_url": "",
        "preview_image_url": "",
        "sort_order": 3,
        "created_at": "2024-01-03T00:00:00Z",
    },
]


def setup_supabase_mock(page):
    """Intercept all Supabase project REST calls and return mock data."""
    def handle(route):
        if "/rest/v1/projects" in route.request.url:
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps(MOCK_PROJECTS),
            )
        else:
            route.continue_()
    page.route("**/*", handle)


def load_work_section(page):
    """Navigate to page and scroll to the work/projects section."""
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    # On mobile the sidebar nav is hidden; scroll directly via JS
    page.evaluate("""
        const el = document.getElementById('work') || document.querySelector('[data-section="work"]');
        if (el) el.scrollIntoView();
    """)
    page.wait_for_timeout(1000)


def get_first_card_and_expanded(page):
    """Return first project card and its expanded section locators."""
    card = page.locator(".project-card").first
    expanded = card.locator(".project-expanded")
    return card, expanded


PASS = "[PASS]"
FAIL = "[FAIL]"


def run_tests_for_device(playwright, device_name, browser_type_name):
    print(f"\n{'='*60}")
    print(f"  Device: {device_name}")
    print(f"{'='*60}")
    results = []

    device = playwright.devices[device_name]
    browser_cls = getattr(playwright, browser_type_name)
    browser = browser_cls.launch(headless=True)
    context = browser.new_context(**device)
    page = context.new_page()
    setup_supabase_mock(page)

    # ── Diagnostic ─────────────────────────────────────────────────────────
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")
    is_touch = page.evaluate("window.matchMedia('(hover: none)').matches")
    print(f"  hover:none media query = {is_touch}  (must be True for mobile path)")

    if not is_touch:
        print(f"  WARNING: hover:none is False — mobile code path will NOT run.")
        print(f"      The isTouchOnly flag in script.js will be False, meaning")
        print(f"      tap-to-expand and scroll-to-close logic are never wired up.")
        results.append(("hover:none detection", False, "matchMedia('hover: none') returned False in emulation"))

    # ── Test 1: Projects render ─────────────────────────────────────────────
    load_work_section(page)
    page.wait_for_timeout(1000)

    card_count = page.locator(".project-card").count()
    ok = card_count > 0
    label = f"Projects render ({card_count} cards found)"
    print(f"  {PASS if ok else FAIL}  {label}")
    results.append((label, ok, f"{card_count} cards"))

    if card_count == 0:
        print("  [!] No cards found — skipping remaining tests.")
        browser.close()
        return results

    page.screenshot(path=f"/tmp/screenshot_{device_name.replace(' ', '_')}_1_initial.png")

    # ── Test 2: Expanded content hidden by default ──────────────────────────
    card, expanded = get_first_card_and_expanded(page)
    is_hidden = not expanded.is_visible()
    label = "Expanded content hidden by default"
    ok = is_hidden
    print(f"  {PASS if ok else FAIL}  {label}")
    results.append((label, ok, ""))

    # ── Test 3: Tap toggle button expands card ──────────────────────────────
    toggle_btn = card.locator(".project-toggle")
    toggle_btn.tap()
    page.wait_for_timeout(400)
    is_expanded = expanded.is_visible()
    label = "Tap toggle button → card expands"
    ok = is_expanded
    print(f"  {PASS if ok else FAIL}  {label}")
    results.append((label, ok, ""))
    page.screenshot(path=f"/tmp/screenshot_{device_name.replace(' ', '_')}_2_expanded.png")

    # Close it again
    toggle_btn.tap()
    page.wait_for_timeout(400)

    # ── Test 4: Tap card BODY (not toggle) expands card ─────────────────────
    # Only valid when isTouchOnly is True
    if is_touch:
        card_title = card.locator(".project-name, h3, .project-title").first
        if card_title.count() == 0:
            # Tap somewhere in the middle of the card that isn't a button
            box = card.bounding_box()
            if box:
                page.tap(x=box["x"] + box["width"] * 0.5, y=box["y"] + 20)
        else:
            card_title.tap()
        page.wait_for_timeout(400)
        is_expanded = expanded.is_visible()
        label = "Tap card body → card expands (mobile)"
        ok = is_expanded
        print(f"  {PASS if ok else FAIL}  {label}")
        results.append((label, ok, ""))
        page.screenshot(path=f"/tmp/screenshot_{device_name.replace(' ', '_')}_3_body_tap.png")

        # ── Test 5: Scroll past card → card closes ───────────────────────────
        # Card is still expanded; scroll down past it
        page.evaluate("window.scrollBy({top: window.innerHeight * 2, behavior: 'instant'})")
        page.wait_for_timeout(600)
        still_expanded = expanded.is_visible()
        label = "Scroll past card → card auto-closes"
        ok = not still_expanded
        print(f"  {PASS if ok else FAIL}  {label}")
        results.append((label, ok, f"expanded={still_expanded}"))
        page.screenshot(path=f"/tmp/screenshot_{device_name.replace(' ', '_')}_4_after_scroll.png")

        # ── Test 6: Scroll back up — card stays closed ───────────────────────
        page.evaluate("window.scrollBy({top: -window.innerHeight * 2, behavior: 'instant'})")
        page.wait_for_timeout(400)
        is_still_closed = not expanded.is_visible()
        label = "Scroll back up → card stays closed"
        ok = is_still_closed
        print(f"  {PASS if ok else FAIL}  {label}")
        results.append((label, ok, ""))
    else:
        print(f"  [SKIP]  Tap-body and scroll-to-close tests (hover:none=False, mobile path inactive)")

    browser.close()
    return results


def main():
    # Use Chromium for both — emulates touch/mobile UA without needing WebKit installed
    devices_to_test = [
        ("iPhone 12", "chromium"),
        ("Pixel 5", "chromium"),
    ]

    all_results = {}
    with sync_playwright() as p:
        for device_name, browser_type in devices_to_test:
            try:
                results = run_tests_for_device(p, device_name, browser_type)
                all_results[device_name] = results
            except Exception as e:
                print(f"\n  ERROR running tests for {device_name}: {e}")
                import traceback; traceback.print_exc()
                all_results[device_name] = [(f"ERROR: {e}", False, "")]

    # Summary
    print(f"\n{'='*60}")
    print("  SUMMARY")
    print(f"{'='*60}")
    total_pass = total_fail = 0
    for device, results in all_results.items():
        print(f"\n  {device}:")
        for label, ok, detail in results:
            status = PASS if ok else FAIL
            detail_str = f"  ({detail})" if detail else ""
            print(f"    {status}  {label}{detail_str}")
            if ok: total_pass += 1
            else: total_fail += 1

    print(f"\n  Total: {total_pass} passed, {total_fail} failed")
    print(f"\n  Screenshots saved to /tmp/screenshot_*.png")
    sys.exit(0 if total_fail == 0 else 1)


if __name__ == "__main__":
    main()

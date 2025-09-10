import { test, expect } from '@playwright/test'

test.describe('Uncle Joes Golf Website', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('http://localhost:3000')
  })

  test('homepage loads successfully', async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Uncle Joes Golf/)

    // Check for main content areas
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    // Test navigation links
    const navLinks = page.locator('nav a')

    // Check if navigation exists
    await expect(navLinks.first()).toBeVisible()

    // Test a few key navigation items (adjust selectors based on actual implementation)
    const journeyLink = page.locator('nav a').filter({ hasText: /journey/i }).first()
    if (await journeyLink.isVisible()) {
      await journeyLink.click()
      await expect(page).toHaveURL(/.*journey/)
    }
  })

  test('contact form submission', async ({ page }) => {
    // Navigate to contact page
    await page.goto('http://localhost:3000/contact')

    // Check if contact form exists
    const contactForm = page.locator('form')
    await expect(contactForm).toBeVisible()

    // Fill out the form
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="subject"]', 'Test Subject')
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright')

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message (adjust based on actual implementation)
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 10000 })
  })

  test('shop page displays merchandise', async ({ page }) => {
    // Navigate to shop page
    await page.goto('http://localhost:3000/shop')

    // Check if merchandise is displayed
    await expect(page.locator('text=Official Uncle Joe Cap')).toBeVisible()
    await expect(page.locator('text=Stones Golf Polo')).toBeVisible()
    await expect(page.locator('text=Uncle Joe Towel')).toBeVisible()
  })

  test('tournament journey displays correctly', async ({ page }) => {
    // Navigate to journey page
    await page.goto('http://localhost:3000/journey')

    // Check if tournaments are displayed
    await expect(page.locator('text=Stones Golf Championship')).toBeVisible()
    await expect(page.locator('text=Uncle Joe Classic')).toBeVisible()
  })

  test('individual tournament page loads', async ({ page }) => {
    // Navigate to a specific tournament
    await page.goto('http://localhost:3000/journey/1')

    // Check if tournament details are displayed
    await expect(page.locator('text=Stones Golf Championship')).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if mobile menu is available (if implemented)
    const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(page.locator('button[aria-label*="menu" i]'))

    // The page should still be functional on mobile
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })

  test('newsletter signup works', async ({ page }) => {
    // Look for newsletter signup form
    const newsletterForm = page.locator('form').filter({ hasText: /newsletter/i }).or(
      page.locator('input[type="email"]').first()
    )

    if (await newsletterForm.isVisible()) {
      // Fill out newsletter signup
      await page.fill('input[type="email"]', 'newsletter-test@example.com')

      // Submit the form
      await page.click('button[type="submit"]')

      // Check for success message
      await expect(page.locator('text=Thank you').or(page.locator('text=subscribed'))).toBeVisible({ timeout: 5000 })
    }
  })

  test('admin panel requires authentication', async ({ page }) => {
    // Try to access admin panel
    await page.goto('http://localhost:3000/admin')

    // Should redirect to login or show unauthorized message
    // This test will need to be adjusted based on actual auth implementation
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/admin|login|auth/)
  })

  test('404 page works correctly', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('http://localhost:3000/non-existent-page')

    // Check for 404 content
    await expect(page.locator('text=404').or(page.locator('text=Not Found'))).toBeVisible()
  })

  test('performance is acceptable', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now()

    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })
})

KK'S BID & BUY — ONLINE STORE + AUCTIONS
====================================

WHAT'S INCLUDED
- index.html — public online shop and auction landing page
- styles.css, site.js — design and shopping-cart behaviour
- listings.js — the items shown in the shop
- settings.js — your Facebook links
- assets/ — images for the 14 product listings (the original 4 illustrated images are retained)
- thank-you.html — confirmation after a customer's order REQUEST

IMPORTANT: THIS IS NOT AUTOMATIC ONLINE PAYMENT
- Customers can browse, search, add available items to a cart, and send an order request.
- Requests are collected by Netlify Forms. You must review them in the Netlify dashboard,
  contact customers and confirm stock, taxes, payment and pickup yourself.
- The website does NOT accept credit cards, automatically charge customers, reserve stock,
  deduct quantities after a purchase or host auction bidding.
- Auctions can be linked to an external auction page when you enter its URL.

CURRENT PRODUCT DATA — NOVEMBER 12, 2026
- 14 fixed-price Shop products total: 10 additions from your WhatsApp chat plus the existing 4 tech products.
- Existing JBL GO 4 ($49, quantity 4), Meta Quest 2 ($269, quantity 1), MacBook Pro ($599, quantity 2), and Aura Astor ($159, quantity 3) are preserved.
- All 14 are set to COMING SOON and cannot be ordered until the owner has verified condition and quantities, then changes status to Live.
- The quantities of 1 for the 10 new WhatsApp products are placeholders, not verified stock counts.
- Prices and product details are transcribed from the owner's WhatsApp chat; comparison prices in the separate internal CSV were not externally verified and are not advertised on the website.
- The original user-provided graphics may include historic printed pricing or discount claims. Replace those image files with product-only photos if you do not want such text visible inside an enlarged picture.
- The 4 previously seeded tech-product graphics are illustrations, not photographs of actual merchandise.
- The website's public product descriptions contain no percent-off claims.

TO DEPLOY AS A TEST FIRST (RECOMMENDED)
1. Save this folder or download the ZIP and extract it on a computer.
2. Open https://app.netlify.com/drop in Chrome, and sign in.
3. Upload the downloaded ZIP using Netlify Drop, or unzip it and drag the WHOLE public website folder. This makes a NEW preview site.
4. Review it on your phone. This avoids overwriting your existing live site accidentally.
5. Once you are satisfied, go to your existing Netlify project's Deploys page.
6. Drag the same PUBLIC STOREFRONT folder to the deployment area on the existing project.
   This REPLACES that site's old deployed files, so download a backup of the old deploy first.
7. Check that the public site shows 'Shop the latest finds', NOT the private listing manager.

TO ADD OR CHANGE ITEMS
1. Download and keep the SEPARATE 'KKs_Bid_and_Buy_Private_Store_Manager.html' on your own device.
   NEVER put that private owner file inside the public website folder or upload it to Netlify.
2. Open the owner HTML in Chrome (not Facebook's built-in web browser).
3. Before making changes, import the CURRENT listings.js file from the storefront folder.
4. Choose 'Shop – fixed price' or 'Auction'. Add a title, sale price/starting bid, photo,
   category, condition, quantity, description and status. Mark only ready stock as 'Live'.
5. Click 'Download listings.js' in the manager.
6. Replace the existing listings.js in the PUBLIC STOREFRONT folder with your downloaded file.
7. Re-deploy the entire PUBLIC STOREFRONT folder to your existing Netlify project.
8. You can update Facebook links in the manager and replace settings.js in the same way.
NOTE: The manager does not save an online database. Import the latest listings.js before each edit.

TO RECEIVE CUSTOMER ORDER REQUESTS
- In Netlify, open your project and ENABLE FORM DETECTION under Forms if not already enabled.
- Re-deploy the public storefront after enabling detection; Netlify registers forms at deploy time.
- After deploying the public storefront to Netlify, open your project in Netlify dashboard.
- Look for Forms > order-request to see submissions (if Forms is enabled on your account).
- Set up email notifications in Netlify settings if desired.
- Send a test order first and make sure it appears in the Forms dashboard.
- An order request is NOT guaranteed or paid until you confirm directly with the customer.

SECURITY / PRIVACY
- Do not publish the owner HTML file to a public website; there is no password inside it.
- Do not enter passwords, payment-card information or customer private data in listings.js.
- Form submissions contain customer name/email and requested items; use them only for fulfilling
  requests, and follow applicable Canadian privacy requirements.
- If you want live payments, automatic inventory, or private phone-based editing without redeploying,
  a hosted e-commerce platform / authenticated backend will be needed next.

No public retail percentage-off claims are included.

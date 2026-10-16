# preplexo

## Project Overview

This repository contains the Shopify theme source code for **preplexo**. It is intended for storefront customization, development, maintenance, and reuse.

## Live Store

Not provided — add the verified live storefront URL.

## Technology Stack

- Shopify Liquid
- HTML and CSS
- JavaScript
- Shopify theme JSON templates and configuration
- Shopify CLI for local preview and development

## Theme Architecture

| Directory | Purpose |
|---|---|
| ssets/ | Stylesheets, scripts, images, and other static assets |
| config/ | Theme settings and configuration schema |
| layout/ | Main page layouts |
| locales/ | Language and translation files |
| sections/ | Customizable storefront sections |
| snippets/ | Reusable Liquid components |
| 	emplates/ | Page templates and JSON templates |

The exact contents depend on the implementation of this theme.

## Local Development

1. Install Git and Shopify CLI.
2. Open the project directory in PowerShell.
3. Authenticate with Shopify CLI using shopify auth login.
4. Start a local preview using shopify theme dev.
5. Test changes using a development store or unpublished theme before publishing.

## Customization

- Update styling and scripts in ssets/.
- Edit reusable components in snippets/.
- Modify page layouts in layout/ and 	emplates/.
- Customize storefront sections in sections/.
- Review theme settings in config/.

## Testing Checklist

- [ ] Verify the live store URL.
- [ ] Test navigation and collection links.
- [ ] Test product pages and variant selection.
- [ ] Verify cart and add-to-cart behavior.
- [ ] Check mobile and desktop layouts.
- [ ] Review browser console errors.
- [ ] Preview changes before publishing.

## Security and Maintenance

Do not commit credentials, API tokens, private keys, customer information, or confidential data. Keep local environment files outside version control. Review changes before pushing updates to the repository.

---
Documentation generated for the preplexo Shopify theme.

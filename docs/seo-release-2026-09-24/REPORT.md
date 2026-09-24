# SEO maintenance — 24 September 2026

## Verified before changes

Search Console sitemap report: submitted and processed September 22, success, 73 discovered URLs. Page indexing report last updated September 21. The removed Irina case returns HTTP 404 and is absent from the XML sitemap. All 73 sitemap URLs returned 200 with self canonical and no HTML noindex. These checks establish technical availability, not index inclusion.

## Changes

- Retired ai-sales-assistant.html redirects permanently to telegram-ai-crm.html in the same language, including the unprefixed Russian alias. The retired page shows the Telegram product now covered by the current case. Its metadata also points to the replacement as a fallback.
- Removed the four retired URLs from XML sitemap. The resulting 69 URLs retain published articles and current indexable cases, including the SHEPIT overview; no unrelated redirect was added for the deleted Irina case.
- Rebuilt HTML maps for all languages from XML sitemap. They now link directly to every indexable page, with existing homepage/footer links providing a discovery route. Unpublished journal sections are not promoted by these maps.
- Repaired legacy case breadcrumbs: the Cases parent points to the homepage case catalog; final items use exact canonical URLs without a trailing slash after .html. The metadata generator uses the same helper to prevent regressions.
- Added explicit text/plain and application/xml MIME types for robots.txt and sitemap.xml.

## Validation

- 16 automated tests passed, including same-language redirects, deleted-page behavior, sitemap indexability, complete HTML-map coverage and case breadcrumb destinations.
- Local HTTP crawl: 255 internal page/asset addresses, zero non-200 results after following valid redirects.
- Article source validation: 76 sources, 95 pages, zero outdated pages.

Google independently controls crawling and indexing. No claim of guaranteed index inclusion or a guaranteed deadline is made.

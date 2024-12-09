# Under Construction

_[Draft documentation]_

This repository is a prototype website directory for the U.S. Federal Government.  The [directory file](https://github.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv) can be [downloaded directly here](https://github.com/GSA/federal-website-directory/raw/main/us-government-website-directory.csv).  

## What the Website Directory is...

The Federal Website Directory is a comprehensive list of the public-facing websites of the U.S. Federal Government, spanning all three branches and noting which agency and bureau operates the site.  

For the purpose of this directory: 
- "Public-facing” means intended to be accessed and used by a member of the public or a customer, as opposed to a site which is intended to be accessed and used only by current Federal Government employees or contractors on behalf of an agency.
- “Website” means a group of globally accessible interlinked web pages under a unique host name that is accessible using a web browser.
  - The website should be listed (and should load properly) without “www.”
  - The website should be listed without any page paths (such as “/program/page1” or "/index.html").
  - The website should be listed without a protocol (such as "https://"). 
  - For example, “agency.gov” and “program.agency.gov” are proper acceptable URL structures for websites in this directory.
- Even if a website requires a user to log in, in which sense it is not accessible to the general public, it could still be public-facing if it is intended to be used by general public (such as online accounts for government services or benefits).
- Likewise, even if a website is accessible by the general public, it might not be intended for use by the general public (such as in the case of some beta or staging websites) and thus would not be public-facing.
- A website that is primarily used by federal employees or contractors but that is accessible to the public may be public-facing if the website content is of significant public value (e.g., for transparency purposes). Agencies must make this determination on a case-by-case basis.

The directory is maintained by an automated harvester that first gathers [each of the individual agency website inventory files](https://github.com/GSA/federal-website-directory/blob/main/builder/website_inventories.csv), creates [a snapshot of each agency file](https://github.com/GSA/federal-website-directory/tree/main/snapshots), and then combines them into [one combined directory](https://github.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv).  

#### Examples of what should be included:  
- Sites that are mostly behind logins but that are nonetheless public-facing. 
- Public-facing websites on the .gov and .mil top level domains only.
- Archived or scheduled-to-be-decommissioned websites, if still public-facing.
- Sites that resolve to a human-readable 'document' (e.g. HTML, TXT, PDF).

#### Examples of what should be excluded: 
- Redirects should not be included; instead, provide the final URL website that the target URL redirects to
- Dead or deprecated websites, including former public-facing websites that now redirect elsewhere
- API endpoints
- Sites that resolve to a machine-readable 'data file' (e.g. XML, JSON, CSV)
- FTP servers
- Mail servers
- Staging or development sites that are not public-facing
- Website assets
- Infrastructure-only domains (e.g. www2.x.gov)
- Admin panels that are not public-facing
- Collaboration sites that are not public-facing
- Software as a service sites (e.g. agency.sharepoint.com)
- Social media websites 


## How to update an agency's website directory...

Each agency is required to host and keep up to date their public website inventory at `agency.gov/websites.csv` with the following specifications: 

- The inventory file must follow the schema demonstrated with [this example file](https://github.com/GSA/federal-website-directory/blob/main/builder/example.csv).
- The `website` field should not contain a protocol (e.g. https://), port (e.g. :8080), or path (e.g. /anything).  In other words, it should only contain subdomains, root domains, and the top level domain (e.g. `x.y.gov`).
- Furthermore, `www.` should not be included for any website.  https://www.x.gov should be represented as `x.gov` and https://www.x.y.gov should be represented as `x.y.gov` in the Website field.  
- The `agency` and `bureau` names should be pulled from and match exactly those in XXXXXXX file.
- The `subcomponent` field is optional and should express which office or sub-bureau component operates a website. There is not a source file that specifies what those should be, but the spelling and capitalization should be consistent across an agency's entries.
- The inventory file should be kept up to date with what is currently live on the public internet.  Planned but not yet live sites should not be included.  Sites that are scheduled for but have not yet been decomissioned should remain.  When sites go live or are turned off, they should then be added or removed from the inventory file.
- agency.gov/websites.csv can redirect to a final URL, but the file must resolve when https://agency.gov/websites.csv is loaded into a browser.  

This model is [similar to other reporting requirements](https://github.com/GSA/site-scanning/issues/1104) and attempts to be straightforward for agencies to manage however works best for them.  

#### Quick Links
- [Where to find an agency's website inventory](https://github.com/GSA/federal-website-directory/blob/main/builder/website_inventories.csv).
- [The guidelines to follow for what should go in a website inventory](https://github.com/GSA/federal-website-directory/tree/future-prototype?tab=readme-ov-file).
- [A report suggesting sites that agencies may want to add to their inventories](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_addition.csv) (live, have DAP, don't redirect, and not being filtered as likely non-public sites).
- [A report suggesting sites that agencies may want to remove from their inventories](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_removal.csv) (Redirects or has a 4xx, 5xx status code).

## How to Get Help...

This Directory is overseen by the [Site Scanning program](https://digital.gov/site-scanning) at GSA.  You can contact them anytime at [site-scanning@gsa.gov](mailto:site-scanning@gsa.gov)

## Why is this directory necessary?  

- There is no central catalog of all federal websites that can point to which all websites the government operates for public use.  This directory provides that.
- This directory provides another important service, answering not just which agency, but which bureau and subcomponent administers which website.  The [.gov registry that is published by CISA](https://github.com/cisagov/dotgov-data/blob/main/current-federal.csv) can only provide that information for an entire base domain and does not have fidelity at the subdomain level.  

## Helpful Links
- [Website directory file made interative via Flat GitHub](https://flatgithub.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)
- [Website directory file via GitHub.dev](https://github.dev/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)

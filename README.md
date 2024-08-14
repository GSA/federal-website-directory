# Under Construction

_[Draft documentation]_

This repository is a prototype website directory for the U.S. Federal Government.  The [directory file](https://github.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv) can be [downloaded directly here](https://github.com/GSA/federal-website-directory/raw/main/us-government-website-directory.csv).  

## What the Website Directory is...

The Federal Website Directory is a comprehensive list of the public-facing websites of the U.S. Federal Government, spanning all three branches and noting which agency and bureau operates the site.  

For the purpose of this directory: 
- "Public-facing” means intended to be accessed and used by a member of the public or a customer, as opposed to a site which is intended to be accessed and used only by current Federal Government employees or contractors on behalf of an agency.
- “Website” means a group of globally accessible interlinked web pages under a unique host name that is accessible using a web browser.


#### Examples of what should be included:  
- Redirects that resolve to public websites
- Sites that are mostly behind logins but which are used by members of the public
- Public websites on any top level domain (not just .gov or .mil, but any .com/.org/etc. operated by the agency).
- Archived websites, if still publicly accessible
- Sites that resolve to a human-readable 'document' (e.g. HTML, TXT, PDF)

#### Examples of what should be excluded: 
- API endpoints
- Sites that resolve to a machine-readable 'data file' (e.g. XML, JSON, CSV)
- FTP servers
- Mail servers
- Staging or development sites
- Website assets
- Infrastructure-only domains (e.g. www2.x.gov)
- Admin panels used only by current agency staff or contractors
- Collaboration sites used only by current agency staff or contractors
- Dead or deprecated websites, if the URL no longer resolves to a live site
- Software as a service sites (e.g. agency.sharepoint.com)
- Social media websites 


## Who should update the Website Directory...

Most agencies have designated a digital experience lead as part of their implementation of OMB-23-22.  These agency points of contact [can be found here](https://community-dc.max.gov/display/OFCIO/M-23-22+Delivering+a+Digital-First+Public+Experience).  They, or their designated deputy, will be given edit access to this repository and will have the ability to either directly edit the directory file or approve changes suggested by someone else.  

## How to update the Website Directory...

Agency points of contact are able to update the directory by [directly editing the file here](https://github.com/GSA/federal-website-directory/edit/main/us-government-website-directory.csv) or by merging a pull request that proposes changes.  

Important requirements when updating the directory file: 
- The file should be sorted alphabetically by Agency then Bureau then Website.
- The Website field should not contain a protocol (e.g. https://), port (e.g. :8080), or path (e.g. /anything).  In other words, it should only contain subdomains, root domains, and the top level domain (e.g. `x.y.gov`).
- Furthermore, `www.` should not be included for any website.  https://www.x.gov should be represented as `x.gov` and https://www.x.y.gov should be represented as `x.y.gov` in the Website field.  
- The Agency and Bureau names should be pulled from and match exactly those in XXXXXXX file.  

## How to Get Help...

This Directory is overseen by the [Site Scanning program](https://digital.gov/site-scanning) at GSA.  You can contact them anytime at [site-scanning@gsa.gov](mailto:site-scanning@gsa.gov)

Agencies should email the Site Scanning team to request changes or updates to who from their agency should have access to update this directory.  

## Helpful Links
- [Website directory file made interative via Flat GitHub](https://flatgithub.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)
- [Website directory file via GitHub.dev](https://github.dev/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)

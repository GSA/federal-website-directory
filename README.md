# Under Construction

_[Draft documentation]_

This repository is a prototype website directory for the U.S. Federal Government.  The [directory file](https://github.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv) can be [downloaded directly here](https://github.com/GSA/federal-website-directory/raw/main/us-government-website-directory.csv).  

## What the Website Directory is...

The Federal Website Directory is a comprehensive list of the public-facing websites of the U.S. Federal Government, spanning all three branches and noting which agency and bureau operates the site.  

For the purpose of this directory: 
- "Public-facing” means intended to be accessed and used by a member of the public or a customer, as opposed to a site which is intended to be accessed and used only by current Federal Government employees or contractors on behalf of an agency.
- “Website” means a group of globally accessible interlinked web pages under a unique host name that is accessible using a web browser.
- Even if a website requires a user to log in, in which sense it is not accessible to the general public, it could still be public-facing if it is intended to be used by general public (such as online accounts for government services or benefits).
- Likewise, even if a website is accessible by the general public, it might not be intended for use by the general public (such as in the case of some beta or staging websites) and thus would not be public-facing.
- A website that is primarily used by federal employees or contractors but that is accessible to the public may be public-facing if the website content is of significant public value (e.g., for transparency purposes). Agencies must make this determination on a case-by-case basis.



#### Examples of what should be included:  
- Redirects that are at the sub-domain/domain level should be included
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
- Dead or deprecated websites, once the URL no longer resolves to a live site
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
- The Subcomponent field is optional and should express which office or sub-bureau component operates a website. There is not a source file that specifies what those should be, but the spelling and capitalization should be consistent across an agency's entries.

For individual additions or subtractions, it may be easiest to [directly editing the file](https://github.com/GSA/federal-website-directory/edit/main/us-government-website-directory.csv) (be sure to maintain the alphabetical order (of first Agency, then Bureau, then Website).  However, if an agency has many changes to make, they can also download the directory by [saving this file](https://github.com/GSA/federal-website-directory/raw/main/us-government-website-directory.csv); open it in a spreadsheet program such as Excel or Sheets; make the necessary edits; and save and re-export the file as a CSV file.  At that point, the hosted version can be either overwritten or the new CSV can be opened with a text editor and the contents copied and pasted when editing the file  in the browser.  

**It is very important to maintain the alphabetical order of the file though.  Any proposed edits that do not maintain it may not be merged, and any commits that are out of order may be updated by the Site Scanning team in order to reorder the file.  **

## How to Get Help...

This Directory is overseen by the [Site Scanning program](https://digital.gov/site-scanning) at GSA.  You can contact them anytime at [site-scanning@gsa.gov](mailto:site-scanning@gsa.gov)

Agencies should email the Site Scanning team to request changes or updates to who from their agency should have access to update this directory.  

## Why is this directory necessary?  

- There is no central catalog of all federal websites that can point to which all websites the government operates for public use.  This directory provides that.
- This directory provides another important service, answering not just which agency, but which bureau and subcomponent administers which website.  The [.gov registry that is published by CISA](https://github.com/cisagov/dotgov-data/blob/main/current-federal.csv) can only provide that information for an entire base domain and does not have fidelity at the subdomain level.  

## Helpful Links
- [Website directory file made interative via Flat GitHub](https://flatgithub.com/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)
- [Website directory file via GitHub.dev](https://github.dev/GSA/federal-website-directory/blob/main/us-government-website-directory.csv)

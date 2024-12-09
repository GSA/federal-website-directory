This folder contains automatically generated reports that flag websites that agencies may want to consider adding or removing from their website inventories.  They are generated in the following manner:


[Candidates for Removal](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_removal.csv_):


- Has omb_idea source
- Has a filter flag
  - Or has a final_url_same_website=false 
  - Or has status code = 4xx,5xx

[Candidates for Addition](https://github.com/GSA/federal-website-directory/blob/main/reports/candidate_for_addition.csv):


- Does not have omb_idea source
- Does not have a filter flag
- Has a status code = 2xx
- Has dap=true
- Doesn't redirect

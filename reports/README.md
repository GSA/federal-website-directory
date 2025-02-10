This folder contains automatically generated reports that flag websites that agencies may want to consider adding or removing from their website inventories.  They are generated in the following manner:


[Candidates for Removal](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_removal.csv):


- Is in the Public Website Inventory
- Is Executive Branch
- Has a filter flag
  - Or redirect=TRUE
  - Or has status code = 4xx,5xx

[Candidates for Addition](https://github.com/GSA/federal-website-directory/blob/main/reports/candidate_for_addition.csv):


- Is not in the Public Website Inventory
- Is Executive Branch
- Does not have a filter flag
- Has a status code = 2xx
- Has dap=true
- Doesn't redirect

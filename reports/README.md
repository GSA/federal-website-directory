This folder contains automatically generated reports that flag websites that agencies may want to consider adding or removing from their website inventories.  They are generated in the following manner:


[Candidates for Removal](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_removal.csv):


- Is in the Public Website Inventory (source contains `omb_idea`)
- Is Executive Branch (branch=executive)
- Has a filter flag (filter=TRUE)
  - Or redirects (redirect=TRUE)
  - Or is down (status code = 4xx or 5xx)

[Candidates for Addition](https://github.com/GSA/federal-website-directory/blob/main/reports/candidates_for_addition.csv):


- Is not in the Public Website Inventory (source does not contain `omb_idea`)
- Is Executive Branch (branch=executive)
- Does not have a filter flag (filter does not equal TRUE)
- Has a status code = 2xx (status code = 2xx)
- Has DAP (dap=true)
- Doesn't redirect (redirect does not equal TRUE)

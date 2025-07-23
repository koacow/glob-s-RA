/*******************************************************************************
   Radical Innovation × Disasters – Sun & Abraham Event‑Study
   Stata 18  |  grid_id × year panel (1980–2022)
   
*******************************************************************************/

/* 0.  House‑keeping --------------------------------------------------------- */
clear all
set more off

*  install / update once per machine
cap which github
if _rc net install github, from("https://haghish.github.io/github/")
cap github install lsun20/eventstudyinteract, replace
cap ssc install estout,      replace
cap ssc install event_plot,  replace
cap ssc install coefplot,    replace    // optional for later

/* 1.  Load panel ------------------------------------------------------------ */
import delimited "../grid_panel_full_1980_2022.csv", clear
* expected columns: grid_id year hit <outcomes> <controls>

/* (recommended) give terse labels now so tables & graphs inherit them ------- */
label variable num_patents "Patent count"
label variable mean_atypicality_score "Atypicality"
label variable mean_entropy_score "Novelty entropy"
label variable mean_impact_score "Citation impact"

/* 2.  Globals & output folders --------------------------------------------- */
global FE    absorb(grid_id year)
global CLU   vce(cluster grid_id)
global WIN   window(-5 10) binnedbelow(-5) binnedabove(6) reference(-1)
global COV   total_pop median_household_income bachelors_pct ///
            white_pct black_pct asian_pct other_pct         ///
            personal_income rgdp unemployment_rate rucc_2013

cap mkdir results
cap mkdir results/tables
cap mkdir results/plots

/* 3.  First‑hit cohort & never‑treated flag -------------------------------- */
egen first_hit = min(cond(hit==1, year, .)), by(grid_id)
gen  treat_year = first_hit                       // . if never hit
drop first_hit

* flag never‑treated grids
bysort grid_id: egen ever_treated = max(hit)
gen never_treated = (ever_treated==0)
drop ever_treated

* carry cohort forward (post‑hit) AND backward (pre‑hit)
bysort grid_id (year): replace treat_year = treat_year[_n-1] if missing(treat_year)
bysort grid_id (year): replace treat_year = treat_year[_n+1] if missing(treat_year)

/* 4.  Sun & Abraham regressions ------------------------------------------- */
local outcomes num_patents mean_atypicality_score ///
               mean_entropy_score mean_impact_score

foreach y of local outcomes {
    
    /* 4a. FE only --------------------------------------------------------- */
    eventstudyinteract `y' treat_year year,            ///
        cohort(treat_year) control_cohort(never)       ///
        $WIN $FE $CLU
    
    estimates store FEonly_`y'
    esttab FEonly_`y' using "results/tables/SA_`y'_A.rtf", ///
          replace se ar2 star(* 0.10 ** 0.05 *** 0.01)     ///
          title("Model A – `y' (FE only)")
    
    /* 4b. FE + controls --------------------------------------------------- */
    eventstudyinteract `y' treat_year year,            ///
        cohort(treat_year) control_cohort(never)       ///
        covariates($COV)                               ///
        $WIN $FE $CLU
    
    estimates store FEcov_`y'
    esttab FEcov_`y' using "results/tables/SA_`y'_B.rtf", ///
          replace se ar2 star(* 0.10 ** 0.05 *** 0.01)     ///
          title("Model B – `y' (FE + covariates)")
    
    /* 4c. Event‑study plot (Model B) ------------------------------------- */
    event_plot e(b_iw)#e(V_iw), default_look ci          ///
       graph_opt(title("Event‑time effects: `y'")         ///
                 xtitle("Years relative to first disaster") ///
                 ytitle("Average causal effect"))          ///
       name(ES_`y', replace)
    graph export "results/plots/ES_`y'.png", replace
}

/* 5.  Post‑estimation summaries ------------------------------------------ */
local outcomes_std num_patents mean_atypicality_score mean_entropy_score
local outcomes_cit mean_fwd_citation_impact_score

foreach y of local outcomes_std {
    estimates restore FEcov_`y'
    
    * parallel‑trend F‑test
    testparm L5 L4 L3 L2
    estimates store Pre_`y'
    
    * short / medium / long / cumulative windows
    lincom F0 + F1 + F2
    estimates store Short_`y'
    lincom F3 + F4
    estimates store Med_`y'
    lincom F5 + F6
    estimates store Long_`y'
    lincom F0 + F1 + F2 + F3 + F4 + F5 + F6
    estimates store Cum_`y'
    
    esttab Short_`y' Med_`y' Long_`y' Cum_`y' using ///
        "results/tables/SUM_`y'.rtf", replace se       ///
        label title("Summary effects – `:var label `y''")
}

foreach y of local outcomes_cit {
    preserve
        keep if year<=2013 & treat_year<=2013 & treat_year>=2003
        estimates restore FEcov_`y'
        
        testparm L5 L4 L3 L2
        estimates store Pre_`y'
        
        lincom F0 + F1 + F2
        estimates store Short_`y'
        lincom F3 + F4
        estimates store Med_`y'
        lincom F5 + F6
        estimates store Long_`y'
        lincom F0 + F1 + F2 + F3 + F4 + F5 + F6
        estimates store Cum_`y'
        
        esttab Short_`y' Med_`y' Long_`y' Cum_`y' using ///
            "results/tables/SUM_`y'.rtf", replace se       ///
            label title("Summary effects – `:var label `y'' (citation‑adj.)")
    restore
}

/* 6.  Placebo test on num_patents ----------------------------------------- */
preserve
    keep if never_treated
    set seed 2025
    gen treat_placebo = floor(2003 + 11*runiform())   // [2003,2013]
    tempfile fake
    save `fake'
restore
merge 1:1 grid_id using `fake', keep(master match) nogen

eventstudyinteract num_patents treat_placebo year,            ///
    cohort(treat_placebo) control_cohort(never)               ///
    $WIN $FE $CLU
event_plot e(b_iw)#e(V_iw), default_look ci                  ///
    graph_opt(title("Placebo – num_patents")                 ///
              xtitle("Years relative to placebo shock"))     ///
    name(Placebo_num_patents, replace)
graph export "results/plots/Placebo_num_patents.png", replace
erase `fake'

/* 7.  Completion banner ---------------------------------------------------- */
di as txt "=== Sun & Abraham estimation and diagnostics finished successfully ==="
exit

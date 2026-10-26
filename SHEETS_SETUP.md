# Google Sheets setup (about 5 minutes)

The task sends each trial to a Google Apps Script Web App, which appends it to a sheet.
Use a **new** sheet and script for this study. The gaze-cueing script writes different columns.

1. Create a new Google Sheet. Name it something like `Print Title Search Data`.
2. In the sheet, choose **Extensions > Apps Script**.
3. Delete the starter code, paste in everything from `apps-script/Code.gs`, and save.
4. Choose **Deploy > New deployment**. Click the gear and pick **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions, and copy the **Web app URL** (it ends in `/exec`).
6. In `index.html`, paste that URL into `CONFIG.sheetWebAppUrl`. Commit and push.
7. Run a test session and confirm two tabs appear: **Trials** (one row per trial) and **Summary** (one row per participant).

If you change `Code.gs` later, choose **Deploy > Manage deployments > Edit > New version** or the old code keeps running.

You can also test without editing the file by adding `?sheet=YOUR_URL` to the page address.

## Columns in the Trials tab

| Column | Meaning |
|---|---|
| `session_id` | Participant ID (typed or auto-generated) |
| `consent`, `consent_version`, `consent_timestamp` | Consent given (`yes`), which wording was shown, and when. Participants who decline are never logged |
| `trial_num`, `phase`, `block_num`, `block_trial_num` | Order; `phase` is `practice` or `experimental` |
| `analysis_include` | 1 for experimental trials after the first 2 of each block; 0 otherwise. The summary uses only these |
| `set_size` | Number of photos in the memory set (2, 4, or 6) |
| `set_type` | `mixed` (half warm, half cool) or `neutral` (all black and white) |
| `probe_status` | `old` (in the set) or `new` |
| `probe_treatment` | `warm`, `cool`, or `bw` |
| `probe_item`, `set_items` | Photo number plus treatment letter (`22c` is photo 22, cool; `w` warm, `b` black and white). Set items are in screen order |
| `probe_pos` | Position of the probe in the gallery (0 up to set size minus 1, left to right, top to bottom); `NA` for new probes |
| `n_warm_in_set`, `n_cool_in_set`, `n_bw_in_set` | Composition of the memory set |
| `probe_warmth`, `probe_luma` | Colorimetric warmth (mean red minus mean blue) and luminance of the probe image, 0 to 1 scale |
| `set_mean_warmth`, `set_mean_luma` | The same, averaged over the memory set |
| `key_mapping` | `z_old` or `m_old` (randomized per participant) |
| `response` | `old`, `new`, or `timeout` |
| `outcome` | `hit`, `miss`, `false_alarm`, `correct_rejection`, or `timeout` |
| `correct` | 1 or 0 |
| `response_time_ms` | From probe onset; `NA` on timeouts |
| `study_ms_set`, `study_ms_actual`, `retention_ms` | Requested and measured gallery time, and the blank delay |
| `screen_w`, `screen_h`, `dpr`, `timestamp` | Device and time |

## Summary tab

One row per participant. Prefixes are `warm_`, `cool_`, `bw_` (by probe treatment) and `all_`.

- `n_old`, `n_new`, `hits`, `false_alarms`, `hit_rate`, `fa_rate`, `d_prime`, `criterion_c`: signal detection measures. Rates use the
  log-linear correction (add 0.5 to each count, 1 to each total). Timeouts and discarded trials are excluded.
- `mean_rt_correct`: mean RT on correct trials.
- `slope_old`, `intercept_old`, `slope_new`, `intercept_new`, `slope_all`, `intercept_all`: least-squares line of mean correct RT on set
  size. The slope is ms per photo (scanning rate); the intercept is everything that is not scanning.
- `rt_{treatment}_{old|new}_n{size}`: mean correct RT in each cell, for plotting.
- `treatment_map`: which treatment each of the 44 photos had for this participant (`01w,02c,...`).
- `n_trials_logged`, `n_trials_analyzed`, `n_timeouts`, `study_ms_per_item`.

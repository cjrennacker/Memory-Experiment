# Print Memory Scan Task

A browser-based Sternberg memory-scanning study for HSE 540. On each trial participants study a small gallery of
landscape prints (the memory set), the gallery disappears, then a single probe print appears. They press a key to say
whether the probe was in the gallery (old) or not (new). The task logs accuracy (hits and false alarms, so `d'` and `c`)
and reaction time as a function of set size (the Sternberg slope).

## Design

- **Task:** the varied-set ("Sv") Sternberg task. A new memory set on every trial, a blank retention delay, then a probe.
- **Set size:** 2, 4, or 6 photos. Gallery time is 1000 ms per photo (2 s, 4 s, 6 s), set by `CONFIG.studyMsPerItem`.
- **Color treatment:** every photo is converted to black and white. Warm photos get a solid `#ff0000` layer and cool photos a
  solid `#001eff` layer, both in the Screen blend mode at 60% opacity. Black and white photos are left as they are.
- **Memory sets:** *mixed* sets hold equal numbers of warm and cool photos (1+1, 2+2, 3+3). *Neutral* sets are all black and white.
  The probe always matches its set type, so a new probe is the same treatment as the photos it is being compared with.
- **Conditions (within subjects):** set size (3) x probe treatment (warm, cool, black and white) x probe status (old, new) = 18 cells,
  2 trials per cell per block, 3 blocks = 108 trials (6 per cell), after 12 practice trials. About 15 minutes.
- **Counterbalancing:** which photos are warm, cool, or black and white is randomized per participant (15 / 15 / 14), so no photo is
  tied to a color. The old/new keys (Z and M) are counterbalanced.
- **Sternberg housekeeping:** the first 2 trials of each block are logged but flagged `analysis_include = 0`. A new probe never comes
  from the previous trial's gallery, and the previous gallery's photos are avoided when building the next one.
  Block-end feedback shows accuracy and speed.

## Measures

- **SDT:** hit rate, false-alarm rate, `d'` and `c` for warm, cool, black and white, and all probes (log-linear correction).
- **Scanning:** mean correct RT at each set size, and least-squares slope (ms per photo) and intercept, for old probes, new probes, and both.
- **Covariates:** each trial logs the probe's colorimetric warmth (mean red minus mean blue, 0 to 1 scale) and luminance, plus the
  set means. Use them for the ANCOVA idea from class.

## Files

```
index.html               the whole task (HTML, CSS, JavaScript)
apps-script/Code.gs      Google Apps Script that writes rows to your sheet
SHEETS_SETUP.md          sheet setup and column dictionary
images/print_NN_{warm,cool,bw}.jpg   the treated photos (44 x 3)
images/stats.js          warmth and luminance of every treated photo
images/source/           the original photos, used to rebuild the treatments
tools/make_treatments.py rebuilds the treated photos and stats.js
```

## Run it locally

Open `index.html` in a browser. Add `?quick=1` for a 2-minute test run, `?T=1500` to change the gallery time per photo (in ms).

## Change the colors or strength

```
python3 tools/make_treatments.py --opacity 1.0     # full-strength Screen layer
python3 tools/make_treatments.py --warm "#ff0000" --cool "#001eff" --opacity 0.6
```

Full strength (1.0) turns every dark pixel pure red or blue, which is a heavy look. 0.6 keeps more of the photo's own tones.
Warm and cool come out within about 0.02 of each other in average luminance at 0.6, which matters because a brighter tint
could help memory on its own.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, choose **Settings > Pages**, set the source to your main branch and the root folder, and save.
3. Your study is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Before you collect data

- **Sheet:** follow `SHEETS_SETUP.md`. Your Web App URL is already in `CONFIG.sheetWebAppUrl`.
- **Consent:** the first screen shows the ASU short-form consent with "I consent" and "I do not consent". Declining ends the session
  and sends no data. The task description in the consent text changed with this version, so confirm it still matches your approved protocol.
- **Timing:** run a pilot. If accuracy is at ceiling at set size 2, shorten `studyMsPerItem` a little. If it is near chance at size 6, lengthen it.
- **Monitors:** remote participants will see the red and blue differently. The logged warmth and luminance are nominal values for the image
  files, not what each screen showed.

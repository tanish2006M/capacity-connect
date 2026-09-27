/**
 * Capacity Connect - Comprehensive Course Curriculum & Lesson Database
 * Demo learning courses for organizational training
 */

import { Course, Module } from '../types';

export const COMPREHENSIVE_COURSES: Course[] = [
  {
    id: 'crs_weather',
    code: 'WDA-201',
    title: 'Weather Data Analysis',
    tagline: 'Extract insights, clean meteorological registries, and interpret spatial weather variables.',
    description: 'A hands-on program designed for trainees and public service analysts to examine structured meteorological datasets, assess atmospheric indicators, detect anomalies, and build operational weather visualizations.',
    category: 'Data & Analytics',
    level: 'Intermediate',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    trainerDesignation: 'Senior Faculty & Lead Data Analyst',
    durationHours: 16,
    modulesCount: 4,
    lessonsCount: 12,
    status: 'published',
    enrolledCount: 384,
    rating: 4.9,
    skillsCovered: ['Meteorological Datasets', 'Data Cleaning', 'Statistical Modeling', 'Time Series Visualization'],
    thumbnailUrl: '/images/courses/data-analytics.jpg',
    objectives: [
      'Understand basic weather datasets and data collection standards',
      'Analyze structured weather data across tabular and grid formats',
      'Interpret common meteorological variables (temperature, pressure, precipitation)',
      'Create clear visualizations and time-series plots for departmental briefings',
    ],
    modules: [
      {
        id: 'mod_wda_01',
        courseId: 'crs_weather',
        title: 'Module 1 — Introduction to Weather Data',
        description: 'Explore the fundamental structure of meteorological observations and national observational networks.',
        order: 1,
        lessons: [
          {
            id: 'les_wda_01',
            moduleId: 'mod_wda_01',
            title: '1. Understanding Weather Data',
            description: 'Introduction to observation frequencies, surface stations, automated sensors, and standard meteorological parameters.',
            durationMinutes: 20,
            type: 'video',
            order: 1,
            content: `### Overview of Meteorological Datasets

Weather data comprises systematic, time-stamped observations of atmospheric parameters recorded at fixed surface stations, automated weather stations (AWS), radar installations, and radiosonde soundings.

#### Key Characteristics of Atmospheric Observations:
1. **High Temporal Granularity:** Surface weather data is typically sampled at 15-minute, hourly, and synoptic intervals (00:00, 03:00, 06:00, 12:00 UTC).
2. **Multi-Parameter Co-occurrence:** Every observation packet includes simultaneous measurements of ambient temperature, dewpoint, pressure, relative humidity, wind speed, wind azimuth, and cumulative rainfall.
3. **Spatial Distribution:** Data is organized across coordinate reference systems (lat/lon grids or projected coordinates), allowing regional interpolation between observation stations.

#### Common Data Formats in Operational Meteorology:
- **SYNOP / METAR:** Compact alphanumeric codes used internationally by aviation and meteorological organizations.
- **NetCDF (Network Common Data Form):** Self-describing, multidimensional scientific array format used for gridded reanalysis models.
- **CSV & Parquet:** Tabular columnar data commonly utilized for departmental analytics and reporting pipelines.`,
            keyTakeaways: [
              'Weather data requires strict time synchronisation across Universal Coordinated Time (UTC).',
              'Quality assurance flags (QA/QC) must always be validated before analytical modeling.',
              'Automated station data may contain transient sensor dropouts that require imputation.',
            ],
            resources: [
              { title: 'WMO Standard Guide to Meteorological Instruments', type: 'PDF', size: '2.4 MB' },
              { title: 'Sample Surface Station Record (CSV)', type: 'Dataset', size: '480 KB' },
            ],
          },
          {
            id: 'les_wda_02',
            moduleId: 'mod_wda_01',
            title: '2. Meteorological Variables',
            description: 'Deep dive into thermodynamic and kinetic variables: dry bulb temperature, wet bulb depression, atmospheric pressure, and dewpoint.',
            durationMinutes: 25,
            type: 'document',
            order: 2,
            content: `### Thermodynamic & Kinetic Variables

To conduct meaningful weather data analysis, an analyst must understand physical units, sensor tolerances, and thermodynamic correlations between variables.

#### 1. Temperature Parameters:
- **Dry Bulb Temperature ($T$):** The thermodynamic temperature of free air, measured shielded from direct radiation. Recorded in degrees Celsius (°C) or Kelvin (K).
- **Dew Point Temperature ($T_d$):** The temperature to which air must be cooled at constant pressure to become saturated with water vapor. When $T = T_d$, relative humidity is 100%.

#### 2. Atmospheric Pressure:
- **Station Level Pressure:** Actual barometric pressure measured at the station barometer elevation.
- **Mean Sea Level Pressure (MSLP):** Pressure adjusted to sea level via the hypsometric equation (standard benchmark: 1013.25 hPa). Essential for comparing stations at different elevations.

#### 3. Precipitation & Wind:
- **Precipitation Accumulation:** Measured in millimeters (mm) where 1 mm represents 1 liter of water per square meter.
- **Wind Vector:** Consists of **Magnitude** (speed in knots, m/s, or km/h) and **Direction** (degrees from true north, from which the wind blows).`,
            keyTakeaways: [
              'Always convert station pressure to Mean Sea Level Pressure (MSLP) when comparing geographic regions.',
              'Dew point depression ($T - T_d$) is a direct indicator of moisture deficit in the boundary layer.',
              'Wind directions represent where the air is coming from, not where it is heading.',
            ],
            resources: [
              { title: 'Thermodynamic Formula Sheet & Conversions', type: 'PDF', size: '1.1 MB' },
            ],
          },
          {
            id: 'les_wda_03',
            moduleId: 'mod_wda_01',
            title: '3. Sources of Weather Data',
            description: 'Accessing public repositories, national weather services, automated telemetry portals, and open reanalysis archives.',
            durationMinutes: 18,
            type: 'interactive',
            order: 3,
            content: `### Public & Operational Data Sources

Modern weather analysts leverage a mixture of in-situ telemetry, satellite radiance feeds, and numerical reanalysis models.

#### Primary Open Observational Repositories:
1. **National Weather Telemetry Gateways:** Automated weather station (AWS) feeds providing near-real-time departmental records.
2. **ERA5 Reanalysis (ECMWF):** Comprehensive global atmospheric reanalysis providing hourly estimates of atmospheric variables on a 30 km grid dating back to 1940.
3. **NOAA Global Historical Climatology Network (GHCN):** Quality-controlled daily and monthly records from over 100,000 stations globally.

#### API Ingestion Best Practices:
- Always specify bounding boxes (latitude/longitude coordinates) to limit payload overhead.
- Cache static historical periods locally to avoid redundant bandwidth consumption.
- Validate missing value sentinels (frequently encoded as \`-9999.0\`, \`NaN\`, or empty strings).`,
            keyTakeaways: [
              'Reanalysis data models fill spatial gaps between physical observation stations.',
              'Check station metadata for sensor relocation or changes in instrumentation over time.',
            ],
            resources: [
              { title: 'API Access Checklist for Meteorological Portals', type: 'Cheatsheet', size: '320 KB' },
            ],
          },
        ],
      },
      {
        id: 'mod_wda_02',
        courseId: 'crs_weather',
        title: 'Module 2 — Working With Weather Data',
        description: 'Practical processing of temperature, precipitation, and wind sensor observations.',
        order: 2,
        lessons: [
          {
            id: 'les_wda_04',
            moduleId: 'mod_wda_02',
            title: '1. Temperature Data',
            description: 'Processing diurnal temperature ranges, thermal anomalies, extreme heat thresholds, and degree-day calculations.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### Processing Temperature Records

Analyzing temperature profiles requires isolating diurnal oscillations, calculating rolling baselines, and establishing threshold deviations.

#### 1. Calculating Diurnal Temperature Range (DTR):
$$DTR = T_{\\text{max}} - T_{\\text{min}}$$
A shrinking DTR often correlates with elevated nocturnal humidity or urban heat island effects.

#### 2. Cooling & Heating Degree Days (CDD / HDD):
Degree-days measure the energy required to heat or cool public facilities relative to a standard baseline (typically 18°C / 65°F):
- $$\\text{CDD} = \\max(0, T_{\\text{mean}} - 18)$$
- $$\\text{HDD} = \\max(0, 18 - T_{\\text{mean}})$$

#### 3. Identifying Heat Wave Episodes:
National standards generally define a heat wave when maximum temperature exceeds normal climatological thresholds by ≥4.5°C for at least two consecutive recording stations.`,
            keyTakeaways: [
              'Diurnal temperature range is sensitive to cloud cover and atmospheric aerosol loading.',
              'Degree days provide direct operational inputs for infrastructure energy demand forecasting.',
            ],
            resources: [
              { title: 'Temperature Analysis Python Script (Jupyter)', type: 'Code', size: '120 KB' },
            ],
          },
          {
            id: 'les_wda_05',
            moduleId: 'mod_wda_02',
            title: '2. Rainfall Data',
            description: 'Cumulative precipitation curves, rainfall intensity categorization, dry spells, and monsoon tracking.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Precipitation Metrics & Frequency Analysis

Rainfall datasets exhibit significant non-normal distributions with high skewness and numerous zero-value observations.

#### Standard Classification of 24-Hour Precipitation:
- **Light Rain:** 2.5 mm – 15.5 mm
- **Moderate Rain:** 15.6 mm – 64.4 mm
- **Heavy Rain:** 64.5 mm – 115.5 mm
- **Very Heavy Rain:** 115.6 mm – 204.4 mm
- **Extremely Heavy Rain:** ≥ 204.5 mm

#### Key Statistical Metrics for Hydrologists:
1. **Rainy Days:** Days with measured precipitation ≥ 2.5 mm.
2. **Consecutive Dry Days (CDD):** Maximum duration of consecutive non-rain days, critical for agricultural risk mitigation.
3. **Cumulative Hyetograph:** Plotting accumulated rainfall over time to identify sudden cloudburst surges.`,
            keyTakeaways: [
              'Precipitation data should not be modeled with Gaussian distributions; use Gamma or Log-Pearson Type III.',
              'Always segregate trace precipitation (< 0.1 mm) from non-recording periods.',
            ],
            resources: [
              { title: 'Rainfall Intensity Categories Reference', type: 'PDF', size: '890 KB' },
            ],
          },
          {
            id: 'les_wda_06',
            moduleId: 'mod_wda_02',
            title: '3. Wind Data',
            description: 'Vector decomposition into U and V components, wind roses, gusts, and Beaufort scale mapping.',
            durationMinutes: 26,
            type: 'interactive',
            order: 3,
            content: `### Wind Vector Decomposition & Analysis

Because wind has both magnitude and direction, scalar averaging of wind direction produces mathematical errors. Wind data must be decomposed into orthogonal Cartesian components ($U$ and $V$).

#### Vector Decomposition Equations:
Given speed $S$ and direction $\\theta$ (in meteorological degrees, where 0° = North, 90° = East):
- **Zonal Component ($U$, West-to-East):**
  $$U = -S \\cdot \\sin\\left(\\frac{\\pi \\theta}{180}\\right)$$
- **Meridional Component ($V$, South-to-North):**
  $$V = -S \\cdot \\cos\\left(\\frac{\\pi \\theta}{180}\\right)$$

#### Reconstructing Mean Direction:
$$\\bar{\\theta} = \\left(270 - \\frac{180}{\\pi} \\cdot \\text{atan2}(\\bar{V}, \\bar{U})\\right) \\pmod{360}$$

#### Visualizing with Wind Roses:
A **Wind Rose** chart summarizes the frequency distribution of wind speeds categorized across the 16 cardinal compass directions (N, NNE, NE, etc.).`,
            keyTakeaways: [
              'Never compute the arithmetic average of wind direction angles directly.',
              'Decompose into U and V vectors, average the vector components, then reconstruct speed and direction.',
            ],
            resources: [
              { title: 'Wind Rose Generator Template (Excel/Python)', type: 'Template', size: '1.4 MB' },
            ],
          },
        ],
      },
      {
        id: 'mod_wda_03',
        courseId: 'crs_weather',
        title: 'Module 3 — Basic Analysis',
        description: 'Data cleaning, outlier mitigation, and identifying statistical anomalies.',
        order: 3,
        lessons: [
          {
            id: 'les_wda_07',
            moduleId: 'mod_wda_03',
            title: '1. Data Cleaning',
            description: 'Handling sensor drifts, frozen values, range-check flags, and missing observation imputation.',
            durationMinutes: 28,
            type: 'video',
            order: 1,
            content: `### Quality Control & Data Cleaning Protocols

Automated meteorological sensors are exposed to extreme environmental conditions that introduce signal noise, battery voltage drops, and mechanical freezing.

#### Core Quality Control (QC) Checks:
1. **Physical Plausibility Limits:**
   - Temperature outside -40°C to +55°C flagged as suspicious for temperate/tropical regimes.
   - Relative humidity > 100% or < 0% capped or flagged.
   - Wind speed < 0 m/s or > 75 m/s flagged.
2. **Persistence (Stuck Value) Test:**
   - If temperature or pressure remains constant to 0.01° precision for more than 4 consecutive hours, flag as sensor lockup.
3. **Step Change (Spike) Test:**
   - Detect non-physical delta steps (e.g., temperature jump > 5°C in 15 minutes without convective front passage).

#### Imputation Strategies:
- **Linear Interpolation:** Acceptable for gaps < 2 hours in continuously smooth variables (temperature, pressure).
- **Spatial Inverse Distance Weighting (IDW):** Use adjacent stations to estimate precipitation or missing diurnal periods.`,
            keyTakeaways: [
              'Never silently drop missing meteorological timestamps; mark them with explicit QC flags.',
              'Rainfall should never be linearly interpolated; use neighbor-station ratio estimation.',
            ],
            resources: [
              { title: 'Automated QC Pipeline Ruleset', type: 'Document', size: '650 KB' },
            ],
          },
          {
            id: 'les_wda_08',
            moduleId: 'mod_wda_03',
            title: '2. Basic Statistics',
            description: 'Computing percentiles, 30-year climatological normals, variance, and standardized precipitation indices.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Statistical Inference for Atmospheric Records

Evaluating whether current observations are normal requires comparing them against standardized 30-year reference baselines known as **Climatological Normals** (e.g., 1991–2020 standard normal period).

#### Statistical Tools in Meteorology:
- **Z-Score Normalization:**
  $$Z = \\frac{X - \\mu_{30}}{\\sigma_{30}}$$
  A Z-score exceeding $\\pm 2.0$ represents an event in the 95th percentile, indicative of severe anomalies.
- **Percentile Thresholds ($P_{90}, P_{95}, P_{99}$):**
  Used to determine localized extreme weather risk without making Gaussian distribution assumptions.
- **Rolling Moving Averages:**
  7-day and 30-day centered moving averages eliminate short-term synoptic noise and highlight seasonal trend lines.`,
            keyTakeaways: [
              '30-year climatological normals serve as the official scientific benchmark for anomalies.',
              'Percentiles are more robust than standard deviations for skewed parameters like rainfall.',
            ],
            resources: [
              { title: 'Climatological Normal Dataset (Sample)', type: 'Dataset', size: '820 KB' },
            ],
          },
          {
            id: 'les_wda_09',
            moduleId: 'mod_wda_03',
            title: '3. Finding Patterns',
            description: 'Identifying diurnal cycles, seasonal monsoonal trends, heat island signals, and correlation matrices.',
            durationMinutes: 25,
            type: 'interactive',
            order: 3,
            content: `### Pattern Recognition in Weather Records

Atmospheric variables oscillate on multiple overlapping scales: diurnal (24-hour), synoptic (3–7 days), seasonal (annual), and inter-annual (e.g., ENSO / El Niño Southern Oscillation).

#### Analytical Techniques:
1. **Autocorrelation Analysis:**
   Measures how a variable relates to its own past values across lag periods. Temperature exhibits strong 24-hour lag autocorrelation.
2. **Cross-Correlation Matrices:**
   - Strong negative correlation between temperature and relative humidity.
   - Sudden barometric pressure drops preceding localized convective wind squalls by 30–90 minutes.
3. **Anomaly Decomposition:**
   Decompose raw series $Y(t)$ into:
   $$Y(t) = \\text{Trend}(t) + \\text{Seasonal}(t) + \\text{Residual}(t)$$`,
            keyTakeaways: [
              'Decomposing seasonal components isolates genuine long-term climate anomalies.',
              'Lead-lag cross-correlations provide early warning signatures for extreme storms.',
            ],
            resources: [
              { title: 'Time Series Decomposition Guide', type: 'PDF', size: '1.2 MB' },
            ],
          },
        ],
      },
      {
        id: 'mod_wda_04',
        courseId: 'crs_weather',
        title: 'Module 4 — Visualization',
        description: 'Creating actionable meteorological charts, maps, and departmental briefing dashboards.',
        order: 4,
        lessons: [
          {
            id: 'les_wda_10',
            moduleId: 'mod_wda_04',
            title: '1. Charts',
            description: 'Building dual-axis meteograms, temperature range ribbons, and precipitation bar charts.',
            durationMinutes: 22,
            type: 'video',
            order: 1,
            content: `### Meteorological Chart Types: Meteograms & Ribbons

A **Meteogram** is the industry-standard visualization displaying multiple weather parameters synchronized along a single shared chronological x-axis.

#### Key Design Rules for Meteograms:
- **Top Panel:** Temperature (red line) and Dewpoint (green or blue dashed line) sharing the primary left y-axis (°C).
- **Middle Panel:** Atmospheric Pressure (MSLP in hPa) showing frontal passages.
- **Bottom Panel:** Precipitation bars (mm/hour) paired with wind barb vectors indicating speed and azimuth.

#### Temperature Envelope (Ribbon) Charts:
Displaying historical record high, historical normal range (25th to 75th percentile), and current recorded year provides immediate context for climate evaluation.`,
            keyTakeaways: [
              'Synchronizing multiple panels on a shared time axis reveals atmospheric cause-and-effect.',
              'Use shaded ribbons to convey historical uncertainty and normal envelopes.',
            ],
            resources: [
              { title: 'Meteogram Component Reference Code', type: 'Code', size: '95 KB' },
            ],
          },
          {
            id: 'les_wda_11',
            moduleId: 'mod_wda_04',
            title: '2. Comparing Variables',
            description: 'Scatter plots, thermal-humidity indices (heat index / wet bulb globe temperature), and multi-station comparisons.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Bivariate & Multivariate Comparative Analysis

Comparing atmospheric indicators simultaneously allows public administrators to assess compound hazard conditions.

#### The Heat Index ($HI$) Formulation:
Combines ambient air temperature and relative humidity to determine human-perceived equivalent temperature:
$$HI = c_1 + c_2 T + c_3 R + c_4 T R + c_5 T^2 + c_6 R^2 + \\dots$$

#### Hazard Tiers:
- **Caution (27°C – 32°C):** Fatigue possible with prolonged exposure and activity.
- **Extreme Caution (32°C – 41°C):** Heat cramps and heat exhaustion possible.
- **Danger (41°C – 54°C):** Heat cramps or exhaustion likely; heat stroke possible.
- **Extreme Danger (≥ 54°C):** Heat stroke highly imminent.`,
            keyTakeaways: [
              'Apparent temperature (Heat Index) is frequently a more vital emergency metric than raw temperature.',
              'Scatter plots of temperature versus humidity quickly expose air mass transitions.',
            ],
            resources: [
              { title: 'Heat Index Calculation Table & Matrix', type: 'PDF', size: '540 KB' },
            ],
          },
          {
            id: 'les_wda_12',
            moduleId: 'mod_wda_04',
            title: '3. Interpreting Results',
            description: 'Synthesizing charts into actionable administrative briefs, disaster warning advisories, and policy summaries.',
            durationMinutes: 25,
            type: 'document',
            order: 3,
            content: `### Synthesizing Findings for Operational Leadership

The ultimate goal of weather data analysis in public administration is to drive timely, evidence-based decision-making.

#### Structuring an Administrative Weather Advisory:
1. **Executive Headline:** Summary of impending event (e.g., *"Orange Alert: Severe Convective Squall with 65 km/h gusts projected between 15:00 and 19:00 IST"*).
2. **Confidence Metric:** High (>80%), Moderate (50–80%), or Low (<50%) based on model consensus.
3. **Geographic Impact Radius:** Specific administrative blocks or wards identified through spatial interpolation.
4. **Actionable Recommendations:** Departmental actions (e.g., stormwater pump readiness, agricultural harvest warnings, power grid contingency).`,
            keyTakeaways: [
              'Translate technical meteorological figures into concrete operational impact advisories.',
              'Always state forecasting lead-time and probabilistic confidence bands.',
            ],
            resources: [
              { title: 'Sample Departmental Weather Advisory Template', type: 'Document', size: '410 KB' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_climate',
    code: 'CSF-101',
    title: 'Climate Science Fundamentals',
    tagline: 'Core principles of Earth energy balance, atmospheric cycles, and climate indicators.',
    description: 'An authoritative foundational course covering planetary radiation budgets, greenhouse dynamics, oceanic circulation engines, and quantitative indicators of long-term climatic variations.',
    category: 'Earth & Climate',
    level: 'Foundational',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    trainerDesignation: 'Senior Faculty & Lead Evaluator',
    durationHours: 14,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 295,
    rating: 4.8,
    skillsCovered: ['Planetary Energy Budget', 'Carbon Cycles', 'Ocean Circulation', 'Climatic Indices'],
    thumbnailUrl: '/images/courses/earth-climate.jpg',
    objectives: [
      'Comprehend Earth radiation balance and greenhouse dynamics',
      'Examine oceanic and atmospheric circulation systems',
      'Analyze historical climate records and proxy indicators',
      'Interpret regional climate assessment reports',
    ],
    modules: [
      {
        id: 'mod_csf_01',
        courseId: 'crs_climate',
        title: 'Module 1 — Earth’s Climate System',
        description: 'Understand incoming solar radiation, albedo, and atmospheric energy balance.',
        order: 1,
        lessons: [
          {
            id: 'les_csf_01',
            moduleId: 'mod_csf_01',
            title: '1. Solar Radiation & Energy Balance',
            description: 'Stefan-Boltzmann law, solar irradiance constant (1361 W/m²), and planetary albedo.',
            durationMinutes: 20,
            type: 'video',
            order: 1,
            content: `### Earth Radiation Balance

The global climate system is driven by incoming solar radiation (shortwave) and outgoing terrestrial radiation (longwave infrared). The average planetary solar irradiance at the top of the atmosphere is approximately $S_0 = 1361\\text{ W/m}^2$.

Taking into account Earth's spherical geometry and planetary albedo (reflectivity $\\alpha \\approx 0.30$), the average absorbed solar energy is:
$$E_{\\text{in}} = \\frac{S_0(1 - \\alpha)}{4} \\approx 238\\text{ W/m}^2$$

To maintain thermodynamic equilibrium, Earth re-radiates an equal flux of longwave infrared radiation into space.`,
            keyTakeaways: [
              'Planetary albedo reflects approximately 30% of incoming solar shortwave radiation.',
              'Radiation equilibrium determines Earth’s effective baseline temperature.',
            ],
            resources: [{ title: 'Earth Energy Budget Diagram (NASA)', type: 'PDF', size: '1.8 MB' }],
          },
          {
            id: 'les_csf_02',
            moduleId: 'mod_csf_01',
            title: '2. The Greenhouse Effect & Gas Fluxes',
            description: 'Selective absorption of infrared radiation by CO2, H2O vapor, CH4, and N2O.',
            durationMinutes: 25,
            type: 'document',
            order: 2,
            content: `### Atmospheric Greenhouse Mechanics

The atmosphere is largely transparent to visible solar radiation but opaque to specific wavelength bands of outgoing infrared radiation (5–50 μm).

#### Major Radiative Forcing Agents:
- **Water Vapor ($H_2O$):** Largest contributor to the natural greenhouse effect (~60%); operates primarily as an amplifying feedback.
- **Carbon Dioxide ($CO_2$):** Primary long-lived driver with atmospheric residence times extending across centuries.
- **Methane ($CH_4$):** High global warming potential (GWP ~28× over 100 years).`,
            keyTakeaways: [
              'Water vapor acts as a thermodynamic feedback rather than an external driver.',
              'CO2 controls the fundamental baseline temperature of the troposphere.',
            ],
            resources: [{ title: 'Atmospheric Absorption Spectra Reference', type: 'PDF', size: '1.1 MB' }],
          },
        ],
      },
      {
        id: 'mod_csf_02',
        courseId: 'crs_climate',
        title: 'Module 2 — Atmospheric & Oceanic Circulation',
        description: 'Equatorial heat transport via Hadley cells, jet streams, and thermohaline belts.',
        order: 2,
        lessons: [
          {
            id: 'les_csf_03',
            moduleId: 'mod_csf_02',
            title: '1. Global Wind Belts & Hadley Cells',
            description: 'Meridional atmospheric circulation, Coriolis force, and trade wind genesis.',
            durationMinutes: 22,
            type: 'video',
            order: 1,
            content: `### Atmospheric Circulation Cells

Excess thermal energy at the equator is redistributed toward polar latitudes via three main meridional circulation cells:
1. **Hadley Cell:** Warm air rises at the Intertropical Convergence Zone (ITCZ) and subsides in the subtropics (30° N/S), creating major desert zones.
2. **Ferrel Cell:** Mid-latitude indirect circulation driven by synoptic weather systems and frontal depressions.
3. **Polar Cell:** Cold air sinking over polar caps and flowing equatorward.`,
            keyTakeaways: [
              'The Coriolis effect deflects moving air masses to the right in the Northern Hemisphere.',
              'Seasonal ITCZ migrations drive global monsoon rainfall rhythms.',
            ],
            resources: [{ title: 'Global Circulation Schematic', type: 'PDF', size: '920 KB' }],
          },
          {
            id: 'les_csf_04',
            moduleId: 'mod_csf_02',
            title: '2. Thermohaline Circulation & Heat Transport',
            description: 'Deep ocean currents driven by temperature and salinity density differentials.',
            durationMinutes: 24,
            type: 'document',
            order: 2,
            content: `### The Global Ocean Conveyor Belt

The ocean stores over 90% of excess thermal energy in the climate system. The **Thermohaline Circulation (THC)** is driven by density variations controlled by Temperature (thermo) and Salinity (haline).

Dense, cold, saline water sinks in the North Atlantic (Deep Water Formation), traveling across global ocean basins before upwelling in the Pacific and Indian Oceans thousands of years later.`,
            keyTakeaways: [
              'Ocean circulation modulates continental climates over multi-decadal timescales.',
              'Freshwater influx from melting ice sheets can slow down deep water formation.',
            ],
            resources: [{ title: 'Ocean Heat Uptake Report', type: 'PDF', size: '1.5 MB' }],
          },
        ],
      },
      {
        id: 'mod_csf_03',
        courseId: 'crs_climate',
        title: 'Module 3 — Climate Change Indicators',
        description: 'Quantitative tracking of temperature anomalies, sea level rise, and extremes.',
        order: 3,
        lessons: [
          {
            id: 'les_csf_05',
            moduleId: 'mod_csf_03',
            title: '1. Global Temperature Anomaly Tracking',
            description: 'Instrumental surface temperature datasets (GISTEMP, HadCRUT, Berkeley Earth).',
            durationMinutes: 25,
            type: 'document',
            order: 1,
            content: `### Surface Temperature Anomaly Metrics

Climatologists analyze temperature anomalies (deviations from 1850–1900 pre-industrial baselines) rather than absolute temperatures.

#### Key Observation Networks:
- NASA GISTEMP (Goddard Institute for Space Studies)
- UK Met Office HadCRUT5
- NOAA GlobalTemp

These independent analyses consistently confirm that global average surface temperatures have risen by ~1.2°C above pre-industrial levels, with accelerated warming over land masses.`,
            keyTakeaways: [
              'Land surfaces warm roughly 1.5× faster than global ocean sea-surface temperatures.',
              'Anomalies minimize localized altitude and microclimate biases.',
            ],
            resources: [{ title: 'Global Temperature Baseline Dataset', type: 'Dataset', size: '600 KB' }],
          },
          {
            id: 'les_csf_06',
            moduleId: 'mod_csf_03',
            title: '2. Precipitation Extremes & Cryosphere Trends',
            description: 'Analyzing glacial mass balance, sea ice extent, and intensity of hydrological cycles.',
            durationMinutes: 20,
            type: 'interactive',
            order: 2,
            content: `### Clausius-Clapeyron Relationship

A warmer atmosphere holds more water vapor: specifically, atmospheric water-holding capacity increases by approximately **7% per 1°C of warming** (Clausius-Clapeyron equation).

This fundamental thermodynamic physical law results in:
- Increased intensity of extreme short-duration rainfall events.
- Lengthening of dry spells between rain events due to increased surface evaporation rates.`,
            keyTakeaways: [
              'Warmer air intensifies both ends of the hydrological cycle: heavier downpours and deeper droughts.',
              'Cryosphere retreat serves as an unambiguous physical integrator of warming.',
            ],
            resources: [{ title: 'Hydrological Extremes Briefing', type: 'PDF', size: '850 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_python',
    code: 'PY-105',
    title: 'Python for Data Analysis',
    tagline: 'Hands-on tabular data manipulation, aggregation, and workflow automation using Python.',
    description: 'Learn to leverage Python and Pandas for administrative reporting, cleaning unstructured spreadsheets, aggregating departmental registries, and automating repetitive analytics workflows.',
    category: 'Technology',
    level: 'Foundational',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    trainerDesignation: 'Senior Faculty & Lead Evaluator',
    durationHours: 20,
    modulesCount: 3,
    lessonsCount: 7,
    status: 'published',
    enrolledCount: 512,
    rating: 4.9,
    skillsCovered: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Automated Reporting'],
    thumbnailUrl: '/images/courses/python-programming.jpg',
    objectives: [
      'Master essential Python data structures for analytical tasks',
      'Clean, transform, and merge tabular datasets using Pandas',
      'Perform numerical computations with NumPy arrays',
      'Automate routine administrative data reporting pipelines',
    ],
    modules: [
      {
        id: 'mod_py_01',
        courseId: 'crs_python',
        title: 'Module 1 — Python Fundamentals for Analysts',
        description: 'Setting up the analytics environment and core data structures.',
        order: 1,
        lessons: [
          {
            id: 'les_py_01',
            moduleId: 'mod_py_01',
            title: '1. Python Setup and Notebook Workflows',
            description: 'Virtual environments, package management with pip, and Jupyter notebook navigation.',
            durationMinutes: 20,
            type: 'video',
            order: 1,
            content: `### Interactive Computing with Python

Jupyter Notebooks provide a cell-based environment combining executable Python code, rich markdown text, and inline data visualizations.

\`\`\`python
# Importing standard analytical libraries
import numpy as np
import pandas as pd

print(f"Pandas version: {pd.__version__}")
\`\`\`

Key keyboard shortcuts in Jupyter:
- **Shift + Enter:** Execute current cell and move to next.
- **Esc + M:** Convert code cell to Markdown.
- **Esc + Y:** Convert cell to Code.`,
            keyTakeaways: [
              'Virtual environments isolate dependencies and prevent library version conflicts.',
              'Jupyter enables reproducible, self-documenting analytical pipelines.',
            ],
            resources: [{ title: 'Python Analytics Cheatsheet', type: 'PDF', size: '520 KB' }],
          },
          {
            id: 'les_py_02',
            moduleId: 'mod_py_01',
            title: '2. Core Data Types and Vectorized Lists',
            description: 'Lists, dictionaries, list comprehensions, and NumPy arrays for vector calculations.',
            durationMinutes: 25,
            type: 'document',
            order: 2,
            content: `### Essential Data Structures

Understanding list comprehensions and dictionaries is vital for structuring tabular data before ingestion into Pandas DataFrames.

\`\`\`python
# List comprehension for data transformation
raw_temperatures = [28.4, 29.1, 31.0, 33.2, 30.8]
temp_kelvin = [t + 273.15 for t in raw_temperatures]

# Dictionary mapping departments to budgets
department_budget = {
    'Public Works': 4500000,
    'Health Services': 6200000,
    'Education': 8100000
}
\`\`\``,
            keyTakeaways: [
              'List comprehensions execute significantly faster than manual for-loops.',
              'Dictionaries provide O(1) key lookups ideal for indexing administrative codes.',
            ],
            resources: [{ title: 'NumPy Vectorization Exercises', type: 'Notebook', size: '210 KB' }],
          },
        ],
      },
      {
        id: 'mod_py_02',
        courseId: 'crs_python',
        title: 'Module 2 — Tabular Processing with Pandas',
        description: 'Master DataFrames, boolean masking, missing values, and group aggregations.',
        order: 2,
        lessons: [
          {
            id: 'les_py_03',
            moduleId: 'mod_py_02',
            title: '1. DataFrames, Indexing, and Filtering',
            description: 'Loading CSVs, inspecting DataFrame metadata, and applying boolean filters.',
            durationMinutes: 30,
            type: 'video',
            order: 1,
            content: `### Exploring DataFrames

A DataFrame represents tabular data organized with named columns and an explicit index.

\`\`\`python
import pandas as pd

# Load dataset
df = pd.read_csv('district_training_records.csv')

# Inspection
print(df.info())
print(df.describe())

# Boolean filtering: High-enrollment courses
active_cohorts = df[(df['enrolled'] > 50) & (df['completion_rate'] >= 0.75)]
\`\`\``,
            keyTakeaways: [
              'Always use df.info() first to detect mismatched column types.',
              'Chain boolean conditions with & (and) and | (or) inside parentheses.',
            ],
            resources: [{ title: 'Pandas DataFrame Cheatsheet', type: 'PDF', size: '1.4 MB' }],
          },
          {
            id: 'les_py_04',
            moduleId: 'mod_py_02',
            title: '2. Handling Null Values and Type Conversions',
            description: 'Detecting missing data with isna(), filling values, and date parsing.',
            durationMinutes: 25,
            type: 'document',
            order: 2,
            content: `### Cleaning Incomplete Registries

Public datasets often contain blank entries, sentinel numbers (-999), or formatted string dates.

\`\`\`python
# Check missing count per column
print(df.isna().sum())

# Impute missing numeric values with median
median_score = df['score'].median()
df['score'] = df['score'].fillna(median_score)

# Convert string dates to datetime objects
df['submission_date'] = pd.to_datetime(df['submission_date'])
\`\`\``,
            keyTakeaways: [
              'Medians are more robust than means when imputing skewed distributions.',
              'Converting to pd.to_datetime unlocks powerful date-range aggregations.',
            ],
            resources: [{ title: 'Data Cleaning Exercise Script', type: 'Code', size: '150 KB' }],
          },
          {
            id: 'les_py_05',
            moduleId: 'mod_py_02',
            title: '3. Groupby Aggregations and Pivots',
            description: 'Split-apply-combine workflows, multi-column aggregates, and pivot tables.',
            durationMinutes: 28,
            type: 'interactive',
            order: 3,
            content: `### Departmental Groupby Operations

The \`groupby\` method allows summarizing metrics across categories such as departments, districts, or status flags.

\`\`\`python
# Grouping by department and aggregating multiple metrics
dept_summary = df.groupby('department').agg(
    total_trainees=('trainee_id', 'count'),
    avg_score=('score', 'mean'),
    max_progress=('progress', 'max')
).reset_index()

# Creating a pivot table
pivot_view = df.pivot_table(
    index='department',
    columns='role',
    values='score',
    aggfunc='mean'
)
\`\`\``,
            keyTakeaways: [
              'The .agg() syntax enables named column outputs in modern Pandas.',
              'Pivot tables rearrange dimensions for executive presentation.',
            ],
            resources: [{ title: 'Pivot Table Quick Reference', type: 'PDF', size: '420 KB' }],
          },
        ],
      },
      {
        id: 'mod_py_03',
        courseId: 'crs_python',
        title: 'Module 3 — Applied Data Workflows',
        description: 'Read/write multiple file formats and build automated reporting routines.',
        order: 3,
        lessons: [
          {
            id: 'les_py_06',
            moduleId: 'mod_py_03',
            title: '1. File I/O: Reading CSV, Excel, and JSON',
            description: 'Efficient file readers, sheet selection, chunking large datasets, and database connections.',
            durationMinutes: 22,
            type: 'document',
            order: 1,
            content: `### Efficient Input / Output Operations

Handling multi-sheet Excel workbooks and exporting clean outputs:

\`\`\`python
# Reading specific sheet from Excel workbook
excel_df = pd.read_excel('annual_report.xlsx', sheet_name='Q4_Metrics')

# Exporting clean results without index column
excel_df.to_csv('cleaned_output.csv', index=False)
\`\`\``,
            keyTakeaways: [
              'Specify index=False when exporting CSVs unless the row index is meaningful.',
              'For large datasets > 500MB, use chunksize parameter in read_csv.',
            ],
            resources: [{ title: 'File I/O Performance Guide', type: 'PDF', size: '380 KB' }],
          },
          {
            id: 'les_py_07',
            moduleId: 'mod_py_03',
            title: '2. Building Reproducible Report Scripts',
            description: 'Packaging transformation steps into reusable Python functions and scheduled batch scripts.',
            durationMinutes: 26,
            type: 'interactive',
            order: 2,
            content: `### Creating Production Scripts

Transforming exploratory Jupyter code into clean, callable Python functions:

\`\`\`python
def generate_weekly_report(input_filepath, output_filepath):
    """Ingests raw cohort logs, computes KPI metrics, and outputs clean summary."""
    df = pd.read_csv(input_filepath)
    df['date'] = pd.to_datetime(df['date'])
    summary = df.groupby('department')['progress'].mean().reset_index()
    summary.to_csv(output_filepath, index=False)
    print(f"Report compiled successfully to {output_filepath}")
\`\`\``,
            keyTakeaways: [
              'Wrap repetitive tasks in documented functions with clear input/output contracts.',
              'Use try-except blocks to catch missing files in automated jobs.',
            ],
            resources: [{ title: 'Automated Batch Script Template', type: 'Script', size: '85 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_satellite',
    code: 'GEO-301',
    title: 'Satellite Data Processing',
    tagline: 'Multispectral imagery ingestion, raster preprocessing, and vegetation index mapping.',
    description: 'Learn satellite earth observation basics, multispectral reflectance bands, cloud masking, normalized difference vegetation index (NDVI) calculations, and land-use mapping for geospatial planning.',
    category: 'Geospatial Technology',
    level: 'Advanced',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    trainerDesignation: 'Senior Faculty & Lead Evaluator',
    durationHours: 24,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 220,
    rating: 4.9,
    skillsCovered: ['Remote Sensing', 'Multispectral Imagery', 'NDVI', 'Raster GIS', 'Land Cover'],
    thumbnailUrl: '/images/courses/geospatial-satellite.jpg',
    objectives: [
      'Understand optical satellite sensors (Sentinel-2, Landsat) and bands',
      'Perform raster band math and radiometric calibration',
      'Compute vegetation and water indices (NDVI, NDWI)',
      'Export spatial classification layers for municipal planning',
    ],
    modules: [
      {
        id: 'mod_geo_01',
        courseId: 'crs_satellite',
        title: 'Module 1 — Remote Sensing Principles',
        description: 'Sensor physics, orbit tracks, and spectral resolution.',
        order: 1,
        lessons: [
          {
            id: 'les_geo_01',
            moduleId: 'mod_geo_01',
            title: '1. Electromagnetic Spectrum & Satellite Orbits',
            description: 'Visible, near-infrared, and shortwave infrared bands; Sun-synchronous orbits.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### The Physical Basis of Remote Sensing

Earth observation satellites capture reflected solar radiance across discrete intervals of the electromagnetic spectrum.

#### Key Spectral Windows:
- **Visible (0.4 – 0.7 μm):** Blue, Green, Red bands.
- **Near Infrared (NIR, 0.7 – 1.0 μm):** Strongly reflected by healthy plant cellular leaf structures.
- **Shortwave Infrared (SWIR, 1.4 – 2.5 μm):** Sensitive to soil moisture and vegetation canopy water content.`,
            keyTakeaways: [
              'Chlorophyll absorbs red and blue light while reflecting near-infrared radiation.',
              'Sun-synchronous orbits ensure consistent solar illumination angles.',
            ],
            resources: [{ title: 'Satellite Band Reference Guide', type: 'PDF', size: '1.9 MB' }],
          },
          {
            id: 'les_geo_02',
            moduleId: 'mod_geo_01',
            title: '2. Spatial, Spectral, and Radiometric Resolution',
            description: 'Comparing Sentinel-2 (10m) vs Landsat (30m) vs MODIS (250m) specifications.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### The Four Dimensions of Resolution

1. **Spatial Resolution:** Pixel size representing distance on the ground (Sentinel-2: 10m visible).
2. **Spectral Resolution:** Number and bandwidth of recorded spectral channels.
3. **Temporal Resolution:** Revisit time over the same geographic target (Sentinel-2 constellation: ~5 days).
4. **Radiometric Resolution:** Bit depth of sensor sensitivity (12-bit = 4096 grey levels).`,
            keyTakeaways: [
              'Trade-offs always exist between spatial coverage and temporal revisit frequency.',
            ],
            resources: [{ title: 'Resolution Comparison Matrix', type: 'PDF', size: '780 KB' }],
          },
        ],
      },
      {
        id: 'mod_geo_02',
        courseId: 'crs_satellite',
        title: 'Module 2 — Raster Processing Workflows',
        description: 'Coordinate reference systems and spectral index calculation.',
        order: 2,
        lessons: [
          {
            id: 'les_geo_03',
            moduleId: 'mod_geo_02',
            title: '1. Image Ingestion & Coordinate Systems (CRS)',
            description: 'GeoTIFF headers, UTM projection zones, and spatial reprojection.',
            durationMinutes: 22,
            type: 'document',
            order: 1,
            content: `### Coordinate Systems in Raster GIS

Rasters are georeferenced matrices where each pixel corresponds to a spatial coordinate.
- **Geographic (EPSG:4326):** Unprojected latitude/longitude in decimal degrees.
- **Projected (UTM Zones, e.g. EPSG:32643):** Metric Cartesian grid preserving localized distances and surface areas.`,
            keyTakeaways: [
              'Always reproject rasters into metric coordinate reference systems before calculating surface areas.',
            ],
            resources: [{ title: 'GIS Coordinate Reference Systems Cheatsheet', type: 'PDF', size: '610 KB' }],
          },
          {
            id: 'les_geo_04',
            moduleId: 'mod_geo_02',
            title: '2. Band Math & Vegetation Index (NDVI)',
            description: 'Formula, normalization mechanics, and interpreting greenness values.',
            durationMinutes: 28,
            type: 'interactive',
            order: 2,
            content: `### Normalized Difference Vegetation Index (NDVI)

$$\\text{NDVI} = \\frac{\\text{NIR} - \\text{Red}}{\\text{NIR} + \\text{Red}}$$

#### Typical Value Ranges:
- **-1.0 to 0.0:** Water bodies and cloud shadows (negative index).
- **0.0 to 0.2:** Bare soil, rock, sand, urban infrastructure.
- **0.2 to 0.5:** Sparse vegetation, grasslands, senescent crops.
- **0.6 to 0.9:** Dense, healthy, active forest canopy or irrigated agriculture.`,
            keyTakeaways: [
              'Normalizing the difference eliminates variations caused by overall illumination differences.',
              'NDVI is a standard metric for drought monitoring and agricultural yield estimation.',
            ],
            resources: [{ title: 'NDVI Calculation Python Snippet', type: 'Code', size: '90 KB' }],
          },
        ],
      },
      {
        id: 'mod_geo_03',
        courseId: 'crs_satellite',
        title: 'Module 3 — Geospatial Analysis & Classification',
        description: 'Land cover categorization and administrative map production.',
        order: 3,
        lessons: [
          {
            id: 'les_geo_05',
            moduleId: 'mod_geo_03',
            title: '1. Supervised Land Cover Classification',
            description: 'Training sample collection, Random Forest classifiers, and confusion matrices.',
            durationMinutes: 26,
            type: 'video',
            order: 1,
            content: `### Classification Algorithms in Remote Sensing

Supervised classification uses analyst-labeled training polygons to classify every image pixel into classes: Urban, Water, Forest, Agriculture, and Barren Land. Modern classification pipelines commonly apply Random Forest or Support Vector Machine (SVM) models.`,
            keyTakeaways: [
              'Ensure balanced training sample sizes across all classes to prevent algorithmic bias.',
            ],
            resources: [{ title: 'Classification Accuracy Checklist', type: 'Document', size: '420 KB' }],
          },
          {
            id: 'les_geo_06',
            moduleId: 'mod_geo_03',
            title: '2. Exporting Map Outputs & Area Statistics',
            description: 'Calculating hectare coverage per class and generating vector boundary summaries.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Deriving Municipal Area Statistics

By multiplying pixel count per class by pixel surface area ($10\\text{m} \\times 10\\text{m} = 100\\text{ m}^2 = 0.01\\text{ hectares}$), analysts generate precise administrative land cover statistics for district planning reports.`,
            keyTakeaways: [
              'Pixel counting must account for partial pixel edge effects in fragmented terrains.',
            ],
            resources: [{ title: 'Sample District Land Cover Report', type: 'PDF', size: '1.6 MB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_comms',
    code: 'COM-101',
    title: 'Professional Communication',
    tagline: 'Executive briefing, structured memo drafting, and stakeholder presentation mastery.',
    description: 'Master administrative writing, structured briefings using the Pyramid Principle, non-defensive stakeholder management, and delivering high-stakes institutional presentations.',
    category: 'Professional Development',
    level: 'Foundational',
    trainerId: 'usr_trainer_004',
    trainerName: 'Dr. Sunita Sen',
    trainerDesignation: 'Executive Faculty Lead',
    durationHours: 12,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 640,
    rating: 4.8,
    skillsCovered: ['Executive Writing', 'The Pyramid Principle', 'Stakeholder Briefings', 'Presentation Design'],
    thumbnailUrl: '/images/courses/leadership.jpg',
    objectives: [
      'Structure clear, concise administrative briefs and memoranda',
      'Deliver impactful visual presentations to senior decision-makers',
      'Foster collaborative cross-departmental dialogue',
      'Manage stakeholder expectations during program rollouts',
    ],
    modules: [
      {
        id: 'mod_com_01',
        courseId: 'crs_comms',
        title: 'Module 1 — Executive Writing Principles',
        description: 'Deductive memo structure and clarity in institutional correspondence.',
        order: 1,
        lessons: [
          {
            id: 'les_com_01',
            moduleId: 'mod_com_01',
            title: '1. The Pyramid Principle for Clear Memos',
            description: 'Starting with the conclusion (BLUF), top-down logical grouping, and mutually exclusive arguments.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Bottom Line Up Front (BLUF)

Executive decision-makers lack the time to read through lengthy historical context before discovering your core recommendation.

#### The Pyramid Hierarchy:
1. **Governing Thought (Conclusion):** State the recommendation or key finding in the first paragraph.
2. **Key Line Arguments:** Support the conclusion with 3–4 mutually exclusive, collectively exhaustive (MECE) reasons.
3. **Underlying Data & Evidence:** Provide granular facts and metrics underneath each argument.`,
            keyTakeaways: [
              'Never bury recommendations at the conclusion of an administrative note.',
              'Group arguments using the MECE principle (Mutually Exclusive, Collectively Exhaustive).',
            ],
            resources: [{ title: 'Pyramid Principle Template', type: 'Document', size: '310 KB' }],
          },
          {
            id: 'les_com_02',
            moduleId: 'mod_com_01',
            title: '2. Writing Actionable Policy Briefs',
            description: 'Tone, active voice, elimination of bureaucratic jargon, and executive summaries.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Eliminating Bureaucratic Friction

Clear policy writing favors strong active verbs over passive voice. Compare:
- *Passive:* "A review was conducted by the evaluation committee and decisions were arrived at."
- *Active:* "The evaluation committee reviewed all 14 proposals and approved the Phase 2 expansion."

#### Standard 2-Page Briefing Layout:
- Context & Urgency (1 Paragraph)
- Primary Options Evaluated (Matrix)
- Recommended Direction & Resource Implications
- Immediate Next Approvals Required`,
            keyTakeaways: [
              'Active voice reduces ambiguity regarding administrative accountability.',
            ],
            resources: [{ title: 'Policy Brief Checklist', type: 'PDF', size: '280 KB' }],
          },
        ],
      },
      {
        id: 'mod_com_02',
        courseId: 'crs_comms',
        title: 'Module 2 — Presentations & Stakeholder Engagement',
        description: 'Visual slide storytelling and steering productive multi-agency meetings.',
        order: 2,
        lessons: [
          {
            id: 'les_com_03',
            moduleId: 'mod_com_02',
            title: '1. Designing High-Impact Slide Narratives',
            description: 'Headline-lead slide design, one idea per slide, and eliminating text-heavy bullets.',
            durationMinutes: 22,
            type: 'video',
            order: 1,
            content: `### Action Titles vs Topic Titles

Avoid generic titles like *"Project Status"*. Instead write actionable assertion titles:
- *"Phase 1 Milestone Complete: 92% of Trainees Certified Ahead of Schedule."*

The slide visual or table should directly substantiate the claim made in the title.`,
            keyTakeaways: [
              'Action titles enable senior leaders to grasp the deck narrative in under 60 seconds.',
            ],
            resources: [{ title: 'Executive Presentation Slide Deck (PPTX)', type: 'Template', size: '2.1 MB' }],
          },
          {
            id: 'les_com_04',
            moduleId: 'mod_com_02',
            title: '2. Facilitating Productive Inter-Agency Meetings',
            description: 'Agenda control, consensus building, handling conflicting priorities, and action-item tracking.',
            durationMinutes: 24,
            type: 'document',
            order: 2,
            content: `### Running High-Stakes Inter-Agency Meetings

Effective meetings require:
1. **Pre-circulated Decision Items:** Send briefs at least 24 hours prior.
2. **Clear Meeting Roles:** Designate a Chair, Timekeeper, and Action Item Scribe.
3. **The 5-Minute Close:** Dedicate the final 5 minutes exclusively to verifying who owns each action item and deadline.`,
            keyTakeaways: [
              'Meetings should focus on debate and decisions, not one-way reading of slides.',
            ],
            resources: [{ title: 'Meeting Protocol & Minutes Template', type: 'Document', size: '190 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_dataviz',
    code: 'VIZ-202',
    title: 'Data Visualization Essentials',
    tagline: 'Design clear, ethical, and communicative charts, graphs, and metric dashboards.',
    description: 'Explore visual perception theory, chart selection frameworks, data-to-ink ratio optimization, accessible color palettes, and crafting clean single-screen executive dashboards.',
    category: 'Data & Analytics',
    level: 'Intermediate',
    trainerId: 'usr_trainer_005',
    trainerName: 'Adv. Meenakshi Sundaram',
    trainerDesignation: 'Analytics & Governance Faculty',
    durationHours: 16,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 375,
    rating: 4.8,
    skillsCovered: ['Data Visualization', 'Dashboard Design', 'Color Theory', 'Information Architecture'],
    thumbnailUrl: '/images/courses/data-analytics.jpg',
    objectives: [
      'Select appropriate chart types for varying data relationships',
      'Apply visual hierarchy, typography, and accessible color scales',
      'Avoid misleading axes and graphical distortions',
      'Build dashboard layouts tailored to executive audiences',
    ],
    modules: [
      {
        id: 'mod_viz_01',
        courseId: 'crs_dataviz',
        title: 'Module 1 — Foundations of Visual Perception',
        description: 'How the human visual cortex processes visual information.',
        order: 1,
        lessons: [
          {
            id: 'les_viz_01',
            moduleId: 'mod_viz_01',
            title: '1. Preattentive Attributes & Color Theory',
            description: 'Leveraging length, position, shape, and hue to direct user attention instantly.',
            durationMinutes: 20,
            type: 'video',
            order: 1,
            content: `### Preattentive Visual Processing

Preattentive attributes are visual cues processed by the human eye in less than 250 milliseconds without conscious cognitive effort:
- **Spatial Position:** Most accurate attribute for quantitative comparison (scatter plots, bar positions).
- **Length / Bar Height:** Highly accurate for discrete comparative amounts.
- **Color Hue:** Outstanding for categorical grouping (keep categories under 6 colors).
- **Color Intensity / Luminance:** Ideal for ordered quantitative steps (choropleth maps).`,
            keyTakeaways: [
              'Position and length are perceived with greater precision than area or volume.',
              'Use color intentionally to highlight anomalies, not for decorative aesthetics.',
            ],
            resources: [{ title: 'Preattentive Processing Reference', type: 'PDF', size: '1.2 MB' }],
          },
          {
            id: 'les_viz_02',
            moduleId: 'mod_viz_01',
            title: '2. Choosing the Right Chart for Your Data',
            description: 'Comparison, distribution, composition, and correlation selection trees.',
            durationMinutes: 25,
            type: 'document',
            order: 2,
            content: `### Chart Selection Framework

| Relationship | Recommended Chart | Avoid |
| :--- | :--- | :--- |
| **Time Series Trend** | Line Chart, Area Chart | Pie Chart, Bar Chart (>30 bars) |
| **Item Comparison** | Horizontal Bar Chart | Radar Chart, 3D Columns |
| **Distribution** | Histogram, Box Plot | Gauge, Pie Chart |
| **Correlation** | Scatter Plot with Trendline | Dual-scale Line Chart |`,
            keyTakeaways: [
              'Pie charts fail when comparing more than 3 slices or similar percentages.',
              'Horizontal bar charts allow long, readable categorical labels without diagonal tilting.',
            ],
            resources: [{ title: 'Chart Selection Decision Tree', type: 'PDF', size: '890 KB' }],
          },
        ],
      },
      {
        id: 'mod_viz_02',
        courseId: 'crs_dataviz',
        title: 'Module 2 — Designing Informative Graphics',
        description: 'De-cluttering graphics and maximizing data-to-ink ratio.',
        order: 2,
        lessons: [
          {
            id: 'les_viz_03',
            moduleId: 'mod_viz_02',
            title: '1. De-cluttering & Data-to-Ink Ratio',
            description: 'Edward Tufte principles: removing heavy gridlines, dark borders, and redundant legends.',
            durationMinutes: 22,
            type: 'document',
            order: 1,
            content: `### The Data-to-Ink Ratio

$$\\text{Data-to-Ink Ratio} = \\frac{\\text{Ink used to display actual data}}{\\text{Total ink used in graphic}}$$

#### De-cluttering Checklist:
1. Mute or remove background gridlines (use light grey \`#E2E8F0\` or eliminate entirely).
2. Remove redundant axis tick marks.
3. Label lines directly at the final point instead of forcing readers to cross-check separate legend boxes.
4. Always start quantitative bar charts at **zero** to avoid visual distortion.`,
            keyTakeaways: [
              'Non-zero bar chart baseline axes distort perceptual proportions and mislead viewers.',
              'Direct labeling reduces cognitive burden on readers.',
            ],
            resources: [{ title: 'Before & After De-cluttering Guide', type: 'PDF', size: '1.5 MB' }],
          },
          {
            id: 'les_viz_04',
            moduleId: 'mod_viz_02',
            title: '2. Accessible Color Scales & Typography',
            description: 'Designing for deuteranopia and protanopia; using ColorBrewer palettes.',
            durationMinutes: 24,
            type: 'video',
            order: 2,
            content: `### Color Accessibility in Public Portals

Approximately 8% of men and 0.5% of women experience color vision deficiency (CVD).
- **Never rely solely on Red/Green coding** to denote success and failure. Pair color with distinct shapes (checkmarks vs warning triangles) or textual tags.
- Use perceptually uniform palettes (Viridis, ColorBrewer Blues/Oranges) for heatmap scales.`,
            keyTakeaways: [
              'Test visualizations with grayscale and CVD simulation filters.',
            ],
            resources: [{ title: 'ColorBrewer Accessible Palette Swatches', type: 'PDF', size: '640 KB' }],
          },
        ],
      },
      {
        id: 'mod_viz_03',
        courseId: 'crs_dataviz',
        title: 'Module 3 — Executive Dashboard Architecture',
        description: 'Single-screen information hierarchy and mobile responsiveness.',
        order: 3,
        lessons: [
          {
            id: 'les_viz_05',
            moduleId: 'mod_viz_03',
            title: '1. Single-Screen Executive Layouts',
            description: 'The F-pattern eye scanning path, primary KPI cards, and secondary drilldown views.',
            durationMinutes: 25,
            type: 'interactive',
            order: 1,
            content: `### Executive Dashboard Layout Structure

- **Top Row (Primary Horizon):** 3 to 5 core metric cards with big numbers, trend indicators, and comparison to previous periods.
- **Middle Section (Primary Charts):** High-priority time series or geographic breakdown answering *"Where are we headed?"*
- **Lower Section (Drilldown / Action Items):** Filterable table or categorical list highlighting exceptions requiring administrative intervention.`,
            keyTakeaways: [
              'An executive dashboard should communicate health status within 5 seconds without scrolling.',
            ],
            resources: [{ title: 'Dashboard Wireframe Blueprint', type: 'PDF', size: '920 KB' }],
          },
          {
            id: 'les_viz_06',
            moduleId: 'mod_viz_03',
            title: '2. Usability Testing & Accessibility Guidelines',
            description: 'Evaluating cognitive load, interactive tooltips, and responsive breakpoint stacking.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Usability Auditing for Administrative Dashboards

Conducting 5-second usability tests with departmental colleagues:
1. What is the most critical takeaway on this page?
2. Which department requires immediate corrective attention?
3. What is the trend over the past 30 days?

If the user cannot answer within 15 seconds, redesign the visual hierarchy.`,
            keyTakeaways: [
              'Simplicity always outperforms dense visual novelty in high-stakes operational environments.',
            ],
            resources: [{ title: 'Dashboard Heuristic Audit Sheet', type: 'Document', size: '310 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_ai_gov',
    code: 'AI-501',
    title: 'Artificial Intelligence in Public Administration & Service Delivery',
    tagline: 'Ethical automated workflows, natural language processing, and citizen query intelligence.',
    description: 'A cutting-edge curriculum on applying responsible artificial intelligence across municipal and central government services. Covers automated document verification, predictive citizen service workflows, model safety guardrails, and privacy protection.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    trainerId: 'usr_trainer_001',
    trainerName: 'Dr. Kavya Menon',
    trainerDesignation: 'Head of AI & Administrative Analytics',
    durationHours: 24,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 460,
    rating: 4.9,
    skillsCovered: ['Responsible AI', 'Large Language Models', 'Automated Triage', 'Data Privacy', 'AI Governance'],
    thumbnailUrl: '/images/courses/ai-neural-network.jpg',
    objectives: [
      'Understand foundational architectures of modern Machine Learning and LLMs',
      'Deploy automated conversational triage for citizen grievance ticketing',
      'Implement data privacy boundaries and statutory model safety checks',
      'Audit algorithmic fairness across diverse demographic cohorts',
    ],
    modules: [
      {
        id: 'mod_ai_01',
        courseId: 'crs_ai_gov',
        title: 'Module 1 — Responsible AI in Government',
        description: 'Foundations of ethical machine learning and transparency mandates.',
        order: 1,
        lessons: [
          {
            id: 'les_ai_01',
            moduleId: 'mod_ai_01',
            title: '1. Ethical AI Principles & Fairness Metrics',
            description: 'Disparate impact analysis, demographic parity, and explaining model predictions to citizens.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Algorithmic Fairness in Public Sector AI
Public service AI implementations cannot treat human outcomes as simple optimization problems. Government models must satisfy strict constitutional equity standards.

#### Key Equity Metrics:
1. **Demographic Parity:** Ensures acceptance rates are statistically consistent across protected demographic classifications.
2. **Equalized Odds:** Requires false positive and false negative error rates to be balanced across regional groups.
3. **Explainability Mandate:** Citizens have a right to understand the specific administrative rationale when an automated decision affects benefits or licensing.`,
            keyTakeaways: [
              'Demographic parity protects against inadvertent systemic discrimination.',
              'Explainable AI (XAI) models like SHAP and LIME provide human-auditable decision rationales.',
            ],
            resources: [{ title: 'National Strategy for Artificial Intelligence Guidelines', type: 'PDF', size: '2.1 MB' }],
          },
          {
            id: 'les_ai_02',
            moduleId: 'mod_ai_01',
            title: '2. Data Governance & Sanitization Pipelines',
            description: 'Redacting Personally Identifiable Information (PII) before model training and inference.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Protecting Citizen PII in Generative Workflows
Prior to passing citizen correspondence into semantic search or summarization pipelines, automated named entity recognition (NER) must redact Aadhaar numbers, PAN cards, phone numbers, and addresses.`,
            keyTakeaways: [
              'PII tokenization and redaction must happen at the edge before sending payloads to LLM APIs.',
            ],
            resources: [{ title: 'PII Sanitization Code Template', type: 'Code', size: '140 KB' }],
          },
        ],
      },
      {
        id: 'mod_ai_02',
        courseId: 'crs_ai_gov',
        title: 'Module 2 — Citizen Service Automation',
        description: 'Building intelligent query resolution and document processing pipelines.',
        order: 2,
        lessons: [
          {
            id: 'les_ai_03',
            moduleId: 'mod_ai_02',
            title: '1. Retrieval-Augmented Generation (RAG) for Policy Documents',
            description: 'Vector embeddings, chunking administrative manuals, and grounding responses strictly in official gazettes.',
            durationMinutes: 28,
            type: 'interactive',
            order: 1,
            content: `### Grounded Policy RAG Architecture
To prevent hallucinations in public administration queries, LLMs must only generate answers derived from validated government circulars.

#### Step-by-Step Architecture:
1. Parse official government notifications into semantically coherent 500-token chunks.
2. Compute high-dimensional dense vector embeddings.
3. On citizen query, perform cosine similarity retrieval against the index.
4. Inject top retrieved citations into the prompt context with strict citation requirements.`,
            keyTakeaways: [
              'RAG eliminates model hallucination by forcing answers to cite official gazettes.',
            ],
            resources: [{ title: 'Policy RAG Architecture Blueprint', type: 'PDF', size: '1.4 MB' }],
          },
          {
            id: 'les_ai_04',
            moduleId: 'mod_ai_02',
            title: '2. Automated Document Verification & OCR',
            description: 'Computer vision and optical character recognition for fast document triage.',
            durationMinutes: 22,
            type: 'video',
            order: 2,
            content: `### High-Throughput Document Processing
Applying multi-lingual OCR pipelines to verify applicant utility bills, certificates, and land ownership deed forms at scale.`,
            keyTakeaways: [
              'Pre-processing contrast and binarization significantly boosts Indian vernacular OCR accuracy.',
            ],
            resources: [{ title: 'OCR Verification Benchmark Sheet', type: 'Document', size: '480 KB' }],
          },
        ],
      },
      {
        id: 'mod_ai_03',
        courseId: 'crs_ai_gov',
        title: 'Module 3 — Model Auditing & Safety',
        description: 'Red-teaming public models and continuous monitoring.',
        order: 3,
        lessons: [
          {
            id: 'les_ai_05',
            moduleId: 'mod_ai_03',
            title: '1. Adversarial Red-Teaming & Prompt Injection Defense',
            description: 'Securing administrative endpoints against jailbreaks and prompt extraction.',
            durationMinutes: 24,
            type: 'document',
            order: 1,
            content: `### Mitigating Prompt Injection in Public Endpoints
Public web forms accepting free-form citizen text must employ input classification filters to detect adversarial attempts to override system prompts.`,
            keyTakeaways: [
              'Layered guardrail classifiers prevent prompt hijacking and unauthorized data exfiltration.',
            ],
            resources: [{ title: 'AI Red Teaming Standard Operating Procedure', type: 'PDF', size: '820 KB' }],
          },
          {
            id: 'les_ai_06',
            moduleId: 'mod_ai_03',
            title: '2. Continuous Model Monitoring & Drift Detection',
            description: 'Tracking concept drift, latency, and operational model degradation.',
            durationMinutes: 20,
            type: 'interactive',
            order: 2,
            content: `### Monitoring Real-Time Production AI
Evaluating model drift as citizen query vocabularies shift seasonally and tracking precision over time.`,
            keyTakeaways: [
              'Regular human-in-the-loop audit samples maintain high service fidelity.',
            ],
            resources: [{ title: 'Model Monitoring KPI Template', type: 'Cheatsheet', size: '210 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_zero_trust',
    code: 'SEC-402',
    title: 'Zero Trust Architecture & Cryptographic Key Management',
    tagline: 'Perimeter-less identity verification, micro-segmentation, and hardware security modules.',
    description: 'An advanced operational course on implementing NIST SP 800-207 Zero Trust Architecture across governmental datacenters and citizen databases. Covers continuous authentication, software-defined perimeters, and HSM key ceremonies.',
    category: 'Cybersecurity',
    level: 'Advanced',
    trainerId: 'usr_trainer_003',
    trainerName: 'Prof. Rahul Iyer',
    trainerDesignation: 'Distinguished Professor of Cyber Defense',
    durationHours: 28,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 310,
    rating: 4.9,
    skillsCovered: ['Zero Trust', 'Micro-segmentation', 'PKI & HSM', 'Continuous Auth', 'Threat Triage'],
    thumbnailUrl: '/images/courses/cybersecurity.jpg',
    objectives: [
      'Transition legacy castle-and-moat network architectures to Zero Trust',
      'Implement granular software-defined micro-segmentation policies',
      'Manage cryptographic lifecycle using Hardware Security Modules (HSMs)',
      'Enforce phishing-resistant FIDO2 authentication across civil service logins',
    ],
    modules: [
      {
        id: 'mod_zt_01',
        courseId: 'crs_zero_trust',
        title: 'Module 1 — Zero Trust Core Tenets',
        description: 'Deconstructing the NIST 800-207 framework.',
        order: 1,
        lessons: [
          {
            id: 'les_zt_01',
            moduleId: 'mod_zt_01',
            title: '1. Never Trust, Always Verify',
            description: 'Eliminating implicit trust zones and authenticating every communication session.',
            durationMinutes: 26,
            type: 'video',
            order: 1,
            content: `### Core Philosophies of Zero Trust
Zero Trust assumes breach. Every access request is dynamically authenticated and authorized based on user context, device posture, and data sensitivity.`,
            keyTakeaways: [
              'Network location inside a LAN provides zero authorization privileges in Zero Trust.',
            ],
            resources: [{ title: 'NIST SP 800-207 Architecture Summary', type: 'PDF', size: '1.2 MB' }],
          },
          {
            id: 'les_zt_02',
            moduleId: 'mod_zt_01',
            title: '2. Software-Defined Perimeters & Micro-segmentation',
            description: 'Isolating database clusters and administrative workloads with ephemeral mTLS connections.',
            durationMinutes: 24,
            type: 'document',
            order: 2,
            content: `### Micro-segmenting Sensitive Registries
Preventing lateral attacker movement by isolating citizen databases behind cryptographic gateway proxies.`,
            keyTakeaways: [
              'Lateral movement is curtailed when workloads cannot communicate without mutual TLS certs.',
            ],
            resources: [{ title: 'Micro-segmentation Policy Blueprint', type: 'Document', size: '540 KB' }],
          },
        ],
      },
      {
        id: 'mod_zt_02',
        courseId: 'crs_zero_trust',
        title: 'Module 2 — Cryptographic Infrastructure',
        description: 'Public Key Infrastructure (PKI), HSMs, and key rotation ceremonies.',
        order: 2,
        lessons: [
          {
            id: 'les_zt_03',
            moduleId: 'mod_zt_02',
            title: '1. Hardware Security Modules (HSM) Operations',
            description: 'FIPS 140-2 Level 3 cryptographic appliances and envelope encryption.',
            durationMinutes: 30,
            type: 'video',
            order: 1,
            content: `### Hardware Security Modules in Government Cloud
HSMs generate, store, and manage master keys inside tamper-resistant hardware boundaries.`,
            keyTakeaways: [
              'Keys never exit the HSM unencrypted; encryption operations occur on-chip.',
            ],
            resources: [{ title: 'HSM Key Ceremony Protocol Sheet', type: 'PDF', size: '780 KB' }],
          },
          {
            id: 'les_zt_04',
            moduleId: 'mod_zt_02',
            title: '2. FIDO2 / WebAuthn Implementation',
            description: 'Phishing-resistant passkeys and hardware token enrollment for public officers.',
            durationMinutes: 22,
            type: 'interactive',
            order: 2,
            content: `### Neutralizing AiTM Phishing with WebAuthn
Hardware tokens bind cryptographic signatures directly to the browser origin URL, neutralizing proxy phishing.`,
            keyTakeaways: [
              'FIDO2 is mathematically immune to credential proxy relay attacks.',
            ],
            resources: [{ title: 'WebAuthn Integration Guide', type: 'Code', size: '190 KB' }],
          },
        ],
      },
      {
        id: 'mod_zt_03',
        courseId: 'crs_zero_trust',
        title: 'Module 3 — Continuous Adaptive Assessment',
        description: 'Behavioral analytics and dynamic session termination.',
        order: 3,
        lessons: [
          {
            id: 'les_zt_05',
            moduleId: 'mod_zt_03',
            title: '1. User and Entity Behavior Analytics (UEBA)',
            description: 'Detecting anomalous midnight data exfiltration and credential misuse.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Behavioral Anomaly Triggers
Flagging deviations from baseline working hours, IP geolocations, and bulk download rates.`,
            keyTakeaways: [
              'Continuous telemetry re-evaluates trust scores throughout an active session.',
            ],
            resources: [{ title: 'UEBA Alert Triage Guide', type: 'Document', size: '360 KB' }],
          },
          {
            id: 'les_zt_06',
            moduleId: 'mod_zt_03',
            title: '2. Automated Incident Quarantine Playbooks',
            description: 'Executing programmatic quarantine scripts upon high-confidence intrusion detection.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Rapid Security Automation & Orchestration (SOAR)
Automating API credential revocation and endpoint isolation in seconds rather than hours.`,
            keyTakeaways: [
              'Automated playbooks reduce breach blast radius dramatically.',
            ],
            resources: [{ title: 'Quarantine Playbook Script', type: 'Script', size: '95 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_devops_sre',
    code: 'OPS-401',
    title: 'DevOps, CI/CD & Site Reliability Engineering for Digital Portals',
    tagline: 'Automated container pipelines, infrastructure as code, and 99.99% service uptime.',
    description: 'Learn modern DevOps practices for mission-critical e-governance systems. Implement declarative Infrastructure as Code using Terraform, build automated CI/CD deployment pipelines, configure Prometheus and Grafana telemetry, and manage error budgets.',
    category: 'DevOps / SRE',
    level: 'Intermediate',
    trainerId: 'usr_trainer_003',
    trainerName: 'Prof. Rahul Iyer',
    trainerDesignation: 'Distinguished Professor & Infrastructure Architect',
    durationHours: 22,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 380,
    rating: 4.8,
    skillsCovered: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Terraform', 'Prometheus', 'SLO / SLA Management'],
    thumbnailUrl: '/images/courses/devops-sre.jpg',
    objectives: [
      'Construct automated build, test, and container packaging pipelines',
      'Manage multi-environment cloud resources deterministically with Terraform',
      'Formulate Service Level Objectives (SLOs) and manage error budgets',
      'Execute zero-downtime rolling and canary deployments',
    ],
    modules: [
      {
        id: 'mod_ops_01',
        courseId: 'crs_devops_sre',
        title: 'Module 1 — CI/CD Pipelines & Containerization',
        description: 'Building secure, reproducible artifact deployment chains.',
        order: 1,
        lessons: [
          {
            id: 'les_ops_01',
            moduleId: 'mod_ops_01',
            title: '1. Multi-Stage Dockerfile Optimization',
            description: 'Minimal distroless containers, non-root user execution, and vulnerability scanning.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### Secure Container Packaging
Producing lightweight (<50MB) container images that eliminate build tooling from production artifacts.`,
            keyTakeaways: [
              'Multi-stage builds reduce container attack surface and minimize bandwidth overhead.',
            ],
            resources: [{ title: 'Production Multi-Stage Dockerfile Template', type: 'Code', size: '45 KB' }],
          },
          {
            id: 'les_ops_02',
            moduleId: 'mod_ops_01',
            title: '2. Automated CI Pipeline Security Scanning',
            description: 'Integrating SAST, DAST, and dependency vulnerability checks into pull requests.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Shift-Left Security in Government Software
Catching SQL injections and hardcoded secrets during commit builds before reaching staging environments.`,
            keyTakeaways: [
              'Automated pipeline gates block builds with Critical or High CVE vulnerabilities.',
            ],
            resources: [{ title: 'CI Pipeline Configuration Template', type: 'Code', size: '60 KB' }],
          },
        ],
      },
      {
        id: 'mod_ops_02',
        courseId: 'crs_devops_sre',
        title: 'Module 2 — Infrastructure as Code',
        description: 'Declarative cloud provisioning with Terraform.',
        order: 2,
        lessons: [
          {
            id: 'les_ops_03',
            moduleId: 'mod_ops_02',
            title: '1. Modular Terraform State Management',
            description: 'Remote state locks, workspaces, and parameterizing regional VPC clusters.',
            durationMinutes: 26,
            type: 'interactive',
            order: 1,
            content: `### Immutable Infrastructure with Terraform
Declarative templates enable version-controlled infrastructure provisioning that can be recreated in minutes.`,
            keyTakeaways: [
              'Always store Terraform state in encrypted remote object storage with state locking.',
            ],
            resources: [{ title: 'Terraform VPC Module Blueprint', type: 'Code', size: '120 KB' }],
          },
          {
            id: 'les_ops_04',
            moduleId: 'mod_ops_02',
            title: '2. Zero-Downtime Deployment Strategies',
            description: 'Blue-Green switching and progressive Canary rollouts using reverse proxies.',
            durationMinutes: 24,
            type: 'video',
            order: 2,
            content: `### Zero-Downtime Rollouts for Citizen Services
Switching production traffic with instant rollback capability if error rates spike.`,
            keyTakeaways: [
              'Canary testing routes 5% of real user traffic to validate releases before full cutover.',
            ],
            resources: [{ title: 'Canary Deployment Guide', type: 'Document', size: '410 KB' }],
          },
        ],
      },
      {
        id: 'mod_ops_03',
        courseId: 'crs_devops_sre',
        title: 'Module 3 — Observability & Error Budgets',
        description: 'Prometheus metrics, distributed tracing, and SLA governance.',
        order: 3,
        lessons: [
          {
            id: 'les_ops_05',
            moduleId: 'mod_ops_03',
            title: '1. The Four Golden Signals of SRE',
            description: 'Monitoring Latency, Traffic, Errors, and Saturation.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Observability with Prometheus & Grafana
Focusing alerts on user-impacting symptoms rather than server CPU spikes.`,
            keyTakeaways: [
              'The four golden signals give an immediate summary of service health.',
            ],
            resources: [{ title: 'Grafana Dashboard Template (JSON)', type: 'Code', size: '180 KB' }],
          },
          {
            id: 'les_ops_06',
            moduleId: 'mod_ops_03',
            title: '2. Defining SLOs & Error Budget Governance',
            description: 'Balancing development velocity against system reliability.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Error Budget Mechanics in Practice
When error budgets are consumed by outages, feature releases freeze and engineering focuses on hardening.`,
            keyTakeaways: [
              'Error budgets align engineering and administrative priorities objectively.',
            ],
            resources: [{ title: 'SLO Calculation Worksheet', type: 'Document', size: '290 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_disaster_risk',
    code: 'DRR-205',
    title: 'Disaster Risk Reduction & Geospatial Emergency Planning',
    tagline: 'Multi-hazard vulnerability mapping, early warning systems, and post-event damage triage.',
    description: 'A comprehensive operational program on leveraging satellite observation, flood inundation models, earthquake zoning maps, and automated SMS alert telemetry to safeguard communities against climate and geological disasters.',
    category: 'Earth & Climate',
    level: 'Intermediate',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    trainerDesignation: 'Senior Faculty & Lead Disaster Analyst',
    durationHours: 20,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    enrolledCount: 355,
    rating: 4.9,
    skillsCovered: ['Disaster Risk Mapping', 'Early Warning Systems', 'Inundation Modeling', 'Emergency Logistics'],
    thumbnailUrl: '/images/courses/earth-climate.jpg',
    objectives: [
      'Construct multi-hazard vulnerability and risk matrices for administrative districts',
      'Incorporate real-time radar and river gauge telemetry into emergency protocols',
      'Deploy geospatial incident management dashboards during disaster events',
      'Coordinate post-disaster damage assessment surveys using mobile GIS tools',
    ],
    modules: [
      {
        id: 'mod_drr_01',
        courseId: 'crs_disaster_risk',
        title: 'Module 1 — Hazard, Exposure & Vulnerability',
        description: 'The Sendai Framework and quantitative risk formula.',
        order: 1,
        lessons: [
          {
            id: 'les_drr_01',
            moduleId: 'mod_drr_01',
            title: '1. The Risk Equation: Hazard × Exposure × Vulnerability',
            description: 'Differentiating physical hazard probability from human and infrastructural vulnerability.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### The Quantitative Disaster Risk Formula
$$\\text{Risk} = \\frac{\\text{Hazard} \\times \\text{Exposure} \\times \\text{Vulnerability}}{\\text{Capacity}}$$
Reducing disaster impact requires systematically decreasing vulnerability while strengthening local community response capacity.`,
            keyTakeaways: [
              'Hazards are natural events; disasters occur when vulnerable populations are exposed.',
            ],
            resources: [{ title: 'Sendai Framework Indicator Guide', type: 'PDF', size: '1.8 MB' }],
          },
          {
            id: 'les_drr_02',
            moduleId: 'mod_drr_01',
            title: '2. Flood Inundation & Storm Surge Mapping',
            description: 'Digital Elevation Models (DEMs) and hydrodynamic flood extent modeling.',
            durationMinutes: 26,
            type: 'document',
            order: 2,
            content: `### Hydrodynamic Flood Modeling
Using 10m satellite DEMs to calculate coastal and riverine inundation depths under extreme rainfall return periods.`,
            keyTakeaways: [
              'Accurate elevation models are the backbone of localized flood evacuation zoning.',
            ],
            resources: [{ title: 'Flood Risk Zoning Methodology', type: 'PDF', size: '1.3 MB' }],
          },
        ],
      },
      {
        id: 'mod_drr_02',
        courseId: 'crs_disaster_risk',
        title: 'Module 2 — Early Warning Systems',
        description: 'Multi-channel citizen alerts and protocol execution.',
        order: 2,
        lessons: [
          {
            id: 'les_drr_03',
            moduleId: 'mod_drr_02',
            title: '1. Common Alerting Protocol (CAP) Standards',
            description: 'Standardized XML schemas for geo-targeted cell broadcast and sirens.',
            durationMinutes: 22,
            type: 'interactive',
            order: 1,
            content: `### The Common Alerting Protocol (CAP)
CAP standardizes emergency alerts across telecom providers, television broadcasters, and highway displays simultaneously.`,
            keyTakeaways: [
              'CAP provides single-entry multi-channel dissemination with polygon geofencing.',
            ],
            resources: [{ title: 'CAP XML Schema Sample', type: 'Code', size: '35 KB' }],
          },
          {
            id: 'les_drr_04',
            moduleId: 'mod_drr_02',
            title: '2. Cyclone & Extreme Weather Tracking Portals',
            description: 'Synthesizing radar reflectivity, Doppler velocity, and cone of uncertainty projections.',
            durationMinutes: 24,
            type: 'video',
            order: 2,
            content: `### Operational Storm Tracking
Interpreting central pressure, sustained wind radii, and estimated landfall time corridors for evacuation orders.`,
            keyTakeaways: [
              'Evacuation orders must be triggered based on estimated storm-surge onset, not final landfall.',
            ],
            resources: [{ title: 'Cyclone SOP Checklist', type: 'Document', size: '420 KB' }],
          },
        ],
      },
      {
        id: 'mod_drr_03',
        courseId: 'crs_disaster_risk',
        title: 'Module 3 — Emergency Response & Logistics',
        description: 'Resource tracking and rapid damage surveys.',
        order: 3,
        lessons: [
          {
            id: 'les_drr_05',
            moduleId: 'mod_drr_03',
            title: '1. Incident Command System (ICS) Operations',
            description: 'Clear chain of command across police, fire, health, and revenue departments.',
            durationMinutes: 20,
            type: 'video',
            order: 1,
            content: `### Unified Command Structure
Standardizing operational roles between municipal, district, and state response forces during emergencies.`,
            keyTakeaways: [
              'ICS eliminates confusion by establishing single-point accountability for logistics, ops, and planning.',
            ],
            resources: [{ title: 'Incident Command Org Chart', type: 'PDF', size: '610 KB' }],
          },
          {
            id: 'les_drr_06',
            moduleId: 'mod_drr_03',
            title: '2. Post-Event Satellite Damage Assessment',
            description: 'Rapid before-and-after change detection for relief compensation and reconstruction.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Satellite Damage Proxy Mapping
Comparing pre-event and post-event radar coherence to identify collapsed structures and submerged transportation corridors.`,
            keyTakeaways: [
              'Synthetic Aperture Radar (SAR) penetrates cloud cover during ongoing rainstorms to map floods.',
            ],
            resources: [{ title: 'Post-Disaster Survey Guidelines', type: 'PDF', size: '940 KB' }],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_101',
    code: 'GOV-201',
    title: 'Public Service Digital Governance & Cloud Operations',
    tagline: 'Modernizing citizen service delivery through secure digital infrastructure.',
    description: 'A comprehensive program designed for public sector professionals to architect, adopt, and manage secure cloud-native public infrastructure and e-governance solutions.',
    category: 'Digital Governance',
    level: 'Intermediate',
    trainerId: 'usr_trainer_002',
    trainerName: 'Prof. Arvind Kulkarni',
    durationHours: 24,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 418,
    rating: 4.8,
    skillsCovered: ['Cloud Architecture', 'Digital Delivery', 'Citizen Services', 'Data Privacy'],
    thumbnailUrl: '/images/courses/cloud-infrastructure.jpg',
    modules: [
      {
        id: 'mod_dg_01',
        courseId: 'crs_101',
        title: 'Module 1 — Cloud Architecture Foundations',
        description: 'Sovereign cloud perimeters and citizen service reliability.',
        order: 1,
        lessons: [
          {
            id: 'les_dg_01',
            moduleId: 'mod_dg_01',
            title: '1. Sovereign Government Cloud Architecture',
            description: 'Data isolation laws, domestic residency, and tenant isolation.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Dedicated Sovereign Government Cloud
Government workloads require cryptographic boundary isolation and local hardware security modules (HSMs).`,
            keyTakeaways: ['Sovereignty requires both geographic storage and administrative operational independence.'],
          },
          {
            id: 'les_dg_02',
            moduleId: 'mod_dg_01',
            title: '2. Citizen Registry Security Standards',
            description: 'Principle of Least Privilege and RBAC role assignment.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Least Privilege in Public Registries
Identities must receive only minimum authorized permissions for limited operational durations.`,
            keyTakeaways: ['PoLP minimizes the blast radius during security incidents.'],
          },
        ],
      },
      {
        id: 'mod_dg_02',
        courseId: 'crs_101',
        title: 'Module 2 — Resilient Service Design',
        description: 'High availability and disaster recovery patterns.',
        order: 2,
        lessons: [
          {
            id: 'les_dg_03',
            moduleId: 'mod_dg_02',
            title: '1. Four Nines Availability and Circuit Breakers',
            description: 'Uptime mathematics and preventing cascading gateway outages.',
            durationMinutes: 22,
            type: 'interactive',
            order: 1,
            content: `### 99.99% Availability & Resilience Patterns
Circuit breakers protect portals when payment gateways or identity validators experience latency.`,
            keyTakeaways: ['Four nines allows less than 52.6 minutes of downtime per calendar year.'],
          },
          {
            id: 'les_dg_04',
            moduleId: 'mod_dg_02',
            title: '2. Declarative Infrastructure as Code for Governance',
            description: 'Auditable reproducible deployments with Terraform.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Reproducible Public Services
IaC creates deterministic, peer-reviewed infrastructure across staging and production.`,
            keyTakeaways: ['Eliminate manual server modifications to preserve audit integrity.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_102',
    code: 'SEC-301',
    title: 'Enterprise Cybersecurity Essentials & Data Protection',
    tagline: 'Defense-in-depth, threat mitigation, and regulatory data compliance.',
    description: 'Learn cyber hygiene, incident triage, identity verification frameworks, and statutory data protection protocols according to contemporary national directives.',
    category: 'Information Security',
    level: 'Advanced',
    trainerId: 'usr_trainer_003',
    trainerName: 'Prof. Rahul Iyer',
    durationHours: 32,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 342,
    rating: 4.9,
    skillsCovered: ['Threat Modeling', 'Zero Trust', 'Compliance Auditing', 'Risk Assessment'],
    thumbnailUrl: '/images/courses/cybersecurity.jpg',
    modules: [
      {
        id: 'mod_cs_01',
        courseId: 'crs_102',
        title: 'Module 1 — Defensive Security Foundations',
        description: 'Zero Trust principles and phishing prevention.',
        order: 1,
        lessons: [
          {
            id: 'les_cs_01',
            moduleId: 'mod_cs_01',
            title: '1. Zero Trust Network Principles',
            description: 'Continuous authentication and verifying every access request.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### The Zero Trust Standard
Treating internal networks as potentially hostile; every packet must be authenticated and encrypted.`,
            keyTakeaways: ['Never trust implicitly based on IP or physical LAN connection.'],
          },
          {
            id: 'les_cs_02',
            moduleId: 'mod_cs_01',
            title: '2. Modern Authentication & Phishing Protection',
            description: 'Why SMS OTPs are vulnerable and why FIDO2 passkeys are mandatory.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### FIDO2 / WebAuthn Defense
Public-key cryptographic tokens completely eliminate credential harvesting proxies.`,
            keyTakeaways: ['Hardware tokens tie signatures to browser domain origin.'],
          },
        ],
      },
      {
        id: 'mod_cs_02',
        courseId: 'crs_102',
        title: 'Module 2 — Incident Triage & Statutory Reporting',
        description: 'Statutory compliance and reporting timelines.',
        order: 2,
        lessons: [
          {
            id: 'les_cs_03',
            moduleId: 'mod_cs_02',
            title: '1. Incident Reporting Directives',
            description: 'Mandatory notification windows for critical breaches.',
            durationMinutes: 24,
            type: 'interactive',
            order: 1,
            content: `### National Incident Response Mandates
Critical infrastructure cyber incidents must be reported to national authorities within statutory timelines.`,
            keyTakeaways: ['Timely disclosure minimizes regional cascade failures.'],
          },
          {
            id: 'les_cs_04',
            moduleId: 'mod_cs_02',
            title: '2. Cryptographic Key Management',
            description: 'Asymmetric encryption and recipient private key security.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Public Key Cryptography in Transit
Sender encrypts using recipient public key; only recipient private key can decrypt.`,
            keyTakeaways: ['Private keys must remain stored in secure hardware.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_103',
    code: 'PM-102',
    title: 'Modern Project Management for Public Sector',
    tagline: 'Delivering large-scale capacity programs on schedule and budget.',
    description: 'Covers agile governance, milestone tracking, stakeholder alignment, public procurement processes, and performance reporting for mission-mode initiatives.',
    category: 'Project Management',
    level: 'Foundational',
    trainerId: 'usr_trainer_001',
    trainerName: 'Dr. Kavya Menon',
    durationHours: 18,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 520,
    rating: 4.7,
    skillsCovered: ['Agile Execution', 'Procurement', 'Risk Mitigation', 'Stakeholder Comms'],
    thumbnailUrl: '/images/courses/leadership.jpg',
    modules: [
      {
        id: 'mod_pm_01',
        courseId: 'crs_103',
        title: 'Module 1 — Critical Paths & Budgeting',
        description: 'Schedule network analysis and earned value metrics.',
        order: 1,
        lessons: [
          {
            id: 'les_pm_01',
            moduleId: 'mod_pm_01',
            title: '1. Critical Path Analysis',
            description: 'Determining shortest project completion time without float.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Critical Path Method (CPM)
The longest dependent activity chain dictates total project timeline; any delay along it delays delivery.`,
            keyTakeaways: ['Critical path activities possess zero total slack.'],
          },
          {
            id: 'les_pm_02',
            moduleId: 'mod_pm_01',
            title: '2. Earned Value Management (EVM)',
            description: 'Cost Performance Index (CPI) and schedule indicators.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Measuring Real Progress with EVM
CPI > 1.0 demonstrates superior budget efficiency (e.g., $1.15 earned value per $1.00 spent).`,
            keyTakeaways: ['CPI provides an unbiased metric of expenditure effectiveness.'],
          },
        ],
      },
      {
        id: 'mod_pm_02',
        courseId: 'crs_103',
        title: 'Module 2 — Governance & Risk Allocation',
        description: 'RACI matrices and risk transference in procurement.',
        order: 2,
        lessons: [
          {
            id: 'les_pm_03',
            moduleId: 'mod_pm_02',
            title: '1. The RACI Accountability Matrix',
            description: 'Delineating Responsible, Accountable, Consulted, and Informed stakeholders.',
            durationMinutes: 22,
            type: 'interactive',
            order: 1,
            content: `### Accountability Clarity
Every project milestone must have exactly one Accountable officer to avoid diffusion of responsibility.`,
            keyTakeaways: ['Only one person can be Accountable per deliverable.'],
          },
          {
            id: 'les_pm_04',
            moduleId: 'mod_pm_02',
            title: '2. Public Procurement Risk Response',
            description: 'Risk transference via performance bank guarantees.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Risk Transference Strategies
Shifting fiscal consequences of vendor default to underwriters without increasing hazard probability.`,
            keyTakeaways: ['Insurance and bank guarantees transfer residual project risk.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_gis_foundations',
    code: 'GIS-101',
    title: 'Introduction to Geographic Information Systems (GIS) & Spatial Analytics',
    tagline: 'Vector mapping, coordinate projections, spatial queries, and thematic municipal cartography.',
    description: 'A foundational curriculum for administrative officers to understand geospatial layers, attribute table joins, buffer analysis, cadastral overlay, and map production for urban and rural governance.',
    category: 'Geospatial Technology',
    level: 'Foundational',
    trainerId: 'usr_trainer_002',
    trainerName: 'Dr. Arjun Mehta',
    trainerDesignation: 'Lead Geospatial Architect & Senior Faculty',
    durationHours: 18,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 390,
    rating: 4.8,
    skillsCovered: ['GIS Fundamentals', 'Vector Geometries', 'Spatial Queries', 'Cartographic Design', 'Coordinate Systems'],
    thumbnailUrl: '/images/courses/geospatial-satellite.jpg',
    objectives: [
      'Master points, polylines, and polygons in spatial vector analysis',
      'Execute spatial intersection and buffer zoning for administrative planning',
      'Integrate departmental survey spreadsheets with shapefiles',
      'Produce publication-grade thematic thematic boundary maps',
    ],
    modules: [
      {
        id: 'mod_gis_01',
        courseId: 'crs_gis_foundations',
        title: 'Module 1 — Spatial Data Foundations',
        description: 'Coordinate reference systems, projections, and vector layers.',
        order: 1,
        lessons: [
          {
            id: 'les_gis_01',
            moduleId: 'mod_gis_01',
            title: '1. Coordinates & Projections in Practice',
            description: 'Understanding WGS84 vs projected metric UTM systems for local measurements.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Projections and Distortion in Administrative Mapping
Unprojected geographic coordinates (latitude and longitude in degrees) cannot accurately calculate true surface distance or polygonal land area.
Projecting vector layers into Universal Transverse Mercator (UTM) zones preserves metric distance calculations required for land revenue cadastres.`,
            keyTakeaways: ['Always project spatial vector layers to metric systems before calculating parcel area.'],
          },
          {
            id: 'les_gis_02',
            moduleId: 'mod_gis_01',
            title: '2. Spatial Data Formats: Shapefiles, GeoJSON, and GeoPackage',
            description: 'Modern open geospatial standards and geometry encodings.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Vector Encodings for Open Governance
While legacy ESRI shapefiles suffer from 2GB limitations and truncated 10-character field names, modern SQLite-based OGC GeoPackage files store multiple spatial layers, tables, and style metadata in a single compact binary file.`,
            keyTakeaways: ['GeoPackage is the recommended open standard for public spatial data exchange.'],
          },
        ],
      },
      {
        id: 'mod_gis_02',
        courseId: 'crs_gis_foundations',
        title: 'Module 2 — Spatial Analysis & Municipal Applications',
        description: 'Buffers, spatial joins, and thematic map production.',
        order: 2,
        lessons: [
          {
            id: 'les_gis_03',
            moduleId: 'mod_gis_02',
            title: '1. Buffer Zoning & Proximity Analysis',
            description: 'Generating statutory setback buffers around sensitive environmental zones.',
            durationMinutes: 22,
            type: 'interactive',
            order: 1,
            content: `### Buffer Analysis in Public Works
Proximity queries identify parcels within statutory exclusion corridors (e.g., 500m eco-sensitive lake buffers or 100m highway rights-of-way).`,
            keyTakeaways: ['Buffer queries provide verifiable spatial compliance auditing for building permits.'],
          },
          {
            id: 'les_gis_04',
            moduleId: 'mod_gis_02',
            title: '2. Thematic Cartography & Choropleth Design',
            description: 'Designing accessible, standardized district heat maps.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Cartographic Integrity in Public Reports
Choropleth maps must normalize absolute counts by population density or land area to prevent misleading visual impressions caused by large physical districts.`,
            keyTakeaways: ['Never map raw demographic counts on choropleths; always normalize rates per capita.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_machine_learning',
    code: 'ML-301',
    title: 'Machine Learning Foundations & Predictive Analytics',
    tagline: 'Regression, classification, feature engineering, and model evaluation metrics.',
    description: 'A hands-on technical course on formulating machine learning tasks for administrative decision support. Covers training supervised models, avoiding data leakage, computing ROC-AUC and precision-recall trade-offs, and deploying predictive pipelines.',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    trainerId: 'usr_trainer_001',
    trainerName: 'Dr. Kavya Menon',
    trainerDesignation: 'Head of AI & Administrative Analytics',
    durationHours: 24,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 430,
    rating: 4.9,
    skillsCovered: ['Supervised Learning', 'Feature Engineering', 'Scikit-Learn', 'Cross-Validation', 'Model Evaluation'],
    thumbnailUrl: '/images/courses/ai-neural-network.jpg',
    objectives: [
      'Formulate public sector administrative problems as supervised ML tasks',
      'Preprocess tabular features, handle missing data, and encode categories',
      'Train and evaluate tree-based ensembles (Random Forest, XGBoost)',
      'Interpret feature importances and calibrate probabilistic predictions',
    ],
    modules: [
      {
        id: 'mod_ml_01',
        courseId: 'crs_machine_learning',
        title: 'Module 1 — Supervised Learning Foundations',
        description: 'Problem formulation, train/test splits, and baseline models.',
        order: 1,
        lessons: [
          {
            id: 'les_ml_01',
            moduleId: 'mod_ml_01',
            title: '1. Machine Learning Problem Formulation',
            description: 'Framing classification versus regression; preventing target leakage.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### Formulating Administrative Prediction Tasks
From predicting seasonal disease outbreak vulnerability to estimating public transit demand, defining clean features and target horizons is essential. Data leakage occurs when future information contaminates training features.`,
            keyTakeaways: ['Strict temporal train/test splits prevent optimistic data leakage.'],
          },
          {
            id: 'les_ml_02',
            moduleId: 'mod_ml_01',
            title: '2. Feature Engineering & Numerical Scaling',
            description: 'One-hot encoding, target encoding, standard scaling, and handling class imbalances.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Preparing Tabular Datasets
Transforming raw department codes into clean mathematical features using scikit-learn Pipelines to guarantee reproducible preprocessing across training and inference.`,
            keyTakeaways: ['Fit transformers exclusively on training splits to prevent data snooping.'],
          },
        ],
      },
      {
        id: 'mod_ml_02',
        courseId: 'crs_machine_learning',
        title: 'Module 2 — Ensemble Models & Rigorous Evaluation',
        description: 'Tree ensembles and production evaluation metrics.',
        order: 2,
        lessons: [
          {
            id: 'les_ml_03',
            moduleId: 'mod_ml_02',
            title: '1. Gradient Boosted Decision Trees',
            description: 'Understanding boosting mechanics, hyperparameter tuning, and early stopping.',
            durationMinutes: 26,
            type: 'interactive',
            order: 1,
            content: `### The Power of GBDTs on Tabular Registries
Gradient boosting models iteratively correct errors made by preceding decision trees, consistently delivering state-of-the-art accuracy on structured administrative records.`,
            keyTakeaways: ['Use cross-validation with early stopping to prevent tree overfitting.'],
          },
          {
            id: 'les_ml_04',
            moduleId: 'mod_ml_02',
            title: '2. Evaluation Beyond Accuracy: Precision, Recall, and ROC-AUC',
            description: 'Evaluating models under severe class imbalance.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Why Raw Accuracy is Deceptive
In fraud detection where 99% of transactions are legitimate, a model predicting "never fraud" attains 99% accuracy while failing completely. We evaluate F1 score and precision-recall curves to optimize operational thresholds.`,
            keyTakeaways: ['Threshold tuning balances inspection costs against missed incidents.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_sql_database',
    code: 'DB-201',
    title: 'SQL for Relational Data Management & Public Registries',
    tagline: 'Declarative querying, normalization, window functions, and database integrity.',
    description: 'Master structured query language (SQL) for managing large-scale civil registries and transactional databases. Learn relational schema normalization, multi-table joins, subqueries, analytical window functions, and database indexes.',
    category: 'Databases',
    level: 'Foundational',
    trainerId: 'usr_trainer_001',
    trainerName: 'Dr. Kavya Menon',
    trainerDesignation: 'Head of AI & Administrative Analytics',
    durationHours: 16,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 510,
    rating: 4.8,
    skillsCovered: ['SQL', 'Relational Schema Design', 'Joins & Aggregations', 'Window Functions', 'Query Optimization'],
    thumbnailUrl: '/images/courses/data-analytics.jpg',
    objectives: [
      'Write robust SQL queries for data extraction and departmental reporting',
      'Join multiple normalized relational tables with full data integrity',
      'Utilize window functions (ROW_NUMBER, RANK, LAG/LEAD) for analytical audits',
      'Understand indexes and query execution plans for sub-second responses',
    ],
    modules: [
      {
        id: 'mod_sql_01',
        courseId: 'crs_sql_database',
        title: 'Module 1 — Core Queries & Joins',
        description: 'Declarative query syntax, filtering, and multi-table joins.',
        order: 1,
        lessons: [
          {
            id: 'les_sql_01',
            moduleId: 'mod_sql_01',
            title: '1. Structured Data Retrieval & Filtering',
            description: 'SELECT, WHERE, ORDER BY, GROUP BY, and HAVING execution order.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### The SQL Logical Processing Order
Although written starting with SELECT, SQL engines evaluate FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY. Understanding this order prevents common aggregate filtering errors.`,
            keyTakeaways: ['Use HAVING to filter on aggregated results and WHERE to filter raw rows.'],
          },
          {
            id: 'les_sql_02',
            moduleId: 'mod_sql_01',
            title: '2. Multi-Table Relational Joins',
            description: 'INNER, LEFT, RIGHT, and FULL OUTER joins across primary and foreign keys.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Preserving Incomplete Records with Outer Joins
When generating cohort audit reports, a LEFT JOIN ensures trainees who have not yet completed an assessment are still included in the summary tally.`,
            keyTakeaways: ['LEFT JOIN guarantees parent entities are retained even with null relation records.'],
          },
        ],
      },
      {
        id: 'mod_sql_02',
        courseId: 'crs_sql_database',
        title: 'Module 2 — Advanced Analytics with SQL',
        description: 'Window functions and query performance optimization.',
        order: 2,
        lessons: [
          {
            id: 'les_sql_03',
            moduleId: 'mod_sql_02',
            title: '1. Analytical Window Functions',
            description: 'PARTITION BY calculations without collapsing individual row details.',
            durationMinutes: 25,
            type: 'interactive',
            order: 1,
            content: `### Calculating Running Totals & Cohort Ranks
Window functions compute calculations across related rows without collapsing results into a single group row, enabling running totals and departmental score rankings.`,
            keyTakeaways: ['OVER (PARTITION BY ... ORDER BY ...) preserves row-level fidelity.'],
          },
          {
            id: 'les_sql_04',
            moduleId: 'mod_sql_02',
            title: '2. B-Tree Indexes & Query Execution Plans',
            description: 'How indexes accelerate search and reading EXPLAIN output.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Eliminating Full Table Scans
Indexes provide sorted pointers to disk blocks, converting slow O(N) sequential table scans into fast O(log N) tree lookups on high-frequency filter columns.`,
            keyTakeaways: ['Index columns frequently used in WHERE conditions and JOIN keys.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_cloud_native',
    code: 'CLD-205',
    title: 'Cloud Computing Fundamentals & Scalable Architecture',
    tagline: 'Virtualization, serverless microservices, object storage, and cloud governance.',
    description: 'A comprehensive foundational course on designing and administering cloud-native workloads for public infrastructure. Explore compute models (VMs vs containers vs serverless), multi-region disaster recovery, IAM security policies, and cost governance.',
    category: 'Cloud Computing',
    level: 'Foundational',
    trainerId: 'usr_trainer_003',
    trainerName: 'Prof. Rahul Iyer',
    trainerDesignation: 'Distinguished Professor & Infrastructure Architect',
    durationHours: 20,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 360,
    rating: 4.8,
    skillsCovered: ['Cloud Architecture', 'IAM & Security Policies', 'Serverless Computing', 'Multi-Region High Availability', 'FinOps'],
    thumbnailUrl: '/images/courses/cloud-infrastructure.jpg',
    objectives: [
      'Compare IaaS, PaaS, and FaaS service models for departmental use cases',
      'Configure principle of least privilege IAM roles and policies',
      'Architect resilient stateless web services behind global load balancers',
      'Implement multi-tier cloud backup and automated retention schedules',
    ],
    modules: [
      {
        id: 'mod_cld_01',
        courseId: 'crs_cloud_native',
        title: 'Module 1 — Cloud Architecture Foundations',
        description: 'Virtualization, VPC networks, and Identity & Access Management.',
        order: 1,
        lessons: [
          {
            id: 'les_cld_01',
            moduleId: 'mod_cld_01',
            title: '1. Virtual Private Clouds (VPC) & Subnet Isolation',
            description: 'Segregating public facing web tiers from private database subnets.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### Network Isolation in the Cloud
Never expose database instances directly to public IP addresses. Isolate persistent tiers inside private subnets routing outbound traffic exclusively via managed NAT Gateways.`,
            keyTakeaways: ['Keep stateful registries in private subnets with no public IP allocation.'],
          },
          {
            id: 'les_cld_02',
            moduleId: 'mod_cld_01',
            title: '2. Cloud IAM Policies & Service Accounts',
            description: 'Role-based access control and short-lived credential tokens.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Eliminating Long-Lived Static API Keys
Service accounts and instance metadata tokens automatically rotate cryptographic credentials, eliminating static secrets hardcoded in configuration files.`,
            keyTakeaways: ['Bind IAM roles to cloud workloads rather than storing secret keys on disk.'],
          },
        ],
      },
      {
        id: 'mod_cld_02',
        courseId: 'crs_cloud_native',
        title: 'Module 2 — Scalability & Reliability',
        description: 'Auto-scaling groups, object storage, and cross-region recovery.',
        order: 2,
        lessons: [
          {
            id: 'les_cld_03',
            moduleId: 'mod_cld_02',
            title: '1. Stateless Compute & Elastic Auto-Scaling',
            description: 'Handling traffic surges during scheme application deadlines without crashing.',
            durationMinutes: 24,
            type: 'interactive',
            order: 1,
            content: `### Designing for Elasticity
By offloading session state to distributed caches and databases, application servers can spin up and down dynamically in response to incoming CPU and request spikes.`,
            keyTakeaways: ['Stateless application tiers scale horizontally with zero session disruption.'],
          },
          {
            id: 'les_cld_04',
            moduleId: 'mod_cld_02',
            title: '2. Object Storage Lifecycle & Disaster Recovery',
            description: 'Durable blob storage with automated archival to cold tiers.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### 11 Nines of Data Durability
Cloud object stores replicate citizen documents across multiple distinct availability zones, ensuring documents remain retrievable even during local datacenter outages.`,
            keyTakeaways: ['Lifecycle policies automatically transition older documents to low-cost archival storage.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_executive_leadership',
    code: 'LDR-501',
    title: 'Strategic Leadership & Institutional Decision Making',
    tagline: 'Visionary public governance, crisis management, and evidence-based decision frameworks.',
    description: 'An executive masterclass designed for senior administrators to navigate complex public sector challenges. Covers strategic resource allocation, ethical leadership, crisis negotiations, inter-ministerial coordination, and driving institutional reform.',
    category: 'Leadership',
    level: 'Advanced',
    trainerId: 'usr_trainer_004',
    trainerName: 'Dr. Sunita Sen',
    trainerDesignation: 'Executive Faculty Lead & Senior Policy Fellow',
    durationHours: 16,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 280,
    rating: 4.9,
    skillsCovered: ['Strategic Vision', 'Crisis Leadership', 'Ethical Governance', 'Change Management', 'Inter-Agency Coordination'],
    thumbnailUrl: '/images/courses/leadership.jpg',
    objectives: [
      'Master strategic decision-making frameworks under high ambiguity',
      'Lead crisis response task forces with calm, evidence-grounded directives',
      'Resolve ethical dilemmas upholding constitutional values and public trust',
      'Drive change management initiatives that align institutional stakeholders',
    ],
    modules: [
      {
        id: 'mod_ldr_01',
        courseId: 'crs_executive_leadership',
        title: 'Module 1 — Strategic Thinking in Public Governance',
        description: 'Anticipatory governance and systems thinking.',
        order: 1,
        lessons: [
          {
            id: 'les_ldr_01',
            moduleId: 'mod_ldr_01',
            title: '1. Systems Thinking in Policy Execution',
            description: 'Analyzing secondary and tertiary feedback loops before enacting reforms.',
            durationMinutes: 25,
            type: 'video',
            order: 1,
            content: `### Systems Thinking for Public Leaders
Public sector interventions rarely exist in isolation. Implementing a subsidy or regulatory requirement creates ripple effects across markets, regional compliance costs, and citizen behaviors that must be modeled prior to gazette notification.`,
            keyTakeaways: ['Map stakeholder incentives to foresee unintended secondary policy consequences.'],
          },
          {
            id: 'les_ldr_02',
            moduleId: 'mod_ldr_01',
            title: '2. Decision Making Under Uncertainty & Crisis',
            description: 'The OODA loop and rapid triage in high-stakes public emergencies.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### The OODA Loop: Observe, Orient, Decide, Act
In acute crises where information is incomplete, waiting for 100% certainty often paralyzes response. Leaders execute rapid iterative decisions, continually updating actions as ground reports arrive.`,
            keyTakeaways: ['Rapid iterative decisions based on 70% confidence beat delayed perfection.'],
          },
        ],
      },
      {
        id: 'mod_ldr_02',
        courseId: 'crs_executive_leadership',
        title: 'Module 2 — Institutional Change & Ethics',
        description: 'Managing resistance and sustaining ethical public integrity.',
        order: 2,
        lessons: [
          {
            id: 'les_ldr_03',
            moduleId: 'mod_ldr_02',
            title: '1. Leading Transformational Change in Bureaucracies',
            description: 'Building coalitions, celebrating early wins, and anchoring reform in institutional culture.',
            durationMinutes: 24,
            type: 'interactive',
            order: 1,
            content: `### Overcoming Bureaucratic Inertia
Successful digital transformation requires winning over mid-level cadres through comprehensive upskilling, transparent incentives, and showcasing immediate administrative time savings.`,
            keyTakeaways: ['Frame technological transformation around public value and officer convenience.'],
          },
          {
            id: 'les_ldr_04',
            moduleId: 'mod_ldr_02',
            title: '2. The Constitutional Integrity Mandate',
            description: 'Resolving complex ethical dilemmas with non-negotiable impartiality.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Non-Negotiable Public Trust
Public leadership is grounded in constitutional integrity, transparent decision logging, and absolute impartiality toward all citizens regardless of status or influence.`,
            keyTakeaways: ['Transparent rationale documentation shields decisions against allegations of impropriety.'],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_env_sustainability',
    code: 'ENV-301',
    title: 'Environmental Sustainability & Climate Action Frameworks',
    tagline: 'Carbon accounting, circular economy governance, and regional ecological resilience.',
    description: 'An authoritative program for public officials to master modern sustainability directives, green procurement criteria, water basin conservation protocols, and Net-Zero municipal transition planning.',
    category: 'Environmental Sustainability',
    level: 'Intermediate',
    trainerId: 'usr_trainer_006',
    trainerName: 'Dr. Neha Rao',
    trainerDesignation: 'Principal Climatologist & Sustainability Faculty',
    durationHours: 20,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    enrolledCount: 320,
    rating: 4.9,
    skillsCovered: ['Carbon Accounting', 'Circular Economy', 'Green Procurement', 'Water Basin Governance', 'ESG Compliance'],
    thumbnailUrl: '/images/courses/earth-climate.jpg',
    objectives: [
      'Quantify Scope 1, 2, and 3 emissions across municipal operations',
      'Formulate sustainable green public procurement criteria for department tenders',
      'Implement integrated watershed management protocols for drought resilience',
      'Align state climate action plans with national decarbonization targets',
    ],
    modules: [
      {
        id: 'mod_env_01',
        courseId: 'crs_env_sustainability',
        title: 'Module 1 — Carbon Accounting & Decarbonization Pathways',
        description: 'Greenhouse gas protocols and energy transition strategies.',
        order: 1,
        lessons: [
          {
            id: 'les_env_01',
            moduleId: 'mod_env_01',
            title: '1. Greenhouse Gas (GHG) Protocol Scopes',
            description: 'Calculating Scope 1 direct, Scope 2 electricity, and Scope 3 supply chain footprints.',
            durationMinutes: 24,
            type: 'video',
            order: 1,
            content: `### Measuring Municipal Carbon Footprints
Accurate sustainability governance requires standard emissions boundaries:
- **Scope 1:** Direct emissions from municipal vehicle fleets and generators.
- **Scope 2:** Indirect emissions from purchased grid electricity.
- **Scope 3:** Embedded lifecycle emissions in public construction materials and outsourced services.`,
            keyTakeaways: ['Scope 3 frequently comprises over 70% of total institutional carbon footprints.'],
          },
          {
            id: 'les_env_02',
            moduleId: 'mod_env_01',
            title: '2. Sustainable Public Procurement Standards',
            description: 'Embedding life-cycle assessment (LCA) criteria into government tenders.',
            durationMinutes: 22,
            type: 'document',
            order: 2,
            content: `### Green Tendering in Practice
Evaluating tenders based on Total Cost of Ownership (TCO) including operational energy efficiency and recyclable packaging rather than lowest immediate capital quote.`,
            keyTakeaways: ['Green procurement incentivizes private suppliers to decarbonize manufacturing.'],
          },
        ],
      },
      {
        id: 'mod_env_02',
        courseId: 'crs_env_sustainability',
        title: 'Module 2 — Watershed & Ecosystem Resilience',
        description: 'Integrated watershed management and urban biodiversity conservation.',
        order: 2,
        lessons: [
          {
            id: 'les_env_03',
            moduleId: 'mod_env_02',
            title: '1. Integrated River Basin Management',
            description: 'Protecting recharge zones, riparian buffers, and preventing groundwater depletion.',
            durationMinutes: 25,
            type: 'interactive',
            order: 1,
            content: `### Groundwater Sustainability Protocols
Coordinating extraction limits with satellite gravimetry (GRACE) data to protect unconfined regional aquifers from irreversible compaction.`,
            keyTakeaways: ['Riparian buffer conservation naturally filters agricultural runoff and mitigates flooding.'],
          },
          {
            id: 'les_env_04',
            moduleId: 'mod_env_02',
            title: '2. Circular Economy in Municipal Solid Waste',
            description: 'Decentralized composting, EPR regulations, and material recovery facilities.',
            durationMinutes: 20,
            type: 'document',
            order: 2,
            content: `### Diverting Waste from Landfills
Extended Producer Responsibility (EPR) mandates hold packaging manufacturers accountable for end-of-life plastic collection and scientific recycling.`,
            keyTakeaways: ['Source segregation at household levels determines downstream recycling economic viability.'],
          },
        ],
      },
    ],
  },
];


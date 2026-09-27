/**
 * Capacity Connect - Course Assessment Catalog & Question Banks
 * Realistic, domain-specific educational MCQs for Capacity Building assessments.
 */

import { Assessment } from '../types';

export const COMPREHENSIVE_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm_weather_01',
    courseId: 'crs_weather',
    courseTitle: 'Weather Data Analysis',
    moduleId: 'mod_wda_01',
    moduleTitle: 'Foundations of Weather Data',
    title: 'Weather Data Analysis — Comprehensive Evaluation',
    description:
      'Evaluate your practical understanding of meteorological datasets, NetCDF and GRIB format processing, surface station data cleaning, statistical anomaly detection, and time series climatology.',
    durationMinutes: 15,
    totalMarks: 50,
    passingScorePercent: 70,
    questionsCount: 5,
    status: 'open',
    deadline: '2026-10-20T18:30:00Z',
    instructions: [
      'Each question contains four options with exactly one correct answer.',
      'Selected answers persist automatically in real-time as you switch between questions.',
      'A passing score of 70% (at least 4 out of 5 questions correct) is required to earn evaluation certification.',
      'The timer cannot be paused once initiated. If time runs out, your current selections are automatically submitted.',
      'Immediate answer review and pedagogical explanations will be unlocked upon final submission.',
    ],
    questions: [
      {
        id: 'q_wda_101',
        text: 'Which binary data standard is officially specified by the World Meteorological Organization (WMO) for gridded numerical weather prediction (NWP) model outputs?',
        options: [
          'GeoTIFF with raster bands',
          'GRIB / GRIB2 (GRIdded Binary)',
          'ESRI Shapefile with attributes',
          'GeoJSON vector geometry collections',
        ],
        correctOptionIndex: 1,
        explanation:
          'GRIB (and GRIB2) is the designated WMO standard file format engineered specifically for the compact, standardized transmission and archiving of gridded numerical weather prediction data.',
        points: 10,
      },
      {
        id: 'q_wda_102',
        text: 'When calculating climatological anomalies across surface weather stations, what reference baseline standard is recommended by WMO guidelines?',
        options: [
          'The trailing 365-day moving average',
          'A standardized 30-year climatological normal period (e.g., 1991–2020)',
          'The mean of the highest and lowest recorded temperatures in the past decade',
          'A linear least-squares regression across the satellite era',
        ],
        correctOptionIndex: 1,
        explanation:
          'The World Meteorological Organization defines climatological standard normals as 30-year averages updated every decade (currently 1991–2020) to provide a stable reference against which current anomalies are measured.',
        points: 10,
      },
      {
        id: 'q_wda_103',
        text: 'Which Python library provides labeled N-dimensional multi-sensor array manipulation tailored specifically for NetCDF and GRIB climate data arrays?',
        options: [
          'BeautifulSoup4',
          'xarray (built on NumPy and Pandas)',
          'Scrapy DataPipelines',
          'PyJWT Security Framework',
        ],
        correctOptionIndex: 1,
        explanation:
          'xarray extends NumPy arrays by adding dimension names, coordinates, and dataset attributes, mirroring NetCDF data models directly into interactive Python dataframes.',
        points: 10,
      },
      {
        id: 'q_wda_104',
        text: 'In meteorological thermodynamic diagnostics, what physical condition is indicated when the Dry-Bulb Temperature equals the Dew Point Temperature?',
        options: [
          'Atmospheric pressure has dropped below 950 hPa',
          'Relative Humidity has reached 100% saturation (fog or cloud formation)',
          'Solar irradiance has exceeded convective threshold capacity',
          'The lapse rate has become dry adiabatic',
        ],
        correctOptionIndex: 1,
        explanation:
          'When dry-bulb ambient temperature cools to the dew point temperature, the air is completely saturated with moisture (relative humidity = 100%), initiating condensation into fog, dew, or precipitation.',
        points: 10,
      },
      {
        id: 'q_wda_105',
        text: 'In an automated weather station (AWS) quality control pipeline, which filter rule flags sensor readings that violate seasonal thermodynamic extremes?',
        options: [
          'Spatial cross-station correlation validation',
          'Range limit and gross error plausibility check',
          'Internal persistence step check',
          'Network packet parity check',
        ],
        correctOptionIndex: 1,
        explanation:
          'Range limit and plausibility checks verify that recorded sensor values fall within physically possible climatological thresholds for the geographic location and season.',
        points: 10,
      },
    ],
  },
  {
    id: 'asm_python_01',
    courseId: 'crs_python',
    courseTitle: 'Python for Data Analysis',
    moduleId: 'mod_py_01',
    moduleTitle: 'Python Data Structures & Numerical Foundations',
    title: 'Python for Data Analysis — Practical Core Assessment',
    description:
      'Validate your proficiency in Pandas dataframe manipulation, vectorized NumPy operations, handling missing records, datetime indexing, and group-level aggregations.',
    durationMinutes: 15,
    totalMarks: 50,
    passingScorePercent: 70,
    questionsCount: 5,
    status: 'open',
    deadline: '2026-10-25T18:30:00Z',
    instructions: [
      'Answer all 5 multiple choice questions covering Pandas, NumPy, and data cleaning routines.',
      'You can freely navigate between questions and revise your answers before submission.',
      'Passing benchmark is 70% (minimum 4 correct answers).',
      'Explanations are displayed immediately after submitting your evaluation.',
    ],
    questions: [
      {
        id: 'q_py_201',
        text: 'Why are vectorized operations in Pandas/NumPy significantly faster than iterative Python "for" loops when processing tabular data?',
        options: [
          'They compile Python code into JavaScript in the browser',
          'They execute contiguous memory operations in pre-compiled C/Fortran routines with SIMD vectorization',
          'They utilize HTTP caching protocols automatically',
          'They reduce numerical precision from 64-bit to 4-bit integers',
        ],
        correctOptionIndex: 1,
        explanation:
          'NumPy and Pandas utilize contiguous C arrays and vector processor instructions (SIMD), avoiding dynamic Python interpreter type-checking and method lookup overhead on every iteration.',
        points: 10,
      },
      {
        id: 'q_py_202',
        text: 'Given a Pandas DataFrame "df" with missing values in column "temperature", which method replaces missing NaN cells with the historical median while maintaining method chaining?',
        options: [
          'df["temperature"].drop_duplicates()',
          'df.assign(temperature=df["temperature"].fillna(df["temperature"].median()))',
          'df["temperature"].replace(0, -999)',
          'df.filter(regex="temperature")',
        ],
        correctOptionIndex: 1,
        explanation:
          'df.assign() enables fluent method chaining by creating or modifying columns in-place or returning a new DataFrame without relying on mutating assignments.',
        points: 10,
      },
      {
        id: 'q_py_203',
        text: 'What is the primary difference between ".loc[]" and ".iloc[]" indexers in a Pandas DataFrame?',
        options: [
          '".loc[]" uses label-based indexing, whereas ".iloc[]" strictly uses integer position-based indexing',
          '".loc[]" works only on columns, while ".iloc[]" works only on rows',
          '".loc[]" operates in parallel, whereas ".iloc[]" is single-threaded',
          'There is no operational difference; they are syntactic aliases',
        ],
        correctOptionIndex: 0,
        explanation:
          '".loc[]" accesses rows and columns by their textual or datetime index labels, while ".iloc[]" references elements strictly by zero-indexed integer positions (0, 1, 2...).',
        points: 10,
      },
      {
        id: 'q_py_204',
        text: 'When grouping a DataFrame by district with "df.groupby("district")", what is the most efficient syntax to compute both the mean rainfall and maximum temperature simultaneously?',
        options: [
          'df.groupby("district").agg({"rainfall": "mean", "temperature": "max"})',
          'df.groupby("district").sum() + df.groupby("district").max()',
          'df.groupby("district").apply(lambda x: [x.mean(), x.max()])',
          'df.groupby("district").transform("mean")',
        ],
        correctOptionIndex: 0,
        explanation:
          'The .agg() method accepting a dictionary of column names to aggregation functions is the idiomatic, optimized approach to calculate heterogeneous aggregates across groups.',
        points: 10,
      },
      {
        id: 'q_py_205',
        text: 'Which Pandas technique should be prioritized when joining two multi-million row datasets on a foreign key to optimize RAM usage?',
        options: [
          'Converting join keys from high-cardinality strings to "category" or 64-bit integer dtypes prior to merge',
          'Exporting both tables to CSV and reading line-by-line using Python file buffers',
          'Duplicating all columns across both DataFrames',
          'Disabling garbage collection with gc.disable()',
        ],
        correctOptionIndex: 0,
        explanation:
          'Converting object string keys into categorical or compact integer data types drastically reduces memory consumption and accelerates hash table lookups during merge/join operations.',
        points: 10,
      },
    ],
  },
  {
    id: 'asm_climate_01',
    courseId: 'crs_climate',
    courseTitle: 'Climate Science Fundamentals',
    moduleId: 'mod_csf_01',
    moduleTitle: 'Planetary Energy Balance & Climate Forcing',
    title: 'Climate Science Fundamentals — Certification Exam',
    description:
      'Assess your grasp of the global planetary energy balance, radiative forcing, oceanic thermohaline circulation, greenhouse gas residence lifetimes, and regional climate vulnerability models.',
    durationMinutes: 20,
    totalMarks: 50,
    passingScorePercent: 70,
    questionsCount: 5,
    status: 'open',
    deadline: '2026-11-01T18:30:00Z',
    instructions: [
      'Complete all 5 conceptual questions.',
      'Passing score is 70% (at least 4 correct).',
      'Calculators are not required.',
      'Detailed rationale and verified references are provided on the result review screen.',
    ],
    questions: [
      {
        id: 'q_csf_301',
        text: 'What is the approximate global average planetary albedo of Earth (the fraction of incoming solar radiation reflected directly back into space)?',
        options: ['Approximately 0.05 (5%)', 'Approximately 0.30 (30%)', 'Approximately 0.65 (65%)', 'Approximately 0.90 (90%)'],
        correctOptionIndex: 1,
        explanation:
          'Earth reflects approximately 30% (albedo ~0.30) of incoming shortwave solar radiation back to space, primarily due to clouds, atmospheric aerosols, snow cover, and reflective surface terrains.',
        points: 10,
      },
      {
        id: 'q_csf_302',
        text: 'Which greenhouse gas has the largest direct contribution to Earth’s natural greenhouse effect in clear-sky conditions?',
        options: ['Methane (CH4)', 'Water Vapor (H2O)', 'Ozone (O3)', 'Nitrous Oxide (N2O)'],
        correctOptionIndex: 1,
        explanation:
          'Water vapor accounts for approximately 50-60% of Earth’s natural greenhouse effect. While CO2 and CH4 are critical drivers of anthropogenic forcing, water vapor acts as the dominant natural radiative feedback.',
        points: 10,
      },
      {
        id: 'q_csf_303',
        text: 'What physical driving mechanism powers the global oceanic Thermohaline Circulation (the "ocean conveyor belt")?',
        options: [
          'Surface wind shear along the equator alone',
          'Density differences driven by water temperature (thermal) and salinity (haline) gradients in polar latitudes',
          'Gravitational tidal pull of the Moon exclusively',
          'Underwater tectonic volcanic vents',
        ],
        correctOptionIndex: 1,
        explanation:
          'Thermohaline circulation is driven by density differences: cold, salty water formed in high-latitude regions (such as the North Atlantic) becomes dense and sinks, driving deep ocean circulation globally.',
        points: 10,
      },
      {
        id: 'q_csf_304',
        text: 'What does the term "Radiative Forcing" quantify in climate science assessments (measured in Watts per square meter, W/m²)?',
        options: [
          'The net change in the Earth-atmosphere energy balance caused by an external perturbation since pre-industrial times',
          'The mechanical pressure exerted by solar wind on the upper ionosphere',
          'The rate of geothermal heat transfer through the continental crust',
          'The total kinetic energy dissipated by tropical cyclones over an annual cycle',
        ],
        correctOptionIndex: 0,
        explanation:
          'Radiative forcing quantifies the net difference between incoming solar radiation absorbed by Earth and outgoing infrared radiation emitted to space, relative to an unperturbed baseline (e.g. 1750).',
        points: 10,
      },
      {
        id: 'q_csf_305',
        text: 'Why does Arctic sea ice loss create a "positive climate feedback loop" (the ice-albedo feedback)?',
        options: [
          'Melting ice releases massive amounts of dissolved helium into the troposphere',
          'Open dark ocean water has a lower albedo (~0.06) than reflective ice (~0.60), absorbing more heat and accelerating further melting',
          'The missing ice lowers atmospheric barometric pressure to vacuum levels',
          'Cold freshwater runoff prevents any cloud formation over the pole',
        ],
        correctOptionIndex: 1,
        explanation:
          'As reflective white sea ice melts, it exposes darker ocean waters that absorb significantly more solar thermal radiation, warming the surface layer and causing even faster ice retreat.',
        points: 10,
      },
    ],
  },
  {
    id: 'asm_01',
    courseId: 'crs_101',
    courseTitle: 'Public Service Digital Governance & Cloud Operations',
    title: 'Mid-Term Evaluation: Cloud Readiness & Architecture',
    description:
      'Assess your institutional knowledge of sovereign cloud security perimeters, multi-tenant public infrastructure, data isolation laws, and citizen service uptime reliability.',
    durationMinutes: 20,
    totalMarks: 50,
    passingScorePercent: 70,
    questionsCount: 5,
    status: 'open',
    deadline: '2026-10-05T18:00:00Z',
    instructions: [
      '5 multiple choice questions aligned with National Digital Governance standards.',
      'Passing score benchmark: 70% (4 of 5 correct).',
      'All answers persist automatically while navigating.',
      'Official attempt transcript is preserved upon submission.',
    ],
    questions: [
      {
        id: 'q_dg_401',
        text: 'In public sector digital governance frameworks, which architecture model best guarantees sovereign data residency and tenant isolation for sensitive citizen registries?',
        options: [
          'Unencrypted public object storage buckets across international regions',
          'Dedicated government cloud enclave with cryptographic boundary isolation and local hardware security modules (HSMs)',
          'Single-tenant on-premise mainframe with no external network connectivity',
          'Peer-to-peer torrent distribution nodes',
        ],
        correctOptionIndex: 1,
        explanation:
          'Dedicated sovereign government cloud enclaves combine the elastic scalability of modern cloud computing with hardware-enforced cryptographic boundaries and strict domestic residency.',
        points: 10,
      },
      {
        id: 'q_dg_402',
        text: 'What does the Principle of Least Privilege (PoLP) dictate for cloud administrative identity and access management (IAM)?',
        options: [
          'All civil servants should have Superadmin credentials to prevent workflow blockers',
          'Identities are granted only the minimum permissions necessary to execute authorized operational tasks for a limited duration',
          'Access controls are enforced exclusively during standard daylight office hours',
          'Passwords must never be changed once established',
        ],
        correctOptionIndex: 1,
        explanation:
          'PoLP mandates that user and service identities only possess the minimal set of privileges required for their specific duty, minimizing blast radius in security events.',
        points: 10,
      },
      {
        id: 'q_dg_403',
        text: 'Under standard Cloud Service Level Agreements (SLAs), what does "Four Nines" (99.99%) availability permit in maximum allowable annual downtime?',
        options: [
          'Approximately 3.65 days per year',
          'Approximately 52.6 minutes per year',
          'Approximately 8.76 hours per year',
          'Zero seconds under all conditions',
        ],
        correctOptionIndex: 1,
        explanation:
          '99.99% availability translates mathematically to less than 52.6 minutes of unscheduled downtime across an entire 365-day operational calendar year.',
        points: 10,
      },
      {
        id: 'q_dg_404',
        text: 'Which design pattern prevents cascading system crashes when a dependent third-party government payment gateway experiences high latency or outages?',
        options: [
          'Continuous rapid retry loops with no delay',
          'Circuit Breaker pattern with graceful fallback degradation',
          'Infinite timeout thresholds on all HTTP clients',
          'Hard rebooting the web servers every five minutes',
        ],
        correctOptionIndex: 1,
        explanation:
          'The Circuit Breaker pattern trips when downstream service failures cross a threshold, quickly rejecting outbound calls or serving cached fallbacks to protect upstream portal responsiveness.',
        points: 10,
      },
      {
        id: 'q_dg_405',
        text: 'What is the primary operational objective of establishing Infrastructure as Code (IaC) with declarative templates (e.g., Terraform/OpenTofu)?',
        options: [
          'To replace human administrators with non-auditable scripts',
          'To create deterministic, version-controlled, and reproducible cloud environments across staging and production',
          'To double cloud billing allocations',
          'To enforce single-server monolith deployments',
        ],
        correctOptionIndex: 1,
        explanation:
          'Declarative IaC allows IT teams to version control, peer review, and reliably reproduce identical cloud infrastructure configurations without human error.',
        points: 10,
      },
    ],
  },
  {
    id: 'asm_02',
    courseId: 'crs_102',
    courseTitle: 'Enterprise Cybersecurity Essentials & Data Protection',
    title: 'Statutory Data Protection & Threat Incident Simulation',
    description:
      'Examine zero trust perimeter defense, cryptographic key rotation, least-privilege role matrices, phishing defense, and statutory incident notification timelines.',
    durationMinutes: 25,
    totalMarks: 50,
    passingScorePercent: 75,
    questionsCount: 5,
    status: 'open',
    deadline: '2026-10-12T18:00:00Z',
    instructions: [
      '5 scenario-based questions on statutory cybersecurity and incident triage.',
      'Passing score: 75% (minimum 4 correct answers).',
      'Once started, answer all questions before submitting.',
      'Audit log recorded upon completion.',
    ],
    questions: [
      {
        id: 'q_cs_501',
        text: 'What core philosophy defines the Zero Trust Architecture (NIST SP 800-207) model in enterprise networks?',
        options: [
          'Any request originating from inside the corporate LAN is implicitly safe',
          '"Never trust, always verify" — every access request is authenticated, authorized, and encrypted regardless of origin',
          'Biometrics alone without passwords are used for all public access',
          'Firewalls are disabled to improve connection throughput',
        ],
        correctOptionIndex: 1,
        explanation:
          'Zero Trust treats all network perimeters as potentially compromised, requiring continuous authentication, authorization, and encryption for every communication session.',
        points: 10,
      },
      {
        id: 'q_cs_502',
        text: 'Which multi-factor authentication (MFA) method provides the strongest cryptographic protection against real-time adversary-in-the-middle (AiTM) phishing attacks?',
        options: [
          'SMS-delivered 6-digit text message OTPs',
          'FIDO2 / WebAuthn hardware security keys with domain-bound public key cryptography',
          'Email verification link codes',
          'Security challenge questions regarding hometown or pets',
        ],
        correctOptionIndex: 1,
        explanation:
          'FIDO2/WebAuthn hardware tokens tie authentication cryptographically to the exact domain origin in the browser URL bar, completely neutralizing proxy phishing relays.',
        points: 10,
      },
      {
        id: 'q_cs_503',
        text: 'Under standard statutory data protection guidelines, within what timeframe must a critical personal data breach be formally reported to national cybersecurity authorities (e.g. CERT)?',
        options: [
          'Within 6 hours of discovery under strict emergency directives (or 72 hours under general statutory regimes)',
          'Within 90 calendar days following internal board meetings',
          'Only after the annual financial year-end audit',
          'Notification is purely optional for public departments',
        ],
        correctOptionIndex: 0,
        explanation:
          'Regulatory directives require initial breach notification within hours (often 6 hours for critical infrastructure, and up to 72 hours under statutory data protection acts) of confirmation.',
        points: 10,
      },
      {
        id: 'q_cs_504',
        text: 'What does "Defense in Depth" signify when architecting an enterprise cybersecurity perimeter?',
        options: [
          'Relying entirely on a single ultra-expensive perimeter firewall',
          'Layering diverse administrative, physical, and technical security controls throughout the entire system stack',
          'Increasing the size of backup hard disk drives',
          'Conducting security audits only once every five years',
        ],
        correctOptionIndex: 1,
        explanation:
          'Defense in Depth prevents single points of failure by layering endpoint protection, network segmentation, encryption, IAM, and intrusion detection across the enterprise.',
        points: 10,
      },
      {
        id: 'q_cs_505',
        text: 'In asymmetric public-key cryptography (e.g., RSA/ECC), which key is used by the recipient to decrypt a confidential message encrypted by the sender?',
        options: [
          'The sender’s public key',
          'The recipient’s private key',
          'A shared symmetric initialization vector',
          'The Certificate Authority’s public master key',
        ],
        correctOptionIndex: 1,
        explanation:
          'The sender encrypts the payload using the recipient’s publicly accessible public key; only the recipient’s confidential private key can mathematically decipher the ciphertext.',
        points: 10,
      },
    ],
  },
  {
    id: 'asm_03',
    courseId: 'crs_103',
    courseTitle: 'Modern Project Management for Public Sector',
    title: 'Comprehensive Final Certification Exam',
    description:
      'Comprehensive final examination on public sector procurement compliance, critical path scheduling, stakeholder alignment matrices, and risk mitigation registers.',
    durationMinutes: 30,
    totalMarks: 50,
    passingScorePercent: 70,
    questionsCount: 5,
    status: 'completed',
    instructions: [
      'Final certification exam covering public sector project management methodologies.',
      'Passing score: 70% (4 of 5 correct).',
      'Questions can be revisited before submission.',
      'Certificate qualification is evaluated upon submission.',
    ],
    questions: [
      {
        id: 'q_pm_601',
        text: 'In project schedule network analysis, what does the "Critical Path" represent?',
        options: [
          'The sequence of activities with the highest financial budget allocation',
          'The longest sequence of dependent activities that determines the shortest possible project completion duration',
          'The list of non-essential discretionary tasks that can be postponed indefinitely',
          'The communication channel between the project manager and senior cabinet ministers',
        ],
        correctOptionIndex: 1,
        explanation:
          'The Critical Path has zero total float (slack); any delay on a critical path activity directly delays the scheduled project completion date.',
        points: 10,
      },
      {
        id: 'q_pm_602',
        text: 'In Earned Value Management (EVM), what does a Cost Performance Index (CPI) of 1.15 indicate regarding fiscal execution?',
        options: [
          'The project is spending 15% more than planned budget',
          'The project is performing efficiently under budget ($1.15 of earned value for every $1.00 spent)',
          'The project is 15 days behind the baseline milestone calendar',
          'The project has exceeded maximum procurement allowances',
        ],
        correctOptionIndex: 1,
        explanation:
          'CPI = EV / AC. A CPI value greater than 1.0 (such as 1.15) indicates superior cost efficiency, delivering 115 cents of tangible project deliverables for every 100 cents expended.',
        points: 10,
      },
      {
        id: 'q_pm_603',
        text: 'What is the primary role of a RACI Matrix in public sector cross-departmental governance?',
        options: [
          'To calculate compound interest on tender security deposits',
          'To delineate clear roles for Responsible, Accountable, Consulted, and Informed stakeholders on deliverables',
          'To replace standard civil service recruitment examinations',
          'To schedule daily automated email spam',
        ],
        correctOptionIndex: 1,
        explanation:
          'A RACI matrix clarifies organizational accountability across complex multi-stakeholder government initiatives, ensuring exactly one individual is Accountable for each deliverable.',
        points: 10,
      },
      {
        id: 'q_pm_604',
        text: 'How does an Agile Sprint Retrospective differ from a traditional post-mortem meeting?',
        options: [
          'Retrospectives occur frequently at the end of each short iteration to implement immediate continuous process improvements',
          'Retrospectives focus exclusively on assigning formal blame and disciplinary action',
          'Retrospectives are attended only by the primary financial sponsor',
          'Retrospectives cannot produce actionable workflow modifications',
        ],
        correctOptionIndex: 0,
        explanation:
          'Agile retrospectives occur cyclically after every sprint, empowering cross-functional teams to identify actionable refinements immediately rather than waiting until project close.',
        points: 10,
      },
      {
        id: 'q_pm_605',
        text: 'In public procurement risk registers, what risk response strategy is exemplified by purchasing third-party performance guarantee insurance?',
        options: ['Risk Avoidance', 'Risk Transference', 'Risk Acceptance', 'Risk Escalation'],
        correctOptionIndex: 1,
        explanation:
          'Risk Transference shifts the financial consequences and ownership of a specific risk to a third party (such as an underwriter or insurance guarantee) without altering risk probability.',
        points: 10,
      },
    ],
  },
];

/**
 * Returns assessment by its unique ID
 */
export function findAssessmentById(id: string): Assessment | undefined {
  return COMPREHENSIVE_ASSESSMENTS.find((a) => a.id === id);
}

/**
 * Returns all assessments associated with a course
 */
export function findAssessmentsByCourseId(courseId: string): Assessment[] {
  return COMPREHENSIVE_ASSESSMENTS.filter((a) => a.courseId === courseId);
}

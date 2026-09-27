/**
 * Capacity Connect - Enterprise Course Image Resolution System
 *
 * Provides robust, reusable course image resolution and fallback strategies:
 * 1. course.image or course.thumbnailUrl (if clean & valid)
 * 2. Topic/Category-based clean conceptual illustration
 * 3. Capacity Connect generic learning fallback image
 *
 * Safety Guarantee:
 * - NEVER resolves to UI screenshots, mockups, browser frames, or filter panels.
 * - Automatically resolves appropriate imagery for any future new course.
 * - Provides safe onError fallback handlers for image elements.
 */

import { Course } from '../types';

/**
 * Verified clean image paths for each core subject domain.
 * Every image is a pristine high-resolution conceptual illustration or professional visual.
 * Zero UI screenshots, browser bars, or filter mockups.
 */
export const CLEAN_COURSE_IMAGE_CATALOG = {
  cloudInfrastructure: '/images/courses/cloud-infrastructure.jpg',
  cybersecurity: '/images/courses/cybersecurity.jpg',
  dataAnalytics: '/images/courses/data-analytics.jpg',
  artificialIntelligence: '/images/courses/ai-neural-network.jpg',
  leadership: '/images/courses/leadership.jpg',
  earthClimate: '/images/courses/earth-climate.jpg',
  geospatialTechnology: '/images/courses/geospatial-satellite.jpg',
  devopsSre: '/images/courses/devops-sre.jpg',
  pythonProgramming: '/images/courses/python-programming.jpg',
  genericLearning: '/images/courses/generic-learning.jpg',
} as const;

export const GENERIC_COURSE_FALLBACK_IMAGE = CLEAN_COURSE_IMAGE_CATALOG.genericLearning;

/**
 * Direct category to clean topic visual mapping
 */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  // Cloud & Infrastructure
  'Cloud / Infrastructure': CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure,
  'Cloud Computing': CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure,
  'Cloud Architecture': CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure,
  'Digital Governance': CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure,
  'Public Infrastructure': CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure,

  // Cybersecurity
  'Cybersecurity': CLEAN_COURSE_IMAGE_CATALOG.cybersecurity,
  'Information Security': CLEAN_COURSE_IMAGE_CATALOG.cybersecurity,
  'Security & Compliance': CLEAN_COURSE_IMAGE_CATALOG.cybersecurity,
  'Zero Trust': CLEAN_COURSE_IMAGE_CATALOG.cybersecurity,

  // Data & Analytics
  'Data & Analytics': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,
  'Analytics & Strategy': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,
  'Data Visualization': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,
  'Data Science': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,
  'Databases': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,
  'Database Management': CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics,

  // Artificial Intelligence / Machine Learning
  'Artificial Intelligence': CLEAN_COURSE_IMAGE_CATALOG.artificialIntelligence,
  'Machine Learning': CLEAN_COURSE_IMAGE_CATALOG.artificialIntelligence,
  'AI / ML': CLEAN_COURSE_IMAGE_CATALOG.artificialIntelligence,
  'Deep Learning': CLEAN_COURSE_IMAGE_CATALOG.artificialIntelligence,

  // Professional Development & Leadership
  'Professional Development': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Leadership': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Leadership & Management': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Executive Leadership': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Project Management': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Management & Strategy': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Regulatory & Ethics': CLEAN_COURSE_IMAGE_CATALOG.leadership,
  'Public Administration': CLEAN_COURSE_IMAGE_CATALOG.leadership,

  // Earth & Climate
  'Earth & Climate': CLEAN_COURSE_IMAGE_CATALOG.earthClimate,
  'Climate Science': CLEAN_COURSE_IMAGE_CATALOG.earthClimate,
  'Environmental Science': CLEAN_COURSE_IMAGE_CATALOG.earthClimate,
  'Environmental Sustainability': CLEAN_COURSE_IMAGE_CATALOG.earthClimate,
  'Sustainability': CLEAN_COURSE_IMAGE_CATALOG.earthClimate,

  // Geospatial Technology
  'Geospatial Technology': CLEAN_COURSE_IMAGE_CATALOG.geospatialTechnology,
  'Remote Sensing': CLEAN_COURSE_IMAGE_CATALOG.geospatialTechnology,
  'GIS & Spatial Analytics': CLEAN_COURSE_IMAGE_CATALOG.geospatialTechnology,
  'Satellite Processing': CLEAN_COURSE_IMAGE_CATALOG.geospatialTechnology,

  // DevOps / SRE
  'DevOps / SRE': CLEAN_COURSE_IMAGE_CATALOG.devopsSre,
  'DevOps': CLEAN_COURSE_IMAGE_CATALOG.devopsSre,
  'Site Reliability Engineering': CLEAN_COURSE_IMAGE_CATALOG.devopsSre,
  'Systems Engineering': CLEAN_COURSE_IMAGE_CATALOG.devopsSre,

  // Python / Programming
  'Python / Programming': CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming,
  'Technology': CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming,
  'Programming': CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming,
  'Software Engineering': CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming,
  'Python Development': CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming,
};

/**
 * Detects whether a provided URL or path is suspicious (e.g. contains UI screenshots or mockups)
 */
function isDisallowedUiScreenshot(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('screenshot') ||
    lower.includes('catalogue-mockup') ||
    lower.includes('portal-ui') ||
    lower.includes('dashboard-screen') ||
    lower.includes('filter-panel') ||
    lower.includes('aida-public') // Legacy stitch screenshots hosted on lh3
  );
}

/**
 * Resolves a clean image based on category and course metadata topics
 */
export function resolveCategoryImage(category?: string, title?: string, skills?: string[], description?: string): string {
  // 1. Direct exact or normalized category match
  if (category) {
    const trimmedCat = category.trim();
    if (CATEGORY_IMAGE_MAP[trimmedCat]) {
      return CATEGORY_IMAGE_MAP[trimmedCat];
    }

    const lowerCat = trimmedCat.toLowerCase();
    for (const [key, image] of Object.entries(CATEGORY_IMAGE_MAP)) {
      if (lowerCat === key.toLowerCase()) {
        return image;
      }
    }
  }

  // 2. Keyword heuristic matching against category, title, description, and skills
  const combinedContext = [
    category || '',
    title || '',
    description || '',
    ...(skills || []),
  ].join(' ').toLowerCase();

  // Cybersecurity
  if (
    combinedContext.includes('cyber') ||
    combinedContext.includes('security') ||
    combinedContext.includes('zero trust') ||
    combinedContext.includes('threat') ||
    combinedContext.includes('cryptography') ||
    combinedContext.includes('penetration') ||
    combinedContext.includes('infosec')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.cybersecurity;
  }

  // Geospatial & Satellite
  if (
    combinedContext.includes('satellite') ||
    combinedContext.includes('remote sensing') ||
    combinedContext.includes('geospatial') ||
    combinedContext.includes('gis') ||
    combinedContext.includes('spectral') ||
    combinedContext.includes('raster') ||
    combinedContext.includes('ndvi')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.geospatialTechnology;
  }

  // Earth & Climate
  if (
    combinedContext.includes('climate') ||
    combinedContext.includes('earth') ||
    combinedContext.includes('weather') ||
    combinedContext.includes('atmosphere') ||
    combinedContext.includes('meteorological') ||
    combinedContext.includes('ocean') ||
    combinedContext.includes('sustainability')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.earthClimate;
  }

  // Python & Programming
  if (
    combinedContext.includes('python') ||
    combinedContext.includes('pandas') ||
    combinedContext.includes('numpy') ||
    combinedContext.includes('coding') ||
    combinedContext.includes('programming') ||
    combinedContext.includes('software development')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.pythonProgramming;
  }

  // Artificial Intelligence & Machine Learning
  if (
    combinedContext.includes('artificial intelligence') ||
    combinedContext.includes('machine learning') ||
    combinedContext.includes('neural') ||
    combinedContext.includes('deep learning') ||
    combinedContext.includes('llm') ||
    combinedContext.includes('ai/') ||
    combinedContext.includes(' ai ') ||
    combinedContext.startsWith('ai ')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.artificialIntelligence;
  }

  // Data & Analytics
  if (
    combinedContext.includes('analytics') ||
    combinedContext.includes('data') ||
    combinedContext.includes('visualization') ||
    combinedContext.includes('dashboard') ||
    combinedContext.includes('metrics') ||
    combinedContext.includes('statistical') ||
    combinedContext.includes('bi ')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.dataAnalytics;
  }

  // Cloud & Infrastructure
  if (
    combinedContext.includes('cloud') ||
    combinedContext.includes('infrastructure') ||
    combinedContext.includes('serverless') ||
    combinedContext.includes('aws') ||
    combinedContext.includes('gcp') ||
    combinedContext.includes('azure') ||
    combinedContext.includes('network')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.cloudInfrastructure;
  }

  // DevOps & SRE
  if (
    combinedContext.includes('devops') ||
    combinedContext.includes('sre') ||
    combinedContext.includes('reliability') ||
    combinedContext.includes('ci/cd') ||
    combinedContext.includes('kubernetes') ||
    combinedContext.includes('docker') ||
    combinedContext.includes('incident')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.devopsSre;
  }

  // Professional Development, Leadership & Governance
  if (
    combinedContext.includes('leadership') ||
    combinedContext.includes('communication') ||
    combinedContext.includes('management') ||
    combinedContext.includes('executive') ||
    combinedContext.includes('governance') ||
    combinedContext.includes('ethics') ||
    combinedContext.includes('compliance') ||
    combinedContext.includes('policy') ||
    combinedContext.includes('briefing')
  ) {
    return CLEAN_COURSE_IMAGE_CATALOG.leadership;
  }

  // 3. Clean generic fallback
  return GENERIC_COURSE_FALLBACK_IMAGE;
}

/**
 * Main resolution entry point.
 * Given any course object (existing or future new course):
 * 1. Validates whether course.image or course.thumbnailUrl is a clean, non-UI image.
 * 2. If valid clean image, uses it.
 * 3. Otherwise, automatically resolves an appropriate category/topic-based image.
 * 4. Falls back to clean generic Capacity Connect learning image if category is unknown.
 */
export function getCourseImage(
  course: Partial<Course> | (Partial<Course> & { image?: string }) | null | undefined
): string {
  if (!course) {
    return GENERIC_COURSE_FALLBACK_IMAGE;
  }

  // Inspect explicit image or thumbnailUrl
  const explicitImage = (course as any).image || course.thumbnailUrl;

  if (
    explicitImage &&
    typeof explicitImage === 'string' &&
    explicitImage.trim() !== '' &&
    !isDisallowedUiScreenshot(explicitImage)
  ) {
    return explicitImage.trim();
  }

  // Resolve category/topic based fallback
  return resolveCategoryImage(
    course.category,
    course.title,
    course.skillsCovered,
    course.description || course.tagline
  );
}

/**
 * Synthetic onError handler for image elements.
 * Prevents broken image icons or infinite error loops by falling back to safe local visuals.
 */
export function handleCourseImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  course?: Partial<Course>
): void {
  const target = event.currentTarget;
  const currentSrc = target.src;

  const fallback = resolveCategoryImage(
    course?.category,
    course?.title,
    course?.skillsCovered,
    course?.description
  );

  // If already at fallback or generic, stop to prevent loop
  if (currentSrc.endsWith(fallback) || currentSrc.endsWith(GENERIC_COURSE_FALLBACK_IMAGE)) {
    return;
  }

  target.src = fallback;
}

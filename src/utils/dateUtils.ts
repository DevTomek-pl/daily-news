import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Enable the customParseFormat plugin for dayjs
dayjs.extend(customParseFormat);

/**
 * Parse the date string using the configured date format
 * @param rawDate The raw date string from the article
 * @param dateFormat Optional format string for date parsing
 * @param sourceName Source name for better error messages
 * @returns ISO formatted date string
 */
export const parseDate = (rawDate: string, dateFormat?: string, sourceName = 'Unknown source'): string => {
  // Default to current date if parsing fails
  if (!rawDate) {
    return new Date().toISOString();
  }

  try {
    const cleanDate = rawDate.trim();
    
    // If a specific date format is specified
    if (dateFormat) {
      return parseDateWithFormat(cleanDate, dateFormat, sourceName);
    } 
    
    // Try standard date parsing if no format specified
    return parseDateStandard(cleanDate, sourceName);
  } catch (err) {
    console.warn(`Failed to parse date for ${sourceName}: "${rawDate}"`, err);
    return new Date().toISOString();
  }
};

/**
 * Parse a date string with a specific format
 */
export const parseDateWithFormat = (dateString: string, format: string, sourceName: string): string => {
  // Handle special case for Polish dates with 'r.' suffix
  if (format.includes("'r.'")) {
    return parsePolishDate(dateString, format, sourceName);
  }
  
  // Standard format parsing
  const parsedDate = dayjs(dateString, format);
  
  if (parsedDate.isValid()) {
    return parsedDate.toISOString();
  }
  
  console.warn(`Invalid date for ${sourceName}: "${dateString}" with format "${format}"`);
  return new Date().toISOString();
};

/**
 * Parse Polish date format with 'r.' suffix
 */
export const parsePolishDate = (dateString: string, format: string, sourceName: string): string => {
  // Remove the 'r.' suffix from the date string
  const processedDate = dateString.replace(' r.', '');
  // Remove the 'r.' suffix from the format
  const processedFormat = format.replace(" 'r.'", "");
  
  const parsedDate = dayjs(processedDate, processedFormat);
  
  if (parsedDate.isValid()) {
    return parsedDate.toISOString();
  }
  
  console.warn(`Invalid Polish date for ${sourceName}: "${dateString}" with format "${format}"`);
  return new Date().toISOString();
};

/**
 * Parse a date string using standard JavaScript Date
 */
export const parseDateStandard = (dateString: string, sourceName: string): string => {
  const standardDate = new Date(dateString);
  
  if (!isNaN(standardDate.getTime())) {
    return standardDate.toISOString();
  }
  
  console.warn(`Invalid standard date for ${sourceName}: "${dateString}"`);
  return new Date().toISOString();
};

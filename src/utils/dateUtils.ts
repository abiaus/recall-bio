/**
 * Gets the local YYYY-MM-DD string for a specific timezone.
 * Falls back to UTC if timezone is invalid or undefined.
 */
export function getLocalDateString(timezone?: string | null, date?: Date): string {
  const d = date || new Date();
  
  if (!timezone) {
    return d.toISOString().split("T")[0];
  }

  try {
    // We use Intl.DateTimeFormat to reliably parse the date components in the target timezone
    const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' natively outputs YYYY-MM-DD
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // formatter.format(d) returns "YYYY-MM-DD" for 'en-CA'
    return formatter.format(d);
  } catch (error) {
    // Fallback if timezone string is invalid (e.g. recognized by IANA)
    console.warn(`Invalid timezone provided: ${timezone}, falling back to UTC`);
    return d.toISOString().split("T")[0];
  }
}

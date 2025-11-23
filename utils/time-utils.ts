// utils/time-utils.ts
export const getRelativeTime = (timestamp: string | Date): string => {
  try {
    let date: Date;
    
    // Handle different timestamp formats
    if (typeof timestamp === 'string') {
      // ✅ CRITICAL FIX: If timestamp doesn't have timezone info, force UTC interpretation
      if (!timestamp.endsWith('Z') && 
          !timestamp.includes('+') && 
          !timestamp.match(/-\d{2}:\d{2}$/)) {
        // Add 'Z' to force UTC parsing
        date = new Date(timestamp + 'Z');
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    const now = new Date();
    
    // Validate the date
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return 'Unknown time';
    }
    
    // Calculate difference in milliseconds
    const diffInMs = now.getTime() - date.getTime();
    
    // If timestamp is in the future (allow small grace period for clock skew)
    if (diffInMs < -60000) { // 1 minute grace period
      console.warn('Timestamp is in the future:', {
        input: timestamp,
        parsed: date.toISOString(),
        now: now.toISOString(),
        diff: diffInMs
      });
      return 'Just now';
    }
    
    const diffInSeconds = Math.abs(Math.floor(diffInMs / 1000));
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 10) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks === 1) return '1 week ago';
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    if (diffInMonths === 1) return '1 month ago';
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    if (diffInYears === 1) return '1 year ago';
    return `${diffInYears} years ago`;
    
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return 'Unknown time';
  }
};

export const formatLocalDateTime = (timestamp: string | Date): string => {
  try {
    let date: Date;
    
    // Same fix for date formatting
    if (typeof timestamp === 'string') {
      if (!timestamp.endsWith('Z') && 
          !timestamp.includes('+') && 
          !timestamp.match(/-\d{2}:\d{2}$/)) {
        date = new Date(timestamp + 'Z');
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(date);
  } catch (error) {
    console.error('Error formatting local date time:', error);
    return 'Invalid date';
  }
};
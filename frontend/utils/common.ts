/**
 * Converts a timestamp into a human-readable relative time string.
 *
 * @param {string} timestamp - The timestamp to convert in format 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} A human-readable string representing the relative time
 * @throws {Error} If the timestamp is invalid
 */
export const formattedDate = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Convert to different units
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    // Return appropriate format based on time difference
    if (diffInSeconds < 60) {
        return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
    } else if (minutes < 60) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days < 30) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
}

/**
 * Converts a timestamp into a human-readable relative time string.
 *
 * @returns {string} A human-readable string representing the relative time
 * @throws {Error} If the timestamp is invalid
 */
export const priceFormat = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

/**
 * Capitalize the parsing string
 * @param str
 */
export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

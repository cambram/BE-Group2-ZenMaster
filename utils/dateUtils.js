// utils/dateUtils.js

// Helper function to check if two dates are in the same week
const isWithinSameWeek = (date1, date2) => {
    const startOfWeek1 = getStartOfWeek(date1);
    const startOfWeek2 = getStartOfWeek(date2);
    return startOfWeek1.getTime() === startOfWeek2.getTime();
};

// Helper function to get the start of the week for a given date
const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay();  // 0 is Sunday, 6 is Saturday
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);  // Adjust if Sunday
    return new Date(date.setDate(diff));
};

// Helper function to check if an array of dates are consecutive
const isConsecutiveDays = (dates) => {
    dates.sort((a, b) => a - b); // Sort dates in ascending order
    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currentDate = new Date(dates[i]);

        // Check if current date is exactly one day after the previous date
        const isConsecutive =
            currentDate.getDate() === prevDate.getDate() + 1 &&
            currentDate.getMonth() === prevDate.getMonth() &&
            currentDate.getFullYear() === prevDate.getFullYear();

        // If not consecutive, return false
        if (!isConsecutive) return false;
    }
    return true;
};

module.exports = {
    isWithinSameWeek,
    isConsecutiveDays
};

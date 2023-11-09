const User = require('../model/User');

// Function to record a user view event
const recordViewEvent = async (user) => {
    const today = new Date();
    const monthYear = today.toISOString().slice(0, 7); // Get the YYYY-MM format
    const day = today.toISOString().slice(0, 10); // Get the YYYY-MM-DD format

    const dayName = today.toLocaleString('en-US', { weekday: 'long' }); // Get the full day name
    const monthName = today.toLocaleString('en-US', { month: 'long' }); // Get the full month name

    // Update the dailyCounts array with the current date
    const dailyCount = user.dailyCounts.find((item) => item.date.toISOString().slice(0, 10) === day);
    if (dailyCount) {
        dailyCount.count += 1;
    } else {
        user.dailyCounts.push({ date: today, count: 1, dayName });
    }

    // Update the monthlyCounts array with the current month
    const monthlyCount = user.monthlyCounts.find((item) => item.date.toISOString().slice(0, 7) === monthYear);
    if (monthlyCount) {
        monthlyCount.count += 1;
    } else {
        user.monthlyCounts.push({ date: today, count: 1, monthName });
    }

    await user.save();
};

// Function to aggregate daily view count data with day names
const aggregateDailyViewCountWithNames = async (user) => {
    const today = new Date();
    const day = today.toISOString().slice(0, 10); // Get the YYYY-MM-DD format

    const dailyCount = await user.dailyCounts.find((item) => item.date.toISOString().slice(0, 10) === day);
    
    const dayName = today.toLocaleString('en-US', { weekday: 'long' }); // Get the full day name

    return {
        [dayName]: dailyCount ? dailyCount.count : 0,
    };
};

// Function to aggregate monthly view count data with month names
const aggregateMonthlyViewCountWithNames = async (user) => {
    const today = new Date();
    const monthYear = today.toISOString().slice(0, 7); // Get the YYYY-MM format

    const monthlyCount = await user.monthlyCounts.find((item) => item.date.toISOString().slice(0, 7) === monthYear);
    
    const monthName = today.toLocaleString('en-US', { month: 'long' }); // Get the full month name

    return {
        [monthName]: monthlyCount ? monthlyCount.count : 0,
    };
};



// // Utility function to record a user view event
// const recordViewEvent = async (user) => {

//     user.viewCount += 1;
//     user.viewEvents.push({ timestamp: new Date() });
//     await user.save();
  
// }
// // Utility function to aggregate daily view count data with day names
// const aggregateDailyViewCountWithNames = async () => {
//   const users = await User.find();
//   const dailyCounts = {};

//   // Define an array of day names
//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   users.forEach((user) => {
//     user.viewEvents.forEach((event) => {
//       const dayOfWeek = event.timestamp.getDay();
//       const dayName = dayNames[dayOfWeek]; // Map the numeric day to its name
//       dailyCounts[dayName] = (dailyCounts[dayName] || 0) + 1;
//     });
//   });

//   return dailyCounts;
// }

// // Utility function to aggregate monthly view count data with month names
// const aggregateMonthlyViewCountWithNames = async () => {
//   const users = await User.find();
//   const monthlyCounts = {};

//   // Define an array of month names
//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   users.forEach((user) => {
//     user.viewEvents.forEach((event) => {
//       const month = event.timestamp.getMonth();
//       const monthName = monthNames[month]; // Map the numeric month to its name
//       monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
//     });
//   });

//   return monthlyCounts;
// }

module.exports = {
  recordViewEvent,
  aggregateDailyViewCountWithNames,
  aggregateMonthlyViewCountWithNames,
}


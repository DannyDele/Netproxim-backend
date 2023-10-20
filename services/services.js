const User = require('../model/User');

// Utility function to record a user view event
const recordViewEvent = async (user) => {

    user.viewCount += 1;
    user.viewEvents.push({ timestamp: new Date() });
    await user.save();
  
}

// Utility function to aggregate daily view count data
const aggregateDailyViewCount = async () => {
  const users = await User.find();
  const dailyCounts = {};

  users.forEach((user) => {
    user.viewEvents.forEach((event) => {
      const dayOfWeek = event.timestamp.getDay();
      dailyCounts[dayOfWeek] = (dailyCounts[dayOfWeek] || 0) + 1;
    });
  });

  return dailyCounts;
}

// Utility function to aggregate monthly view count data
const aggregateMonthlyViewCount = async () => {
  const users = await User.find();
  const monthlyCounts = {};

  users.forEach((user) => {
    user.viewEvents.forEach((event) => {
      const month = event.timestamp.getMonth();
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
  });

  return monthlyCounts;
}

module.exports = {
  recordViewEvent,
  aggregateDailyViewCount,
  aggregateMonthlyViewCount,
}

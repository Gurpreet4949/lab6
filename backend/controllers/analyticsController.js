const Analytics = require("../model/analyticsModel");
const ButtonClick = require("../model/buttonClickModel");

// Middleware to track endpoint hits
const trackAnalytics = async (req, res, next) => {
  const endpoint = req.path;
  const timestamp = new Date();
  try {
    // Find the document for the current endpoint or create a new one
    let analytics = await Analytics.findOne({ endpoint });
    if (!analytics) {
      analytics = new Analytics({ endpoint, timestamps: [timestamp] });
    }

    // Update hit count and timestamps
    analytics.hits += 2; // Incrementing by 2 instead of 1
    analytics.timestamps.push(timestamp);

    // Save the updated analytics
    await analytics.save();

    // Log the analytics
    console.log(`Endpoint: ${endpoint} - was hit at ${timestamp} ${analytics.hits} times`);
    next();
  } catch (error) {
    console.error("Error tracking analytics:", error);
    res.status(500).json({ error: "Error tracking analytics" });
  }
};

// Controller to get analytics data
const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await Analytics.find();
    const buttonClicks = await ButtonClick.find().sort({ timestamp: -1 }).limit(50);
    
    // Calculate total hits across all endpoints
    const totalHits = analyticsData.reduce((sum, item) => sum + item.hits, 0);
    
    // Get the most recent username from button clicks if available
    const latestClick = await ButtonClick.findOne().sort({ timestamp: -1 });
    const username = latestClick?.username || 'Guest User';
    
    // Format visits for timeline
    const visits = [];
    analyticsData.forEach(endpoint => {
      endpoint.timestamps.forEach(timestamp => {
        visits.push({
          endpoint: endpoint.endpoint,
          timestamp
        });
      });
    });
    
    // Sort visits by timestamp (most recent first)
    visits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Count button clicks by buttonId
    const buttonClickCounts = {};
    buttonClicks.forEach(click => {
      const id = click.buttonId;
      buttonClickCounts[id] = (buttonClickCounts[id] || 0) + 1;
    });
    
    // Format response for dashboard
    const dashboardData = {
      username,
      totalHits,
      visits: visits.slice(0, 20), // Limit to most recent 20 visits
      buttonClicks: buttonClickCounts
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ error: "Error fetching analytics data" });
  }
};

// Track button clicks
const trackButtonClick = async (req, res) => {
  try {
    const { buttonId, username } = req.body;
    const timestamp = new Date();
    const userId = req.headers['user-id'] || 'anonymous'; // Assuming user ID is passed in headers
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const buttonClick = new ButtonClick({
      buttonId,
      timestamp,
      userId,
      username, // Adding username field from request body
      userAgent,
      ipAddress
    });

    await buttonClick.save();
    res.status(200).json({ message: "Button click tracked successfully" });
  } catch (error) {
    console.error("Error tracking button click:", error);
    res.status(500).json({ error: "Error tracking button click" });
  }
};

// Get button click analytics
const getButtonClickAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, buttonId } = req.query;
    let query = {};

    if (buttonId) {
      query.buttonId = buttonId;
    }

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const buttonClicks = await ButtonClick.find(query).sort({ timestamp: -1 });
    res.json(buttonClicks);
  } catch (error) {
    console.error("Error fetching button click analytics:", error);
    res.status(500).json({ error: "Error fetching button click analytics" });
  }
};

module.exports = { trackAnalytics, getAnalytics, trackButtonClick, getButtonClickAnalytics };

const express = require("express");
const axios = require("axios");
const path = require("path");
const router = express.Router();
const { trackAnalytics, getAnalytics } = require("../controllers/analyticsController");

const GA_MEASUREMENT_URL = "https://www.google-analytics.com/mp/collect";

const GA_TRACKING_ID = `G-X88GZMQWEW`;
const API_SECRET = "bUALF7H2QXyWYNt_7ti0eg";

// Send event to Google Analytics via Measurement Protocol
const sendToGoogleAnalytics = async (eventName, params = {}) => {
  try {
    const clientId = Math.random().toString(36).substring(2); // Generate random client ID

    const payload = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          ...params,
          engagement_time_msec: "100"
        }
      }]
    };

    const url = `${GA_MEASUREMENT_URL}?measurement_id=${GA_TRACKING_ID}&api_secret=${API_SECRET}`;
    const response = await axios.post(url, payload);
    console.log('Event sent to Google Analytics', {
      status: response.status,
      payload: payload
    });
  } catch (error) {
    console.error('Error sending event to Google Analytics:', {
      message: error.message,
      response: error.response?.data,
      payload: payload
    });
  }
};

// Track analytics for page visits and log Google Analytics events
router.get('/hello', trackAnalytics, async (req, res) => {
  // Google Analytics event
  await sendToGoogleAnalytics('page_view', '/hello');

  res.send("This is Analytics App");
});

router.get("/about", trackAnalytics, async (req, res) => {
  // Google Analytics event
  await sendToGoogleAnalytics("page_view", "/about");

  res.sendFile(path.join(__dirname, "../about.html"));
});

// Route to view analytics data from MongoDB
router.get('/analytics', getAnalytics);
module.exports = router;

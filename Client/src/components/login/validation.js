import * as yup from "yup";

export function userNameValidation(user) {
  const schema = yup.object().shape({
    user: yup
      .string()
      .required("Please enter a user name")
      .min(4, "minimum 4 characters")
      .max(20, "Please enter no more than 20 characters")
  });
  try {
    schema.validateSync({ user });
    return true;
  } catch (err) {
    return err;
  }
}

export function roomNameValidation(roomName) {
  const schema = yup.object().shape({
    roomName: yup.string().max(30, "max 30 characters")
  });
  try {
    schema.validateSync({ roomName });
    return true;
  } catch (err) {
    return err;
  }
}

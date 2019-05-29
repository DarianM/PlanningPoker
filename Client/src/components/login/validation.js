import * as yup from "yup";

export function userNameValidation(user) {
  const schema = yup.object().shape({
    user: yup
      .string()
      .required("Please enter a user name")
      .min(4, "minimum 4 characters")
      .max(10, "Please enter no more than 10 characters")
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
    roomName: yup.string().max(10, "max 10 characters")
  });
  try {
    schema.validateSync({ roomName });
    return true;
  } catch (err) {
    return err;
  }
}

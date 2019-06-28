import * as yup from "yup";

export function userNameValidation(user) {
  const schema = yup.object().shape({
    user: yup
      .string()
      .required("Please enter a user name")
      .matches(/^\s*(\S\s*){3,20}$/, {
        message: "Please insert between 3-20 characters"
      })
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
    roomName: yup.string().matches(/^\s*(\S\s*){5,30}$/, {
      message: "Please insert between 5-30 characters",
      excludeEmptyString: true
    })
  });
  try {
    schema.validateSync({ roomName });
    return true;
  } catch (err) {
    return err;
  }
}

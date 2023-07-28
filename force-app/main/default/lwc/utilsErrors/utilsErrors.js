/**
 * @description       : Error Utilities
 * @author            : samuel@pipelaunch.com
 * @group             : Utilities
 * @last modified on  : 2023-02-02
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-01-05   samuel@pipelaunch.com   Initial Version
 **/

// @ts-check

/**
 * @description generate the content of the toast message with the errors
 * produced by the lightning-record-form
 * @param {object} e the error object produced by the lightning-record-form
 * @returns {object} sample {message: "x", title: "y"}
 */
export function generateToastErrorMessageContent(e) {
  const title = e.message ?? "An error occurred. Please try again.";
  const genericErrors = e.output?.errors ?? [];
  const fieldErrors = e.output?.fieldErrors?.Name ?? [];
  const errorMessages = [];
  [...fieldErrors, ...genericErrors].map((item) => {
    errorMessages.push(item.message);
  });
  const message = errorMessages.join("; ");

  return { title, message };
}

/**
 * @description Reduces one or more LDS errors into a string[] of error messages.
 * @author https://github.com/trailheadapps/lwc-recipes/blob/07f0b85799b6343a1b1d66a10bcaa6de8cac5291/force-app/main/default/lwc/ldsUtils/ldsUtils.js
 * @param {Error|Error[]|FetchResponse|FetchResponse[]} errors
 * @return {String[]} Error messages
 */
export function reduceErrors(errors) {
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  return (
    errors
      // Remove null/undefined items
      .filter((error) => !!error)
      // Extract an error message
      .map((error) => {
        // UI API read errors
        if (Array.isArray(error.body)) {
          return error.body.map((e) => e.message);
        }
        // Page level errors
        else if (error?.body?.pageErrors && error.body.pageErrors.length > 0) {
          return error.body.pageErrors.map((e) => e.message);
        }
        // Field level errors
        else if (
          error?.body?.fieldErrors &&
          Object.keys(error.body.fieldErrors).length > 0
        ) {
          const fieldErrors = [];
          Object.values(error.body.fieldErrors).forEach((errorArray) => {
            fieldErrors.push(...errorArray.map((e) => e.message));
          });
          return fieldErrors;
        }
        // UI API DML page level errors
        else if (
          error?.body?.output?.errors &&
          error.body.output.errors.length > 0
        ) {
          return error.body.output.errors.map((e) => e.message);
        }
        // UI API DML field level errors
        else if (
          error?.body?.output?.fieldErrors &&
          Object.keys(error.body.output.fieldErrors).length > 0
        ) {
          const fieldErrors = [];
          Object.values(error.body.output.fieldErrors).forEach((errorArray) => {
            fieldErrors.push(...errorArray.map((e) => e.message));
          });
          return fieldErrors;
        }
        // UI API DML, Apex and network errors
        else if (error.body && typeof error.body.message === "string") {
          return error.body.message;
        }
        // JS errors
        else if (typeof error.message === "string") {
          return error.message;
        }
        // Unknown error shape so try HTTP status text
        return error.statusText;
      })
      // Flatten
      .reduce((prev, curr) => prev.concat(curr), [])
      // Remove empty strings
      .filter((message) => !!message)
  );
}

/**
 * @description get error exception type name
 * @param {*} errors
 * @returns {String}
 */
export function getErrorExceptionType(errors) {
  if (!errors || errors.length === 0) return null;

  if (!Object.prototype.hasOwnProperty.call(errors, "body")) return null;

  if (
    Object.prototype.hasOwnProperty.call(errors.body, "message") &&
    Array.isArray(errors.body.message)
  ) {
    if (
      errors.body.message.length === 0 ||
      !Object.prototype.hasOwnProperty.call(
        errors.body.message[0],
        "exceptionType"
      )
    )
      return null;

    return errors.body.message[0].exceptionType.toString();
  }

  if (!Object.prototype.hasOwnProperty.call(errors.body, "exceptionType"))
    return null;
  return errors.body.exceptionType.toString();
}

/**
 * @description Reduce errors and outputs in string format separated by ;
 * @param {Error|Error[]} errors
 * @returns {String} List of errors
 */
export function reduceErrorsString(errors) {
  const errorsArray = reduceErrors(errors);
  return errorsArray.join("; ");
}
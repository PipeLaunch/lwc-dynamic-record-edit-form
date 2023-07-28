/**
 * @description       : Toast utilities
 * @author            : samuel@pipelaunch.com
 * @group             : Utilities
 * @last modified on  : 2023-02-03
 * @last modified by  : samuel@pipelaunch.com
 * Modifications Log
 * Ver   Date         Author                  Modification
 * 1.0   2023-01-10   samuel@pipelaunch.com   Initial Version
 *                                            Change error toast parameters
 **/
// @ts-check2
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { reduceErrorsString } from "c/utilsErrors";

/**
 * @description Display toasts to provide feedback to a user following an action, such as after a record is created
 * @param {Object}          options options
 * @param {String}          options.title (Required) The title of the toast, displayed as a heading
 * @param {String}          options.message (Required) A string representing the body of the message. It can contain placeholders in the form of {0} ... {N}. The placeholders are replaced with the links on messageData.
 * @param {String[]|Object} options.messageData url and label values that replace the {index} placeholders in the message string.
 * @param {String}          options.variant  info (default), success, warning, and error
 * @param {String}          options.mode dismissible (default) Determines how persistent the toast is.
 *                          Valid values are: dismissible (default), remains visible until you click the
 *                          close button or 3 seconds has elapsed, whichever comes first; pester, remains
 *                          visible for 3 seconds and disappears automatically. No close button is provided;
 *                          sticky, remains visible until you click the close button.
 */
export function toast({
  title = "",
  message = "",
  variant = "info",
  messageData = null,
  mode = "dismissible"
}) {
  try {
    if (!title && !message) {
      title = "Untitled";
    }
    document.body.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant,
        messageData,
        mode
      })
    );
  } catch (err) {
    // fail silently
    console.error("Cannot display toast message", err);
  }
}

/**
 * @description Display error toast with the following default options: variant error, mode dismissible
 * @param {String} title (Required) The title of the toast, displayed as a heading
 * @param {Error|Error[]|FetchResponse|FetchResponse[]} error (Required) Error message
 */
export function errorToast(title = "Unexpected Error", error) {
  console.error(title, error); // print also error to console

  try {
    const message = reduceErrorsString(error);

    document.body.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant: "error"
      })
    );
  } catch (err) {
    // fail silently
    console.error("Cannot display error toast message", err);
  }
}
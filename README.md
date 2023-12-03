# LWC Dynamic Record Edit Form (Alpha)

![sample](sample.png "sample")

## About

Generic LWC component to output a record creation form with all exposed fields. It uses native lightning-record-edit-form

## Features

-   Integrated on a single component (easy to copy to multiple projects)
-   No Apex code
-   Multi-language/translations support
-   Record type selection/support
-   Respects object layout

## Notes

## Limitations

-   No record type description (only name)

## Instructions

### Use on your project

Everything was developed in a single LWC, so you just need a new single component on your project.

-   Copy the following files to your project:
    -   force-app/main/default/lwc/lwcDynamicRecordEditForm/\*\*
-   Call the component and pass the options

```
<c-lwc-dynamic-record-edit-form object-api-name="Contact"></c-lwc-dynamic-record-edit-form>
```

### Testing and learn how to use it

-   Run the `createorg.sh` to create a scratch org
-   Open the `Sample` lightning app
-   Explore the code on the `samples` component
-   Edit the page to preview on mobile devices or login with your mobile device (check the `password.env` file)

## Properties

| Property Name            | Required | Description                                                                                                 | Sample Value                                                                                  |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| debug                    | No       | true to see debug messages in the console.                                                                  | false                                                                                         |
| objectApiName            | Yes      | The API name of the object.                                                                                 | "Account"                                                                                     |
| values                   | No       | Default values to be applied.                                                                               | `{ objectApiName: { value: "default value", hidden: true, required: true, disabled: true } }` |
| density                  | No       | Sets the arrangement style of fields and labels in the form.                                                | "auto"                                                                                        |
| formClass                | No       | A CSS class for the form element.                                                                           | "slds-var-m-top_small"                                                                        |
| recordTypeId             | No       | The ID of the record type, which is required if you created multiple record types but don't have a default. | "012000000000000AAA"                                                                          |
| propagateEvents          | No       | Propagate events up with bubble and composed to use when the component is nested.                           | false                                                                                         |
| disableRecordTypeSupport | No       | Disable the record type selection.                                                                          | false                                                                                         |
| hideLoadingRecordForm    | No       | Hide the loading stencil for the record form.                                                               | false                                                                                         |
| fieldsToIgnore           | No       | Array of then fields API name to ignore.                                                                    | ["Field1__c", "Field2__c"]                                                                    |
| fieldsToShow             | No       | Array of then fields API name to show/include even if they are not part of the visible layout.              | ["Field3__c", "Email"]                                                                        |
| accordion                | No       | Show collapsible accordion.                                                                                 | false                                                                                         |
| footerStyle              | No       | Style for the footer.                                                                                       | "modal" or "footer"                                                                           |
| recordTypeFooterClasses  | No       | Custom classes for the footer on the record type selection view.                                            | "slds-var-m-top_small"                                                                        |
| recordFormFooterClasses  | No       | Custom classes for the footer on the record edit form view.                                                 | "slds-var-m-top_small"                                                                        |
| showFooter               | No       | Show the footer with native buttons.                                                                        | false                                                                                         |
| labels                   | No       | An object with the labels for the component.                                                                | `{ CANCEL: "Cancel" }`                                                                        |

## References

https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation

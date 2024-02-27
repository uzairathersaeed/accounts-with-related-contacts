import { LightningElement, api, wire } from "lwc";
import getRelatedContacts from "@salesforce/apex/accountAndItsRelatedContacts.getRelatedContacts";
import createContact from "@salesforce/apex/accountAndItsRelatedContacts.createContact";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";

const columnsData = [
  {
    label: "Contact Name",
    fieldName: "Name"
  },
  {
    label: "Email",
    fieldName: "Email"
  },
  {
    label: "Phone",
    fieldName: "Phone"
  },
  {
    label: "Lead Source",
    fieldName: "LeadSource"
  }
];

export default class ContactRelatedToAccount extends LightningElement {
  @api recordId; // for current record Id
  @api accountName;
  result;
  error;
  columns = columnsData;
  isLoading = true;
  isModalOpen = false;
  firstName;
  lastName;
  email;
  phone;
  leadSource;
  wiredResult;
  fields = ["Name", "Phone", "Email", "LeadSource", "AccountId"];

  showModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  fetchingRelatedContacts = false;

  @wire(getRelatedContacts, { accId: "$recordId" })
  getWiredContacts(result) {
    this.wiredResult = result;
    if (result.data) {
      console.log("data", result.data);
      this.result = result.data;
      this.error = undefined;
      this.isLoading = false;
    } else if (result.error) {
      this.result = undefined;
      this.error = result.error;
    }
  }

  handleFirstNameChange(event) {
    this.firstName = event.target.value;
  }

  handleLastNameChange(event) {
    this.lastName = event.target.value;
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  handlePhoneChange(event) {
    this.phone = event.target.value;
  }

  handleLeadSourceChange(event) {
    this.leadSource = event.target.value;
  }

  createContact() {
    const accountId = this.recordId;

    createContact({
      accountId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      leadSource: this.leadSource
    })
      .then(() => {
        this.closeModal();
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Contact created successfully",
            variant: "success"
          })
        );
        this.resetForm();

        return refreshApex(this.wiredResult);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }

  resetForm() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.phone = "";
    this.leadSource = "";
  }
}

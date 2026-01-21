import { LightningElement,wire,api,track } from 'lwc';
import getSuggestions from '@salesforce/apex/AutoComplete.getaddresses';
import getInternationalAdressText from '@salesforce/apex/AutoComplete.getInternationalAdressText';
import getInternationaladdresses from '@salesforce/apex/AutoComplete.getInternationaladdresses';
import getInternationalCompleteaddresses from '@salesforce/apex/AutoComplete.getInternationalCompleteaddresses';
export default class AutoCompleteGlobal extends LightningElement {
    @api searchRecords = [];
    @api required = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track street;
    @track city;
    @track state;
    @track zip;
    @track isDataAvailable = false;
    @track autocompleteEntries = false;
    @track search;
    @track searchtext;
    @track country;
    @track interNationalAddresList = [];
    @track interNationalAddresSecondStepList = [];
    @track isInternational = false;

    @track stopSubmit = false;
    @track showSpinner = false
    @track index;
    @track countryName;
    @track searchInfo = {};

    handleCountryChange(event) {
        this.country = event.target.value;
    }

    searchField(event) {
        this.isDataAvailable = false;
         var currentText = event.target.value;
        if(this.country && this.country!='' && this.country!=undefined && this.country!='undefined'){
            currentText = currentText+';'+this.country;
        }
        else{
            this.country = 'US';
            currentText = currentText+';US';
        }
        if(this.country!='US'){
            this.interNationalAddresList = [];
            this.interNationalAddresSecondStepList = [];

            getInternationalAdressText({ Parameters: currentText })
                .then(result => {
                    console.log('******* THE API CALLED');

                    this.interNationalAddresList = result || [];
                    this.isInternational = true;

                    if (this.interNationalAddresList.length > 0) {
                        this.index = event?.target?.dataset?.index;
                        this.toggleDropdown(true);
                        this.stopSubmit = true;
                        this.isDataAvailable = true;
                    } else {
                        this.toggleDropdown(false);
                        this.stopSubmit = false;
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else{
           
            this.LoadingText = true;
            this.isInternational = false;
            getSuggestions({Parameters:currentText})
            .then(result => {
                this.searchRecords= result;
                this.LoadingText = false;
                this.isDataAvailable = true;
                this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                if(currentText.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                }
                else {
                    this.messageFlag = false;
                }

                if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                    this.iconFlag = false;
                    this.clearIconFlag = true;
                }
                else {
                    this.iconFlag = true;
                    this.clearIconFlag = false;
                }
            })
            .catch(error => {
                console.log('-------error-------------'+error);
            });
        }
    }
    

    useSuggestion(event){
        let suggestionId=event.target.id;
        //GET EXACT INDEX FROM ID
        if(suggestionId.includes('-')){
            suggestionId=suggestionId.substring(0,suggestionId.indexOf('-'));
        }
        var singleAddress = this.searchRecords[suggestionId];
         if(singleAddress.isSelect){
            this.autocompleteEntries = true;
            this.search = singleAddress.search;
            this.searchtext = singleAddress.selected;
            return;
         }
        
        this.street = singleAddress.street_line;
        this.city = singleAddress.city;
        this.state = singleAddress.state;
        this.zip = singleAddress.zipcode;
        this.isDataAvailable = false;
        this.suggestions=[];
    }

    getSelected(event) {
        const singleAddress = event.detail.theAddress;
        this.street = singleAddress.street_line;
        this.city = singleAddress.city;
        this.state = singleAddress.state;
        this.zip = singleAddress.zipcode;
        this.isDataAvailable = false;
        this.suggestions=[];
        this.autocompleteEntries = false;
        this.search = undefined;
        this.searchtext = undefined;
    }
    closeSelection() {
        this.autocompleteEntries = false;
        this.search = undefined;
        this.searchtext = undefined;
        this.isDataAvailable = false;
        this.suggestions=[];
    }

    /* ==============================
       SECOND STEP – PARTIAL ADDRESS
       ============================== */
    finalAddressSuggestions(event) {

    const index = event.currentTarget.dataset.index;
    const selected = this.interNationalAddresList[index];
    if (!selected) return;

    const addressID = selected.address_id;
    const entries = selected.entries;

    if (entries && entries > 1) {
        this.showSpinner = true;

        getInternationaladdresses({
            addressId1: addressID,
            countryName: this.country
        })
            .then(result => {
                this.interNationalAddresList = [];
                this.interNationalAddresSecondStepList = result || [];
                this.toggleDropdown(this.interNationalAddresSecondStepList.length > 0);
                this.stopSubmit = this.interNationalAddresSecondStepList.length > 0;
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                this.showSpinner = false;
            });

    } else {
        this.getAddressDetails(addressID);
        this.isDataAvailable = false;
    }
}


    /* ==============================
       FINAL STEP – COMPLETE ADDRESS
       ============================== */
   finalCompleteAddressSuggestions(event) {
        const index = event.currentTarget.dataset.index;
        const selected = this.interNationalAddresSecondStepList[index];
        if (selected) {
            this.getAddressDetails(selected.address_id);
        }
    }


    toggleDropdown(show) {
        const dropdown = this.template.querySelector('.street-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('acshow', show);
            dropdown.classList.toggle('achide', !show);
        }
    }

getAddressDetails(addressID) {
    const index = this.index;
    const country = this.country;

    if (!addressID) return;

    this.showSpinner = true;

    getInternationalCompleteaddresses({
        addressId1: addressID,
        countryName: country
    })
        .then(result => {
            console.log('******* THE API CALLED');

            if (result && result.length > 0) {
                const singleAddress = result[0];
                // clear second step suggestions
                this.interNationalAddresSecondStepList = [];

                /* ==============================
                   SET INPUT VALUES (LWC WAY)
                   ============================== */
                this.street = singleAddress.street;
                this.city = singleAddress.locality;
                this.state = singleAddress.administrative_area;
                this.zip = singleAddress.postal_code;

                // hide dropdown
                this.toggleDropdown(false);
                this.stopSubmit = false;
                this.isDataAvailable = false;
            }
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            this.showSpinner = false;
        });
}
}

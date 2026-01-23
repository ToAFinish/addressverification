import { LightningElement, api, track } from 'lwc';

import getSuggestions from '@salesforce/apex/smartystreets.AutoComplete.getaddresses';
import getAutocompleteEntries from '@salesforce/apex/smartystreets.AutoComplete.getAutocompleteEntries';
import getInternationalAdressText from '@salesforce/apex/smartystreets.AutoComplete.getInternationalAdressText';
import getInternationaladdresses from '@salesforce/apex/smartystreets.AutoComplete.getInternationaladdresses';
import getInternationalCompleteaddresses from '@salesforce/apex/smartystreets.AutoComplete.getInternationalCompleteaddresses';

export default class AutoCompleteGlobalMerge extends LightningElement {

    @track street;
    @track city;
    @track state;
    @track zip;
    @track country;

    @track searchRecords = [];
    @track modalSuggestions = [];

    @track interNationalAddresList = [];
    @track interNationalAddresSecondStepList = [];

    @track isInternational = false;
    @track isDataAvailable = false;
    @track autocompleteEntries = false;
    @track showSpinner = false;

    search;
    searchtext;
    index;
    get resolvedCountry() {
        return (this.country && this.country.trim())
            ? this.country.trim()
            : 'US';
    }
    handleCountryChange(event) {
        this.country = event.target.value;
    }

    searchField(event) {
        const value = event.target.value;
        this.street = value;
        this.isDataAvailable = false;

        if (!value || value.length < 3) return;

        const params = value + ';' + this.resolvedCountry;

        if (this.resolvedCountry !== 'US') {
            this.isInternational = true;
            this.interNationalAddresList = [];
            this.interNationalAddresSecondStepList = [];

            getInternationalAdressText({ Parameters: params })
                .then(result => {
                    this.interNationalAddresList = result || [];
                    this.isDataAvailable = this.interNationalAddresList.length > 0;
                })
                .catch(console.error);
        } else {
            this.isInternational = false;
            this.country = this.resolvedCountry;
            getSuggestions({ Parameters: params })
                .then(result => {
                    this.searchRecords = result;
                    this.isDataAvailable = result.length > 0;
                })
                .catch(console.error);
        }
    }

    useSuggestion(event) {
        const index = event.currentTarget.dataset.index;
        const selected = this.searchRecords[index];

        if (selected.isSelect) {
            this.openModal(selected.search, selected.selected);
            return;
        }

        this.setAddress(selected);
    }

    openModal(search, selected) {
        this.search = search;
        this.searchtext = selected;
        this.autocompleteEntries = true;

        getAutocompleteEntries({ prefix: search, selected: selected })
            .then(result => {
                this.modalSuggestions = result;
            })
            .catch(console.error);
    }

    rowSelected(event) {
        const index = event.currentTarget.dataset.index;
        this.setAddress(this.modalSuggestions[index]);
        this.closeModal();
    }

    closeModal() {
        this.autocompleteEntries = false;
        this.modalSuggestions = [];
    }

    finalAddressSuggestions(event) {
        const index = event.currentTarget.dataset.index;
        const selected = this.interNationalAddresList[index];

        if (selected.entries > 1) {
            this.showSpinner = true;
            getInternationaladdresses({
                addressId1: selected.address_id,
                countryName: this.resolvedCountry
            })
                .then(result => {
                    this.interNationalAddresList = [];
                    this.interNationalAddresSecondStepList = result || [];
                })
                .finally(() => this.showSpinner = false);
        } else {
            this.getAddressDetails(selected.address_id);
        }
    }

    finalCompleteAddressSuggestions(event) {
        const index = event.currentTarget.dataset.index;
        this.getAddressDetails(this.interNationalAddresSecondStepList[index].address_id);
    }

    getAddressDetails(addressID) {
        this.showSpinner = true;
        getInternationalCompleteaddresses({
            addressId1: addressID,
            countryName: this.resolvedCountry
        })
            .then(result => {
                const addr = result[0];
                this.street = addr.street;
                this.city = addr.locality;
                this.state = addr.administrative_area;
                this.zip = addr.postal_code;
                this.isDataAvailable = false;
            })
            .finally(() => this.showSpinner = false);
    }

    setAddress(addr) {
        this.street = addr.street_line;
        this.city = addr.city;
        this.state = addr.state;
        this.zip = addr.zipcode;
        this.isDataAvailable = false;
    }

}

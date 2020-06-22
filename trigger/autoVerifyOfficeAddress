/*
    THIS TRIGGER AUTOMATES THE VERIFICATION OF AN ADDRESS
    ON A CUSTOM OBJECT (OFFICE__C)
*/
trigger autoVerifyOfficeAddress on Office__c (before insert, before update, after insert, after update) {
    new smartystreets.AutoVerificationServices().HandleAutoVerify('Office__c');
}

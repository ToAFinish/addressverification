/*
    THIS TRIGGER AUTOMATES THE VERIFICATION OF AN ADDRESS, EMAIL OR PHONE
    ON A CUSTOM OBJECT (OFFICE__C)
    COMMENT OUT THE VERIFICATIONS YOU DO NOT NEED
*/
trigger verifyTrigger on Office__c (before insert, before update, after insert, after update) {
    new smartystreets.AutoVerificationServices().HandleAutoVerify('Office__c'); // for PHYSICAL ADDRESSES
    //new smartystreets.AutoVerificationServicesEmails().HandleAutoVerify('Office__c'); // for EMAIL ADDRESSES
    //new smartystreets.AutoVerificationServicesPhone().HandleAutoVerify('Office__c'); // for PHONE NUMBERS
}

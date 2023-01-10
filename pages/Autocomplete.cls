global with sharing class OfficeAutocompleteExt {

public Id recId;
public smartystreets__Office__c offc{get;set;}
public smartystreets__Office__c oldOff;
public List<sObject> sObjList;
global String authId{get;set;}
global String token{get;set;}
global String key{get;set;}

    global OfficeAutocompleteExt(ApexPages.StandardController controller) {
        
        recId = controller.getRecord().Id;
        if(recId<>null){
            offc = queryRec();
        } else {
            offc = new smartystreets__Office__c();
        }
        sObjList = new List<sObject>();
        
        smartystreets__SmartySettings__c SSettings = smartystreets__SmartySettings__c.getValues('Active');
     
        if(SSettings.smartystreets__auth_id__c != NULL && SSettings.smartystreets__auth_token__c != NULL) {
            authId = EncodingUtil.urlEncode(SSettings.smartystreets__auth_id__c, 'UTF-8');
            token = EncodingUtil.urlEncode(SSettings.smartystreets__auth_token__c, 'UTF-8');
            if(SSettings.smartystreets__Key__c != NULL){
                key = EncodingUtil.urlEncode(SSettings.smartystreets__Key__c, 'UTF-8');
            }
        }

    }
    
    global void saveOffcRec(){
        if(recId==null){
           try{
               insert offc;
               recId = offc.id;
           } catch(Exception e){
               ApexPages.addMessages(e);
           }
       }
    }
    
    
    global pageReference saveRec(){

        if(recId<>null){
            oldOff = queryRec();
        } else {
           oldOff = new smartystreets__Office__c();
        }
        smartystreets__Office__c newOff = new smartystreets__Office__c();
        newOff = offc;
        newOff.id = recId;
        system.debug('OIldLd: '+oldOff);
        
        // Verify Address only if it has been changed or wasn't verified before  
        if(oldOff.smartystreets__Address_Verified__c==false){
            system.debug('IF:');
            newOff.smartystreets__Address_Verified__c = false;
            newOff.smartystreets__Do_Not_Verify__c = false;
            sObjList.add(newOff);
            callVerifyAddress(recId,sObjList,oldOff);
        } 
        else if(((newOff.smartystreets__Street__c!=oldOff.smartystreets__Street__c) || (newOff.smartystreets__City__c!=oldOff.smartystreets__City__c) || (newOff.smartystreets__State__c!=oldOff.smartystreets__State__c)) && (oldOff.smartystreets__Address_Verified__c==true)){
            system.debug('ELSE:');
            newOff.smartystreets__Address_Verified__c = false;
            newOff.smartystreets__Do_Not_Verify__c = false;
            sObjList.add(newOff);
            callVerifyAddress(recId,sObjList,oldOff);
        } else {
            upsert offc;
        }
                
        PageReference pg = new pageReference('/'+recId);
        pg.setRedirect(true);
        return pg;

    }
    
    public static void callVerifyAddress(Id OffcId,List<sObject> ObjList, smartystreets__Office__c oLead){
        system.debug('oOffc '+oLead);
        pageReference pv;
        system.debug('ObjList: '+ObjList);
        String recId = OffcId;
        smartystreets.AddressUpdateService.VerifyAddress('smartystreets__Office__c',recId,ObjList); 
    }
    
    public smartystreets__Office__c queryRec(){
        Set < String > fieldSet = new Set < String > ();
        // GET THE ADDRESS FIELD NAMES
        smartystreets__SmartySSA__c s = smartystreets__SmartySSA__c.getValues('smartystreets__Office__c');
        if(s!=null){
            If(s.smartystreets__Street__c != NULL && s.smartystreets__Street__c.trim() != '') {
                fieldSet.add(s.smartystreets__Street__c);
            }
            If(s.smartystreets__City__c != NULL && s.smartystreets__City__c.trim() != '') {
                fieldSet.add(s.smartystreets__City__c);
            }
            If(s.smartystreets__State__c != NULL && s.smartystreets__State__c.trim() != '') {
                fieldSet.add(s.smartystreets__State__c);
            }
            If(s.smartystreets__Zip_Code__c != NULL && s.smartystreets__Zip_Code__c.trim() != '') {
                fieldSet.add(s.smartystreets__Zip_Code__c);
            }
            If(s.smartystreets__Country__c != NULL && s.smartystreets__Country__c.trim() != '') {
               fieldSet.add(s.smartystreets__Country__c);
            }
            If(s.smartystreets__Street2__c != NULL && s.smartystreets__Street2__c.trim() != '') {
                fieldSet.add(s.smartystreets__Street2__c);
            }
            If(s.smartystreets__County__c != NULL && s.smartystreets__County__c.trim() != '') {
                fieldSet.add(s.smartystreets__County__c);
            }
            If(s.smartystreets__County_FIPs_Code__c != NULL && s.smartystreets__County_FIPs_Code__c.trim() != '') {
                fieldSet.add(s.smartystreets__County_FIPs_Code__c);
            }
            If(s.smartystreets__Barcode__c != NULL && s.smartystreets__Barcode__c.trim() != '') {
                fieldSet.add(s.smartystreets__Barcode__c);
            }
            If(s.smartystreets__Urbanization__c != NULL && s.smartystreets__Urbanization__c.trim() != '') {
                fieldSet.add(s.smartystreets__Urbanization__c);
            }
            If(s.smartystreets__Unit__c != NULL && s.smartystreets__Unit__c.trim() != '') {
                fieldSet.add(s.smartystreets__Unit__c);
            }
            If(s.smartystreets__Return_Code__c != NULL && s.smartystreets__Return_Code__c.trim() != '') {
                fieldSet.add(s.smartystreets__Return_Code__c);
            }
            If(s.smartystreets__Footnotes__c != NULL && s.smartystreets__Footnotes__c.trim() != '') {
               fieldSet.add(s.smartystreets__Footnotes__c);
            }
            If(s.smartystreets__Verified__c != NULL && s.smartystreets__Verified__c.trim() != '') {
               fieldSet.add(s.smartystreets__Verified__c);
            }
            If(s.smartystreets__Last_Verified__c != NULL && s.smartystreets__Last_Verified__c.trim() != '') {
               fieldSet.add(s.smartystreets__Last_Verified__c);
            }
            If(s.smartystreets__Latitude__c != NULL && s.smartystreets__Latitude__c.trim() != '') {
                fieldSet.add(s.smartystreets__Latitude__c);
            }
            If(s.smartystreets__Longitude__c != NULL && s.smartystreets__Longitude__c.trim() != '') {
                fieldSet.add(s.smartystreets__Longitude__c);
            }
            If(s.smartystreets__RDI__c != NULL && s.smartystreets__RDI__c.trim() != '') {
                fieldSet.add(s.smartystreets__RDI__c);
            }
            If(s.smartystreets__Do_Not_Verify__c != NULL && s.smartystreets__Do_Not_Verify__c.trim() != '') {
                fieldSet.add(s.smartystreets__Do_Not_Verify__c);
            }
            If(s.smartystreets__Record_Type__c != NULL && s.smartystreets__Record_Type__c.trim() != '') {
                fieldSet.add(s.smartystreets__Record_Type__c);
            }
            If(s.smartystreets__Carrier_Route__c != NULL && s.smartystreets__Carrier_Route__c.trim() != '') {
                fieldSet.add(s.smartystreets__Carrier_Route__c);
            }
            If(s.smartystreets__Congressional_District__c != NULL && s.smartystreets__Congressional_District__c.trim() != '') {
                fieldSet.add(s.smartystreets__Congressional_District__c);
            }
            If(s.smartystreets__Time_Zone__c != NULL && s.smartystreets__Time_Zone__c.trim() != '') {
                fieldSet.add(s.smartystreets__Time_Zone__c);
            }
            If(s.smartystreets__DST__c != NULL && s.smartystreets__DST__c.trim() != '') {
                fieldSet.add(s.smartystreets__DST__c);
            }
            If(s.smartystreets__Is_Vacant__c != NULL && s.smartystreets__Is_Vacant__c.trim() != '') {
               fieldSet.add(s.smartystreets__Is_Vacant__c);
            }
            If(s.smartystreets__Is_Active__c != NULL && s.smartystreets__Is_Active__c.trim() != '') {
                fieldSet.add(s.smartystreets__Is_Active__c);
            }
            
            If(s.smartystreets__Organization__c != NULL && s.smartystreets__Organization__c.trim() != '') {
                fieldSet.add(s.smartystreets__Organization__c);
            }
            If(s.smartystreets__Premise__c != NULL && s.smartystreets__Premise__c.trim() != '') {
                fieldSet.add(s.smartystreets__Premise__c);
            }
            If(s.smartystreets__Premise_Extra__c != NULL && s.smartystreets__Premise_Extra__c.trim() != '') {
               fieldSet.add(s.smartystreets__Premise_Extra__c);
            }
            If(s.smartystreets__Sub_Building_Number__c != NULL && s.smartystreets__Sub_Building_Number__c.trim() != '') {
               fieldSet.add(s.smartystreets__Sub_Building_Number__c);
            }
            If(s.smartystreets__Sub_Building_Number__c != NULL && s.smartystreets__Sub_Building_Type__c.trim() != '') {
                fieldSet.add(s.smartystreets__Sub_Building_Type__c);
            }
            If(s.smartystreets__super_administrative_area__c != NULL && s.smartystreets__super_administrative_area__c.trim() != '') {
                fieldSet.add(s.smartystreets__super_administrative_area__c);
            }
            If(s.smartystreets__Thoroughfare_Name__c != NULL && s.smartystreets__Thoroughfare_Name__c.trim() != '') {
                fieldSet.add(s.smartystreets__Thoroughfare_Name__c);
            }
            If(s.smartystreets__Geocode_Precision__c != NULL && s.smartystreets__Geocode_Precision__c.trim() != '') {
                fieldSet.add(s.smartystreets__Geocode_Precision__c);
            }
            If(s.smartystreets__Administrative_Area__c != NULL && s.smartystreets__Administrative_Area__c.trim() != '') {
               fieldSet.add(s.smartystreets__Administrative_Area__c);
            }
            If(s.smartystreets__Address_Precision__c != NULL && s.smartystreets__Address_Precision__c.trim() != '') {
                fieldSet.add(s.smartystreets__Administrative_Area__c);
            }
            If(s.smartystreets__Verification_Used__c!= NULL && s.smartystreets__Verification_Used__c.trim() != '') {
                fieldSet.add(s.smartystreets__Verification_Used__c);
            }
        }
        // end

        String sQuerySets ='';
        
        // creating soql query
        if(fieldSet.size()>0 && !fieldSet.isEmpty()){
            for(String field:fieldSet){
                    if(field != null && field != '')
                        sQuerySets =sQuerySets == ''? field: sQuerySets+','+field;
            }
        }
        String sQuery = '';
        if(String.isNotEmpty(sQuerySets))
            sQuery = 'Select ' + sQuerySets + ', Name, Id ' + 'From smartystreets__Office__c where Id=\''+recId+'\'';
         else
             sQuery = 'Select Name, Id ' + 'From smartystreets__Office__c where Id=\''+recId+'\'';
        
        smartystreets__Office__c led = Database.query(sQuery);
        return led;
    }
}

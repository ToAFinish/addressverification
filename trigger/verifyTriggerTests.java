@isTest
public class verifyTriggerTests{

/*

  THIS IS JUST A SAMPLE TEST CLASS WITH MINIMUM CODE

*/

  static testMethod void myUnitTest(){

        Office__c office = new Office__c();
        office.State__c = 'TX';
        insert office;

        System.assertEquals('TX',office.State__c);
    }
}

({
    helperMethod : function(component, event, helper) {
        
        //THIS IS THE METHOD WHICH IS USED TO GET ADDRESS FIELDS FROM SERVER
        //IF NO ADDRESS AVAIBLE IN SETTING ERROR 2 WILL SHOW
        console.log('helper call');
        var sobjectName=component.get("v.sobjectName");
        var recordType=component.get("v.recordTypeId");
        console.log('sobjectName '+sobjectName)
        var action = component.get("c.getallsobjectAddressesnew");
        console.log(action);
        action.setParams({
            "sSearchTable": sobjectName,
            "RecordType": recordType,
            "accountId" : '',
            "isCallFromParent": false
        });
        
        action.setCallback(this, function(response) {
            console.log('response.getState() '+response.getState());
            if (response.getState() == "SUCCESS") {              
                component.set('v.sObjaddresses',response.getReturnValue());                
                  console.log('******Before'+JSON.stringify( component.get('v.sObjaddresses')));
                if(response.getReturnValue().length==0){
                   // component.set('v.Error2','false'); // changed false by VG from true to false
                }
                else{
                    var addresses=component.get('v.sObjaddresses');
                    var noOfaddress=0;
                    var isDoNoCheck=true;
                    
                    for(var i=0;i<addresses.length;i++){
                        var oneRow=addresses[i].oneRow;
                        console.log(oneRow);
                        //console.log('addresses[i].isDoNotCheckForAddress '+addresses[i].isDoNotCheckForAddress);
                         for(var j=0;j<oneRow.length;j++){
                          //  console.log('oneRow[j].isDoNotCheckForAddress '+oneRow[j].isDoNotCheckForAddress); 
                            if(!oneRow[j].isDoNotCheckForAddress==true)
                                isDoNoCheck=false;
                              //  component.set("v.DoNotCheckForAddress",true);
                         }
                        noOfaddress+=oneRow.length;
                    }
                    component.set('v.TotalAddress',noOfaddress);
                }
            }
            else if (response.getState()  === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);        
    },
    
       addSuggestions:function (component, event, helper){
            
        //THIS IS TO SHOW SUGGESTION WHEN USER TYPE IN ADDRESS STREET FIELD
        //THIS CALLS API SUGGEST OF SMARTYSTREETS
        
        var currentIndex=parseInt((event.target.id).replace('s',''));
        
        var allAddresses=component.get('v.sObjaddresses');
        var totaladdress=component.get("v.TotalAddress");
      
        for(var l=0;l<allAddresses.length;l++){
            var oneRow=allAddresses[l].oneRow;
            for(var j=0;j<oneRow.length;j++){
                if(oneRow[j].Index!=currentIndex){
                     document.getElementById('street'+oneRow[j].Index).style.display='none';
                }
            }
        }
        var country=document.getElementById('country'+currentIndex).value;
        console.log('****** country'+country);
        if(country==undefined || country=='' ||
           (country!=undefined && (country.toLowerCase()=='usa') 
           || country.toLowerCase().trim()=='united states'
           || country.toLowerCase().trim()=='united states of america'
           || country.toLowerCase().trim()=='us' )
        ){
            var addValue=event.target.value;       
            if(addValue!=''){
                var action = component.get("c.getaddresses");
                action.setParams({
                    "prefix": addValue
                });
                var opts = [];
                action.setCallback(this, function(response) {
                    if (response.getState() == "SUCCESS") {
                        var allValues = response.getReturnValue();
                        console.log(allValues);
                        component.set('v.addresses',response.getReturnValue());
                        if (allValues != undefined && allValues.length>0) {
                            component.set('v.index',(event.target.id).replace('s',''));
                            document.getElementById('street'+(event.target.id).replace('s','')).style.display='';
                        } 
                        else{
                            document.getElementById('street'+(event.target.id).replace('s','')).style.display='none';
                        }                    
                    }
                });
                $A.enqueueAction(action);
            }else{
                document.getElementById('street'+(event.target.id).replace('s','')).style.display='none';
                var allValues=[];
                component.set('v.addresses',allValues); 
                       
                    for(var l=0;l<allAddresses.length;l++){
                        var oneRow=allAddresses[l].oneRow;
                        for(var j=0;j<oneRow.length;j++){
                            if(oneRow[j].Index==currentIndex){
                                oneRow[j].updateVerified=false;
                            }
                        }
                    }
            }
        }else{
            document.getElementById('street'+(event.target.id).replace('s','')).style.display='none';
            var allValues=[];
            component.set('v.addresses',allValues);     
        }
    },
    hideAutoSuggestion : function(index1) {
        if(document.getElementById('street'+index1)!=null)
            document.getElementById('street'+index1).style.display='none'
    },
})

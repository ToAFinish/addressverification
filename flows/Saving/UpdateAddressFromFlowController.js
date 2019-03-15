({
    handleNavigate: function(cmp, event) {      
        if(event.getParam("action")=='FINISH'){
            cmp.set("v.DoneProcess","true");
        }else{
        var navigate = cmp.get("v.navigateFlow");
        navigate(event.getParam("action"));    
        }
    },
    doInit : function(component, event, helper) {      
      //  helper.objectName(component);      
        var action = component.get("c.getallAddressRowWise");
        action.setParams({ recordId : component.get("v.recordId") });
      
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                            
                component.set("v.sObjaddresses", response.getReturnValue()); 
                console.log(JSON.stringify(response.getReturnValue()));
                if(response.getReturnValue().length==0){
                     component.set('v.Error2','True');
                }else{
                    var addresses=component.get('v.sObjaddresses');
                    var noOfaddress=0;                  
                    for(var i=0;i<addresses.length;i++){
                        var oneRow=addresses[i].oneRow; 
                        noOfaddress+=oneRow.length;
                    }
                    component.set('v.TotalAddress',noOfaddress);
                }
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
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
    callSuggestion: function(component, event, helper){
         var index=component.get('v.index');
         var addresses=component.get('v.addresses');
         document.getElementById('city'+index).value=addresses[event.target.id].city;
         document.getElementById('state'+index).value=addresses[event.target.id].state;
         document.getElementById('s'+index).value=addresses[event.target.id].street_line;
         document.getElementById('street'+index).style.display='none';     
         var allValues=[];
         component.set('v.addresses',allValues);        
    },
    address: function(component, event, helper){
        helper.addSuggestions(component, event, helper);
    },
    handleVerify: function(component, event, helper){
        
        component.set('v.doingProcess','true');
        var verifiedIndex=component.get('v.verifiedindex');
        
        if(verifiedIndex==null || verifiedIndex==''){
            component.set('v.verifiedindex','0');
            verifiedIndex='0';
        }   
        var noOfaddress=component.get('v.TotalAddress');
        // THIS METHOD WILL RUN FOR ONCE AND THEN WILL BE STOPPED 
        
        if(verifiedIndex<noOfaddress){  
            helper.getpostal(component,event,helper);         
        }else{
            // THIS WILL NOT RUN EVER
            console.log('before else ran');
            $A.enqueueAction(component.get('c.reverify'));
        }      
    },
    reverify:function(component,event,helper){          
         component.set('v.doingProcess','true');
        // THIS WILL RUN FOR SECOND ADDERSS OR REVERIY THE ADDRESS             
        var index= component.get("v.verifiedindex");
        var noOfaddress=component.get('v.TotalAddress');
        var close='true';       
       
        if(index<noOfaddress){             
            helper.getpostal(component,event,helper); 
            close='false';
        }   
        if((parseInt(index)==noOfaddress-1 || parseInt(index)==noOfaddress) && close=='true'){
            
            document.getElementById("ErrorboxMain").style.display='none';
            helper.saveAddressAfterSucess(component,event,helper);
        } 
	},	
    goback:function(component,event,helper){ 
         component.set('v.doingProcess','false');
         document.getElementById("ErrorboxMain").style.display='none';
    },
    asitis:function(component,event,helper){ 
        component.set('v.doingProcess','false');
        // THIS WILL CHECK AND RESUBMIT WITH REVERIFY METHOD      
        var verifiedIndex=component.get('v.verifiedindex');
        var noOfaddress=component.get('v.TotalAddress');
        verifiedIndex=parseInt(verifiedIndex)+1;
        component.set('v.verifiedindex',verifiedIndex);
        
       // TO SKIP ADDRESSES WHICH ARE SET TO OFF FROM SETTING ON BAD ADDRESS
        /**
        var theOffIndexes= component.get("v.offAddressVerification");
        var isFound='false';
        for(var k=0;k<theOffIndexes.length;k++){
            if(verifiedIndex==theOffIndexes[k]){
                document.getElementById("usi").style.display='none';
                isFound='true';
            }
        }
        if(isFound=='false'){
            document.getElementById("usi").style.display='';
        }
         **/
        
        if(verifiedIndex<noOfaddress){
            helper.getpostal(component,event,helper);
        }else{                     
            document.getElementById('verifyagain').click();
        }
    },
    finalVerify:function(component,event,helper){   
      
        var action = component.get("c.getverified");
        action.setParams({ recordid : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                            
               component.set('v.readyToMove','true');
               component.set('v.doingProcess','false');
            }          
            else if (state === "ERROR") {
              component.set('v.doingProcess','false');
            }
        });
        $A.enqueueAction(action);
    }
    
})

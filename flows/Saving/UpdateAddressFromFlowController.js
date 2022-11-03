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
    
    closeselection: function(component, event, helper) {
        component.set("v.autocompleteEntries",false);
        component.set("v.search",undefined);
        component.set("v.searchtext",undefined);
        var index=component.get('v.index'); 
        var dropdownDiv=document.getElementById('streetDropdown');
        dropdownDiv.classList.remove("acshow");
        dropdownDiv.classList.add("achide");
    },
    
    getselected : function(component, event, helper) {
        let addresse=event.getParam('theAddress');
        console.log(JSON.stringify(addresse));
        component.set("v.autocompleteEntries",false);
        component.set("v.search",undefined);
        component.set("v.searchtext",undefined);
        var index=component.get('v.index');    
        //SET THE FIELD VALUES FROM THE SELECTED OPTION    
        document.getElementById('city'+index).value=addresse.city;
        document.getElementById('state'+index).value=addresse.state;
        document.getElementById('s'+index).value=addresse.street_line;
        document.getElementById('zip'+index).value=addresse.zipcode;
        
        //HIDE THE DROPDOWN OPTION AFTER SELECTED
        //document.getElementById('street'+index).style.display='none';
        var dropdownDiv=document.getElementById('streetDropdown');
        dropdownDiv.classList.remove("acshow");
        dropdownDiv.classList.add("achide");
        component.set("v.stopSubmit",false);
        
        //CLEAR THE ADDRESS OPTINS 
        var allValues=[];
        component.set('v.addresses',allValues);  
        
        //CHECK IF DO NOT VERIFY IS ENABLED,THE PAID AUTOCOMPLETE IS USED
        var doNotVerify=component.get("v.doNotVerify");       
        if(doNotVerify==true){
            //GET ALL THE ADDRESSES
            var allAddresses=component.get('v.sObjaddresses');
            for(var l=0;l<allAddresses.length;l++){
                var oneRow=allAddresses[l].oneRow;
                for(var j=0;j<oneRow.length;j++){
                    //IF CURRENT ADDRESS INDEX IS MATCH WITH ADDRESS OBJECT
                    if(oneRow[j].Index==index){
                        //UPDATE THE VARIABLE SO THAT NO NEED TO VERIFY OR CHECK LATER
                        oneRow[j].updateVerified=true;
                    }
                }
            }
            console.log('******** PAID SUGGESTION SELECTED ');
            console.log(JSON.stringify(allAddresses));
        }
	},
    
    callSuggestion: function(component, event, helper){
        console.log('in call suggestion');
        //GET ALL THE ADDRESSES
        var addresses=component.get('v.addresses');
        
        var index = component.get('v.index');
        var country= document.getElementById('country'+index).value;
        console.log('country JS '+country);        	
        console.log('INDEX'+index);
        
        console.log('addresses[event.target.id].isSelect '+addresses[event.target.id].isSelect);
        console.log('addresses[event.target.id].search '+addresses[event.target.id].search);
        console.log('addresses[event.target.id].selected '+addresses[event.target.id].selected);
        
        //CHECK IF ADDRESS HAVE ENTRIES TO SELECT
        if(addresses[event.target.id].isSelect){
            //SHOW MORE OPTION
            component.set("v.autocompleteEntries",true);
            component.set("v.search",addresses[event.target.id].search);
            component.set("v.searchtext",addresses[event.target.id].selected);
            return;
        }
        
        //SET THE FIELD VALUES FROM THE SELECTED OPTION   
        if(country==undefined || country=='' || (country!=undefined && (country.toLowerCase()=='usa') || country.toLowerCase().trim()=='united states' 
           || country.toLowerCase().trim()=='united states of america' || country.toLowerCase().trim()=='us'))
        {   
            console.log('street '+addresses[event.target.id].street_line);
            console.log('city '+addresses[event.target.id].city);
            console.log('state '+addresses[event.target.id].state);
            console.log('zipcode '+addresses[event.target.id].zipcode);
            document.getElementById('s'+index).value=addresses[event.target.id].street_line;
            document.getElementById('city'+index).value=addresses[event.target.id].city;
            document.getElementById('state'+index).value=addresses[event.target.id].state;
            document.getElementById('zip'+index).value=addresses[event.target.id].zipcode;
            document.getElementById('country'+index).value='USA';
        }else{
            console.log('inside ELSE');
            document.getElementById('s'+index).value=addresses[event.target.id].street;	
            document.getElementById('city'+index).value=addresses[event.target.id].locality;
            document.getElementById('state'+index).value=addresses[event.target.id].administrative_area;
            document.getElementById('zip'+index).value=addresses[event.target.id].postal_code;
        }
        
        //HIDE THE DROPDOWN OPTION AFTER SELECTED
        var dropdownDiv=document.getElementById('streetDropdown');
        dropdownDiv.classList.remove("acshow");
        dropdownDiv.classList.add("achide");
        
        //CLEAR THE ADDRESS OPTINS 
        var allValues=[];
        component.set('v.addresses',allValues);
    },
    
    address: function(component, event, helper){
        console.log('**** inside Address JS');
        
        if (event.keyCode === 13) {
            event.preventDefault(); 
            var liIndex=component.get("v.liIndex");
            if(liIndex!=undefined &&  document.getElementById(liIndex)!=undefined){
                document.getElementById(liIndex).click();
            }
        }else{
            var searchInfo =component.get('v.searchInfo');
            console.log(JSON.stringify(searchInfo));
            if(searchInfo!=undefined){
                var timeId=searchInfo.timeId;
                var text=searchInfo.text;
                var addValue=event.target.value; 

                if(addValue==text || (addValue!=undefined && text!=undefined && addValue.trim()==text.trim() )){
                    //DO NOTHING
                    console.log('***** same do nothing');
                }else{
                    component.set("v.keydownIndex",-1);
                    console.log('****** get addresses')
                    if(timeId!=undefined){
                        console.log('*** if last one is not finished then stop and queue another');
                        clearTimeout(timeId);
                    }
                    timeId= window.setTimeout(
                        $A.getCallback(function() {
                            helper.addSuggestions(component, event, helper,searchInfo);
                        }), 300
                    );
                    searchInfo.timeId=timeId;
                    searchInfo.text=addValue;
                    component.set("v.searchInfo",searchInfo);
                }
            }else{
                component.set("v.keydownIndex",-1);
                searchInfo={};
                searchInfo.text=event.target.value;
                timeId= window.setTimeout(
                    $A.getCallback(function() {
                        helper.addSuggestions(component, event, helper,searchInfo);
                    }), 300
                );

                searchInfo.timeId=timeId;
                component.set("v.searchInfo",searchInfo);
            }
        }
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
    },
    //HIDE THE SUGGESTIONS IF HOVER IS REMOVED 
    hideSuggestion: function(component, event, helper){
        console.log('hideSuggestion');
        window.setTimeout(
            $A.getCallback(function() {
                helper.hideAutoSuggestion(component);
            }), 200
        );
    }
})

({
	init : function(cmp, event, helper) {
		 // Figure out which buttons to display
        var availableActions = cmp.get('v.availableActions');
        for (var i = 0; i < availableActions.length; i++) {
            if (availableActions[i] == "PAUSE") {
                cmp.set("v.canPause", true);
            } else if (availableActions[i] == "BACK") {
                cmp.set("v.canBack", true);
            } else if (availableActions[i] == "NEXT") {
                cmp.set("v.canNext", true);
            } else if (availableActions[i] == "FINISH") {
                cmp.set("v.canFinish", true);
            }
        }
	},  
    onButtonPressed: function(cmp, event, helper) {
        // Figure out which action was called
        var actionClicked = event.getSource().getLocalId();
        if(actionClicked=='FINISH'){
            cmp.set("v.DoneProcess","true");
        }else{
            // Call that action
            var navigate = cmp.getEvent("navigateFlowEvent");
            navigate.setParam("action",actionClicked);
            navigate.fire();
        }
    },
    handleVerify: function(component, event, helper){
        component.set('v.doingProcess','true');       
        helper.getpostal(component,event,helper);               
    },
    onChange: function (cmp, evt, helper) {
        var theindex=cmp.find('adder').get('v.value');
       
        var theAddresses=cmp.get("v.result.theAddress");
        var theSelectedAddr=theAddresses[theindex];
        cmp.set("v.result.matchAddress",theSelectedAddr);
        
        document.getElementById('city').value=theSelectedAddr.city;
        document.getElementById('state').value=theSelectedAddr.state;
        document.getElementById('s').value=theSelectedAddr.street1;
        document.getElementById('country').value=theSelectedAddr.country;                         
        document.getElementById('zip').value=theSelectedAddr.postalcode; 
        document.getElementById('street2').value=theSelectedAddr.street2; 
    },
    //GET THE SUGGETED ADDRESS FROM SMARTYSTREET API
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
    //IF ONE OF THE ADDRESS IS SLECTED FROM THE OPTION
    callSuggestion: function(component, event, helper){
        
        //GET ALL THE ADDRESSES
        var addresses=component.get('v.addresses');  
        
        var country=document.getElementById('country').value;
        if(country == undefined || country ==null){
            country = 'USA';
        }
        console.log('country '+country);
         
        //SET THE FIELD VALUES FROM THE SELECTED OPTION   
        if(country==undefined || country=='' || (country!=undefined && (country.toLowerCase()=='usa') || country.toLowerCase().trim()=='united states' 
           || country.toLowerCase().trim()=='united states of america' || country.toLowerCase().trim()=='us'))
        {
            document.getElementById('s').value=addresses[event.target.id].street_line;
            document.getElementById('city').value=addresses[event.target.id].city;
            document.getElementById('state').value=addresses[event.target.id].state;
            document.getElementById('zip').value=addresses[event.target.id].zipcode;
            document.getElementById('country').value='USA';
        }else{
            document.getElementById('s').value=addresses[event.target.id].street;	
            document.getElementById('city').value=addresses[event.target.id].locality;
            document.getElementById('state').value=addresses[event.target.id].administrative_area;
            document.getElementById('zip').value=addresses[event.target.id].postal_code;
        }
        
        //HIDE THE DROPDOWN OPTION AFTER SELECTED
        var dropdownDiv=document.getElementById('streetDropdown');
        dropdownDiv.classList.remove("acshow");
        dropdownDiv.classList.add("achide");
        
        //CLEAR THE ADDRESS OPTINS 
        var allValues=[];
        component.set('v.addresses',allValues);  
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

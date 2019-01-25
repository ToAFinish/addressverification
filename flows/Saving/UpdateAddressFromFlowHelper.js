({	
    addSuggestions:function (component, event, helper){
        
        var currentIndex=parseInt((event.target.id).replace('s',''));
        var totaladdress=component.get("v.TotalAddress");
        for(var i=0;i<totaladdress;i++){
            if(i!=currentIndex)  {
                document.getElementById('street'+i).style.display='none';
            }  
        }
         
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
                component.set('v.addresses',response.getReturnValue());
                if (allValues != undefined && allValues.length>0) {
                    component.set('v.index',(event.target.id).replace('s',''));
                    document.getElementById('street'+(event.target.id).replace('s','')).style.display='';
                }else{
                    document.getElementById('street'+(event.target.id).replace('s','')).style.display='none';
                }                             
            }
        });
        $A.enqueueAction(action);
        }else{
            document.getElementById('street'+(event.target.id).replace('s','')).style.display='none';
            var allValues=[];
        	component.set('v.addresses',allValues);     
        }
    },
    getpostal : function(component, event, helper) {
      
        var isblank='false';
		var index=component.get("v.verifiedindex");
        var city=document.getElementById('city'+index).value;
        var state=document.getElementById('state'+index).value;
        var street=document.getElementById('s'+index).value;
		var country=document.getElementById('country'+index).value;               
       
        var street2='';
        if(document.getElementById('s2'+index)!=null){
           street2 =document.getElementById('s2'+index).value;
        }
        
        var zip='';
        if(city!='' || state!='' || street!='')
            isblank='false';
        else
            isblank='true';
        
        var el=document.getElementById('s'+index);  
        var _x = 0;
        var _y = 0;
      
        try{
            while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }	
        }catch(e){}
        
    	{            
            var action = component.get("c.getpostalcode");
            action.setParams({
                "street": street,
                "city": city,
                "state": state,
                "country": country,
                "zip": zip,
                "street2":street2
            });
            
            action.setCallback(this, function(response) {            
                if (response.getState() == "SUCCESS") {            
                    document.getElementById('zip'+index).value=response.getReturnValue(); 
                    if(response.getReturnValue()!=''){                             
                        component.set("v.verifiedindex",parseInt(index)+1);                                            
                        //  NOW MAKE THE REVERIY RUN
                        document.getElementById('verifyagain').click();
                    }
                    else{
                        // OPEN THE ALERT BOX   
                                                              
                        document.getElementById("ErrorboxMain").style.display='';                        
                        document.getElementById("Errorbox").style.paddingTop=(_y-20)+'px';   
                        
                     //   document.getElementById("Errorbox").style.marginTop=10+(parseInt(index)*15);
                        
                        if((parseInt(index)+1)%2==0){
                            document.getElementById("Errorbox").style.cssFloat='Right';
                            document.getElementById("Errorbox").style.marginLeft='0px';
                            document.getElementById("Errorbox").style.marginRight='33px';
                        }else{
                            document.getElementById("Errorbox").style.cssFloat='Left';
                            document.getElementById("Errorbox").style.marginLeft='33px';
                            document.getElementById("Errorbox").style.marginRight='0px';
                        }
                        
                        document.getElementById("theMessage").innerHTML=document.getElementById('s'+index).value+' '+street2+' '+document.getElementById('city'+index).value+' '+document.getElementById('state'+index).value;
                        if(isblank=='false'){
                            document.getElementById("ErrorboxHeader").innerHTML='YOU ENTERED AN UNKNOWN ADDRESS';
                        }else{
                            document.getElementById("ErrorboxHeader").innerHTML='YOU DID NOT ENTER ENOUGH INFORMATION';
                        }                                                        
                    }
                }
            });
            $A.enqueueAction(action);       
        } 
	},
    saveAddressAfterSucess : function(component, event, helper) {        
        var addresses=component.get('v.sObjaddresses');
        for(var i=0;i<addresses.length;i++){           
            var oneRow=addresses[i].oneRow; 
            for(var j=0;j<oneRow.length;j++){
                var index=oneRow[j].Index;                
                addresses[i].oneRow[j].cityvalue=document.getElementById('city'+index).value;
                addresses[i].oneRow[j].statevalue=document.getElementById('state'+index).value;               
                addresses[i].oneRow[j].streetvalue=document.getElementById('s'+index).value;             
                addresses[i].oneRow[j].countryvalue=document.getElementById('country'+index).value;
                addresses[i].oneRow[j].postalcodevalue=document.getElementById('zip'+index).value;
             
                //IF STREET 2 IS ENABLED
                if(addresses[i].oneRow[j].street2Enabled){
                    addresses[i].oneRow[j].street2value=document.getElementById('s2'+index).value;
                }
            }
        }       
        
        var theaddresses=JSON.stringify(addresses);
        console.log(theaddresses);
        var action = component.get("c.getUpdateOnAddress");
        action.setParams({ recordid : component.get("v.recordId"),addresswrapper:theaddresses});
      
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
               document.getElementById('verifyNow').click();
            }           
            else if (state === "ERROR") {
            }
        });
        $A.enqueueAction(action);
    }
})

public class AutoCompleteServicesExtension{

    //GET THE SUGGESTIONS FOR ADDRESS
    @AuraEnabled
    public static Response getSuggestions(string prefix){
        System.debug(smartystreets.AutoComplete.getaddresses(prefix));
        Response rs=new Response();
        try{
            rs.suggestions=smartystreets.AutoComplete.getaddresses(prefix);
            rs.status=true;
        }catch(exception e){
            rs.status=false;
            rs.message=e.getmessage();
        }
        return rs;
    }


    //THE RESPONSE SENT BY CLASS
    public class Response{
        @AuraEnabled
        public boolean status;
        @AuraEnabled
        public string message;
        @AuraEnabled
        public list<smartystreets.AutoComplete.addresses> suggestions;
    }
}

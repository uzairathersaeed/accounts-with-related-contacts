public with sharing class accountAndItsRelatedContacts {
    public accountAndItsRelatedContacts() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsRecord(){
            return [
                select Name,AnnualRevenue,Industry,Phone,Type from Account limit 20 
            ];
        
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(String accId){
        System.debug('accID'+ accId); 
        List<Contact> conList = [
                select Id,Name,Email,Phone,LeadSource from Contact where AccountId= :accId
         ];
         if(!conList.isEmpty()){
            return conList;
         }
         System.debug('ConList: ' + conList);

         return null;
    }
    @AuraEnabled
    public static Id createContact(String accountId, String firstName, String lastName, String email, String phone, String leadSource) {
        Contact newContact = new Contact(
            AccountId = accountId,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            LeadSource = leadSource
        );

        try {
            insert newContact;
            return newContact.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error creating contact: ' + e.getMessage());
        }
    }
    
}
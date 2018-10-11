import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class IncidentIdToNameService {
    private idToName = [{'reportedBy': 'Reported By'}, {'reportedByPhone': 'Reported By Phone'}
                        , {'reportedByEmail': 'Reported By Email'}, {'releaseType': 'Site Type'}
                        , {'siteName': 'Site Name'}, {'siteCounty': 'Site County'}
                        , {'streetNbr': 'Street Nbr'}, {'streetQuad': 'Street Quad'}];
    idToNameMap = new Map<string, string>();
    constructor() {
        this.idToNameMap.set('reportedBy', 'Reported By');
        this.idToNameMap.set('reportedByPhone', 'Reported By Phone');
        this.idToNameMap.set('reportedByEmail', 'Reported By Email');
        this.idToNameMap.set('releaseType', 'Site Type');
        this.idToNameMap.set('siteName', 'Site Name');
        this.idToNameMap.set('siteCounty', 'Site County');
        this.idToNameMap.set('streetNbr', 'Street Nbr');
        this.idToNameMap.set('streetQuad', 'Street Quad');
        this.idToNameMap.set('streetName', 'Street Name');
        this.idToNameMap.set('streetType', 'Street Type');
        this.idToNameMap.set('siteCity', 'Site City');

        this.idToNameMap.set('siteZipcode', 'Site Zipcode');
        this.idToNameMap.set('company', 'Company');
        this.idToNameMap.set('discoveryDate', 'Date Released Discovered');
        this.idToNameMap.set('confirmationCode', 'Confirmation');
        this.idToNameMap.set('discoveryCode', 'Discovery');
        this.idToNameMap.set('causeCode', 'Cause');
        this.idToNameMap.set('sourceId', 'Source');
        this.idToNameMap.set('rpFirstName', 'Responsible Party First Name');
        this.idToNameMap.set('rpLastName', 'Responsible Party Last Name');
        this.idToNameMap.set('rpOrganization', 'Responsible Party Organization');
        this.idToNameMap.set('rpAddress', 'Responsible Party Address');
        this.idToNameMap.set('rpCity', 'Responsible Party City');
        this.idToNameMap.set('rpState', 'Responsible Party State');
        this.idToNameMap.set('rpZipcode', 'Responsible Party Zipcode');
        this.idToNameMap.set('rpPhone', 'Responsible Party Phone');

        this.idToNameMap.set('icFirstName', 'Invoice Contact First Name');
        this.idToNameMap.set('icLastName', 'Invoice Contact Last Name');
        this.idToNameMap.set('icOrganization', 'Invoice Contact Organization');
        this.idToNameMap.set('icAddress', 'Invoice Contact Address');
        this.idToNameMap.set('icCity', 'Invoice Contact City');
        this.idToNameMap.set('icState', 'Invoice Contact State');
        this.idToNameMap.set('icZipcode', 'Invoice Contact Zipcode');
        this.idToNameMap.set('icPhone', 'Invoice Contact Phone');
        this.idToNameMap.set('noValidAddress', 'No Valid Address');
        this.idToNameMap.set('dateReceived', 'Received Date');
        this.idToNameMap.set('receivedDateAfterCloseDate', 'Received Date');
        this.idToNameMap.set('siteNoValidAddressMissing', 'Site Address');


    }
    // function reverse(s: string): string;
    getIdToNameMap():  Map<string, string> {
        return this.idToNameMap;
    }
    getName(id: string): string {
        return this.idToNameMap.get(id);
    }

// icFirstName is required and must be valid.
// icLastName is required and must be valid.
// icOrganization is required and must be valid.
// icCity is required and must be valid.
// icState is required and must be valid.
// icZipcode is required and must be valid.
// icPhone is required and must be valid.

}

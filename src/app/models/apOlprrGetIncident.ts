export class ApOlprrGetIncident {
    olprrid: number;
    releaseTypeCode: string;
    releaseType: string;
    receivedDate: Date;
    facilityId: string;
    siteName: string;
    siteCountyCode: string;
    siteCounty: string;
    siteAddress: string;
    otherAddress: string;
    siteCity: string;

    siteZipCode: string;
    sitePhone: string;
    siteComment: string;
    contractorId: string;
    siteStatus: string;

    reportedBy: string;
    reportedByPhone: string;
    companyName: string;
    emailAddress: string;

    constructor( olprrid: number, releaseTypeCode: string) {
            this.olprrid = olprrid;
            this.releaseTypeCode = releaseTypeCode;
        }
}

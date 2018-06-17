export interface OlprrSearchResultStat {
    reqDeqOffice?: string;
    reqIncidentStatus?: string;
    reqSiteType?: string;
    reqOlprrId?: string;
    reqPageNumber?: number;
    reqRowsPerPage?: number;
    reqSortColumn?: number;
    reqSortOrder?: number;
    totalRows?: number;
    totalPages?: number;

    olprrId: number;
    releaseTypeCode: string;
    releaseType: string;
    receiveDate: Date;
    facilityId: string;
    siteName: string;
    siteCountyCode: string;
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
    siteCounty: string;
}

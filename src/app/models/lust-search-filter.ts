export interface LustSearchFilter {
    logCounty: string;
    logYear: string;
    logSeqNbr: string;
    facilityId: string;
    siteName: string;
    siteAddress: string;
    siteZipcode: string;
    regionCode: string;
    releaseSiteTypeCode: string;
    cleanupSiteTypeId: number;

    fileStatusId: number;
    projectManagerCode: string;
    contactFirstName: string;
    contactLastName: string;
    contactOrganization: string;
    tankStatusId: number;
    hotAuditRejectInd: number;
    compareDate1Id: number;
    compareDate2Id: number;
    compareDate1IdFromDate: Date;
    compareDate1IdToDate: Date;
    compareDate2IdFromDate: Date;
    compareDate2IdToDate: Date;
    sortColumn: number;
    sortOrder: number;
    pageNumber: number;
    rowsPerPage: number;

}

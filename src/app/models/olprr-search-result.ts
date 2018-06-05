export interface OlprrSearchResult {
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

    // constructor( olprrid: number, incidentStatus?: string, siteType?: string, olprrId?: string
    //     , totalRows?: number, totalPages?: number, pageNumber?: number, rowsPerPage?: number, sortColumn?: number
    //     , sortOrder?: number, olprrSearchResults?: OlprrSearchResult[]) {
    //         this.deqOffice = deqOffice;
    //         this.incidentStatus = incidentStatus;
    //         this.siteType = siteType;
    //         this.olprrId = olprrId;
    //         this.totalRows = totalRows;
    //         this.totalPages = totalPages;
    //         this.pageNumber = pageNumber;
    //         this.rowsPerPage = rowsPerPage;
    //         this.sortColumn = sortColumn;
    //         this.sortOrder = sortOrder;
    //         this.olprrSearchResults = olprrSearchResults;
    //     }


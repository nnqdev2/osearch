export interface LustSearchResultStat {
    reqPageNumber?: number;
    reqRowsPerPage?: number;
    reqSortColumn?: number;
    reqSortOrder?: number;
    totalRows?: number;
    totalPages?: number;
    lustId: number;
    logNumber: string;
    siteName: string;
    siteAddress: string;
    firDt: Date;
    closedDt: Date;
    facilityId: string;
    siteScore: number;
}

export interface UstSearchResultStat {
    reqPageNumber?: number;
    reqRowsPerPage?: number;
    reqSortColumn?: number;
    reqSortOrder?: number;
    totalRows?: number;
    totalPages?: number;
    facilityId: number;
    facilityName: string;
    facilityAddress: string;
    facilityCity: string;
    facilityZip: string;
    countyName: string;
    countyCode: string;
}

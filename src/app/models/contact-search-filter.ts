export interface ContactSearchFilter {
    firstName?: string;
    lastName?: string;
    organization?: string;
    pageNumber: number;
    rowsPerPage: number;
    sortColumn: number;
    sortOrder: number;
}

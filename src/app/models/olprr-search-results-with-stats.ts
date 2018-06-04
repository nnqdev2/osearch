import { OlprrSearchResult } from './olprr-search-result';
// import { ApOlprrGetIncident } from './apOlprrGetIncident';
export interface OlprrSearchResultWithStats {
    deqOffice?: string;
    incidentStatus?: string;
    siteType?: string;
    olprrId?: string;
    totalRows?: number;
    totalPages?: number;
    pageNumber?: number;
    rowsPerPage?: number;
    sortColumn?: number;
    sortOrder?: number;
    olprrSearchResults?: OlprrSearchResult[];

    // constructor( deqOffice?: string, incidentStatus?: string, siteType?: string, olprrId?: string
    // , totalRows?: number, totalPages?: number, pageNumber?: number, rowsPerPage?: number, sortColumn?: number
    // , sortOrder?: number, apOlprrGetIncidents?: ApOlprrGetIncident[]) {
    //     this.deqOffice = deqOffice;
    //     this.incidentStatus = incidentStatus;
    //     this.siteType = siteType;
    //     this.olprrId = olprrId;
    //     this.totalRows = totalRows;
    //     this.totalPages = totalPages;
    //     this.pageNumber = pageNumber;
    //     this.rowsPerPage = rowsPerPage;
    //     this.sortColumn = sortColumn;
    //     this.sortOrder = sortOrder;
    //     this.apOlprrGetIncidents = apOlprrGetIncidents;
    // }
}

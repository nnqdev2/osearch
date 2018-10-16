export interface ContactSearchResultStat {
    reqFirstName: string;
    reqLastName: string;
    reqOrganization: string;
    reqPageNumber?: number;
    reqRowsPerPage?: number;
    reqSortColumn?: number;
    reqSortOrder?: number;
    totalRows?: number;
    totalPages?: number;
    partyId: number;
    organization: string;
    firstName: string;
    lastName: string;
    personName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    address: number;
    country: string;
    email: string;
    subOrganization: string;
}

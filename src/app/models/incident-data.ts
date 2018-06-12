export interface IncidentData {
    olprrid: string;
    releaseTypeCode: string;
    releaseType: string;
    dateReceived: Date;
    facilityId: number;
    siteName: string;
    siteCounty: string;
    siteAddress: string;
    otherAddress: string;
    siteCity: string;
    siteZipcode: number;
    sitePhone: string;
    siteComment: string;
    contractorId: string;
    siteStatus: string;
    reportedBy: string;
    reportedByPhone: string;
    contractorName: string;
    contractorEmail: string;

    rpFirstName: string;
    rpLastName: string;
    rpOrganization: string;
    rpAddress: string;
    rpAddress2: string;
    rpCity: string;
    rpState: string;
    rpZipcode: string;
    rpPhone: string;
    rpEmail: string;

    icFirstName: string;
    icLastName: string;
    icOrganization: string;
    icAddress: string;
    icAddress2: string;
    icCity: string;
    icState: string;
    icZipcode: string;
    icPhone: string;
    icEmail: string;

    discoveryDate: Date;
    confirmationCode: string;
    confirmationDesc: string;
    discoveryCode: string;
    discoveryDesc: string;
    sourceId: string;
    sourceDesc: string;
    causeCode: string;
    causeDesc: number;


    groundWater: number;
    surfaceWater: number;
    drinkingWater: number;
    soil: number;
    vapor: number;
    freeProduct: number;
    unleadedGas: number;
    leadedGas: number;
    misGas: number;
    diesel: number;
    wasteOil: number;
    heatingOil: number;
    lubricant: number;
    solvent: number;
    otherPet: number;
    chemical: number;
    unknown: number;
    mtbe: number;

}

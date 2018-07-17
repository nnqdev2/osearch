export class LustIncident {
    lustIdIn: number;
    facilityId: number;
    countyId: number;
    dateReceived: Date;
    siteName: string;
    siteAddress: string;
    siteCity: string;
    siteZipcode: string;
    sitePhone: string;
    noValidAddress: number;
    regTankInd: number;
    hotInd: number;
    nonRegTankInd: number;
    initialComment: string;
    olprrId: number;
    discoveryDate: Date;
    confirmationCode: string;
    discoveryCode: string;
    causeCode: string;
    sourceId: number;
    soil: number;
    groundWater: number;
    surfaceWater: number;
    drinkingWater: number;
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

    rpOrganization: string;
    rpFirstName: string;
    rpLastName: string;
    rpPhone: string;
    rpEmail: string;
    rpAddress: string;
    rpCity: string;
    rpState: string;
    rpZipcode: string;
    rpCountry: string;
    rpAffilComments: string;

    icOrganization: string;
    icFirstName: string;
    icLastName: string;
    icPhone: string;
    icEmail: string;
    icAddress: string;
    icCity: string;
    icState: string;
    icZipcode: string;
    icCountry: string;
    icAffilComments: string;

    appId: string;
    newSiteStatus: string;
}
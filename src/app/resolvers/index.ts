
import { SiteTypesResolver } from './site-types-resolver.service';
import { DeqOfficesResolver } from './deq-offices-resolver.service';
import { IncidentStatusesResolver } from './incident-statuses-resolver.service';
import { ConfirmationTypesResolver } from './confirmation-types-resolver.service';
import { CountiesResolver } from './counties-resolver.service';
import { DiscoveryTypesResolver } from './discovery-types-resolver.service';
import { QuadrantsResolver } from './quadrants-resolver.service';
import { ReleaseCauseTypesResolver } from './release-cause-types-resolver.service';
import { SourceTypesResolver } from './source-types-resolver.service';
import { StatesResolver } from './states-resolver.service';
import { StreetTypesResolver } from './street-types-resolver.service';
import { IncidentDataResolver } from './incident-resolver.service';
import { TankStatusesResolver } from './tank-statuses-resolver.service';
import { FileStatusesResolver } from './file-statuses-resolver.service';
import { CitiesResolver } from './cities-resolver.service';
import { ZipCodesResolver } from './zipcodes-resolver.service';
import { DateComparesResolver } from './date-compares-resolver.service';
import { RegionsResolver } from './regions-resolver.service';
import { ProjectManagersResolver } from './project-managers-resolver.service';
import { CleanupSiteTypesResolver } from './cleanup-site-types-resolver.service';

export const resolverProviders = [
    SiteTypesResolver, DeqOfficesResolver, IncidentStatusesResolver, ConfirmationTypesResolver
    , CountiesResolver, DiscoveryTypesResolver, QuadrantsResolver, ReleaseCauseTypesResolver
    , SourceTypesResolver, StatesResolver, StreetTypesResolver, IncidentDataResolver
    , TankStatusesResolver, FileStatusesResolver, CitiesResolver, ZipCodesResolver
    , DateComparesResolver, RegionsResolver, ProjectManagersResolver, CleanupSiteTypesResolver
];


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

export const resolverProviders = [
    SiteTypesResolver, DeqOfficesResolver, IncidentStatusesResolver, ConfirmationTypesResolver
    , CountiesResolver, DiscoveryTypesResolver, QuadrantsResolver, ReleaseCauseTypesResolver
    , SourceTypesResolver, StatesResolver, StreetTypesResolver
];

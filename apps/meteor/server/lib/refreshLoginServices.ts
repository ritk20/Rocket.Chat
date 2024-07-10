import { ServiceConfiguration } from 'meteor/service-configuration';

import { loadSamlServiceProviders } from '../../app/meteor-accounts-saml/server/lib/settings';
import { updateCasServices } from './cas/updateCasService';
import { updateOAuthServices } from './oauth/updateOAuthServices';

export async function refreshLoginServices(shouldNotify = true): Promise<void> {
	await ServiceConfiguration.configurations.removeAsync({});

	await Promise.allSettled([updateOAuthServices(shouldNotify), loadSamlServiceProviders(shouldNotify), updateCasServices()]);
}

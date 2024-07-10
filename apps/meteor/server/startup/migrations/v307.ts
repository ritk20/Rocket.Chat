import { Settings } from '@rocket.chat/models';

import { settings } from '../../../app/settings/server';
import { isTruthy } from '../../../lib/isTruthy';
import { SystemLogger } from '../../lib/logger/system';
import { addMigration } from '../../lib/migrations';
import { refreshLoginServices } from '../../lib/refreshLoginServices';

// const newDefaultButtonColor = '#e4e7ea';
// const newDefaultButtonLabelColor = '#1f2329';

const newDefaultButtonColor = 'green';
const newDefaultButtonLabelColor = 'blue';

const settingsToUpdate = [
	// button background colors
	{ key: 'SAML_Custom_Default_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
	{ key: 'CAS_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
	{ key: 'Accounts_OAuth_Nextcloud_button_color', defaultValue: '#0082c9', newValue: newDefaultButtonColor },
	{ key: 'Accounts_OAuth_Dolphin_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
	// button label colors
	{ key: 'SAML_Custom_Default_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
	{ key: 'CAS_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
	{ key: 'Accounts_OAuth_Nextcloud_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
	{ key: 'Accounts_OAuth_Dolphin_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
];

addMigration({
	version: 308,
	name: 'Change default color of OAuth login services buttons',
	async up() {
		const promises = settingsToUpdate
			.map(({ key, defaultValue, newValue }) => {
				const oldSettingValue = settings.get(key);

				if (!oldSettingValue || oldSettingValue !== defaultValue) {
					return;
				}

				SystemLogger.warn(`The default value of the setting ${key} has changed to ${newValue}. Please review your settings.`);

				return Settings.updateOne({ _id: key }, { $set: { value: newValue } });
			})
			.filter(isTruthy);

		await Promise.all(promises);

		const customOAuthButtonColors = await Settings.find({
			_id: { $regex: /^Accounts_OAuth_Custom-[a-zA-Z0-9_-]+-button_color$/ },
		}).toArray();
		const customOAuthButtonLabelColors = await Settings.find({
			_id: { $regex: /^Accounts_OAuth_Custom-[a-zA-Z0-9_-]+-button_label_color$/ },
		}).toArray();

		const buttonColorPromises = customOAuthButtonColors
			.map(({ _id, value, packageValue }) => {
				if (packageValue !== value) {
					return;
				}

				SystemLogger.warn(
					`The default value of the custom setting ${_id} has changed to ${newDefaultButtonColor}. Please review your settings.`,
				);

				return Settings.updateOne({ _id }, { $set: { value: newDefaultButtonColor } });
			})
			.filter(isTruthy);

		const buttonLabelColorPromises = customOAuthButtonLabelColors
			.map(({ _id, value, packageValue }) => {
				if (packageValue !== value) {
					return;
				}

				SystemLogger.warn(
					`The default value of the custom setting ${_id} has changed to ${newDefaultButtonLabelColor}. Please review your settings.`,
				);

				return Settings.updateOne({ _id }, { $set: { value: newDefaultButtonLabelColor } });
			})
			.filter(isTruthy);

		await Promise.all([...buttonColorPromises, ...buttonLabelColorPromises]);
		// update login service configurations
		await refreshLoginServices(false);
	},
});

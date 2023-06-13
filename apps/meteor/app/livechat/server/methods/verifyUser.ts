import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import type { IRoom } from '@rocket.chat/core-typings';
import type { ServerMethods } from '@rocket.chat/ui-contexts';
import { LivechatRooms, Users } from '@rocket.chat/models';

import { sendMessage } from '../../../lib/server/functions/sendMessage';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		'livechat:verifyUser'(rid: IRoom['_id']): void;
	}
}

Meteor.methods<ServerMethods>({
	async 'livechat:verifyUser'(rid) {
		check(rid, String);
		const room = await LivechatRooms.findOneById(rid);
		const user = await Users.findOneById('rocket.cat');
		const message = {
			msg: 'hi',
			groupable: false,
		};
		await sendMessage(user, message, room);
	},
});

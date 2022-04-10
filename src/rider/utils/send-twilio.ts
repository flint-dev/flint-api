import { makeAccessTokenFactory, Scope } from '@chatdaddy/service-auth-client';
import {
  ChatsApi,
  Configuration,
  MessageComposeStatusEnum,
  MessagesApi,
} from '@chatdaddy/service-im-client';

/**
 * Example
 *
 * Finds the first chat in the team & sends a message to it
 */

const run = async (to) => {
  const REFRESH_TOKEN = '3789b955-ae54-4a55-b455-f016884d9290';
  const TEAM_ID = 'b53095bb-3f68-48b9-bb4e-24b7cae3ec46';

  const getAccessToken = makeAccessTokenFactory({
    request: {
      refreshToken: REFRESH_TOKEN,
      // get access to send messages, and read chats
      scopes: [Scope.MessagesSendToAll, Scope.ChatsAccessAll],
    },
  });

  const { token: accessToken } = await getAccessToken(TEAM_ID);

  const messagesApi = new MessagesApi(new Configuration({ accessToken }));

  const { data: messages } = await messagesApi.messagesPost('random', chat.id, {
    text: 'Hello from API',
  });
};

export default run;

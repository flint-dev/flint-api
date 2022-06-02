import { makeAccessTokenFactory, Scope } from '@chatdaddy/service-auth-client';
import { Configuration, MessagesApi } from '@chatdaddy/service-im-client';

/**
 * Example
 *
 * Finds the first chat in the team & sends a message to it
 */

const run = async (to: string, message: string) => {
  const REFRESH_TOKEN = '3c5d057e-a0b3-46bd-91de-56074268d341';
  const TEAM_ID = '25c88641-d8de-4bc5-86ab-a0f29ec4cacd';

  const getAccessToken = makeAccessTokenFactory({
    request: {
      refreshToken: REFRESH_TOKEN,
      // get access to send messages, and read chats
      scopes: [Scope.MessagesSendToAll],
    },
  });

  const { token: accessToken } = await getAccessToken(TEAM_ID);

  const messagesApi = new MessagesApi(new Configuration({ accessToken }));
  return (
    await messagesApi.messagesPost(
      'random',
      `${to}@s.whatsapp.net`,
      false,
      false,
      false,
      {
        text: message,
      },
    )
  ).data[0];
};

export default run;

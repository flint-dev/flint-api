import { makeAccessTokenFactory, Scope } from '@chatdaddy/service-auth-client';
import { Configuration, MessagesApi } from '@chatdaddy/service-im-client';

/**
 * Example
 *
 * Finds the first chat in the team & sends a message to it
 */

const run = async (to: string, message: string) => {
  const REFRESH_TOKEN = '43a4c641-801b-46f6-a53a-994f5d94e0c7';
  const TEAM_ID = 'b53095bb-3f68-48b9-bb4e-24b7cae3ec46';

  const getAccessToken = makeAccessTokenFactory({
    request: {
      refreshToken: REFRESH_TOKEN,
      // get access to send messages, and read chats
      scopes: [Scope.MessagesSendToAll],
    },
  });

  const { token: accessToken } = await getAccessToken(TEAM_ID);

  const messagesApi = new MessagesApi(new Configuration({ accessToken }));
  try {
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
  } catch (error) {
    console.log(error);
  }
};

export default run;

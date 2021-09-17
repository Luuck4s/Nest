import { internet } from 'faker';

export default class TestUtil {
  static random = {
    internet: {
      email: () => {
        return `${new Date().getTime()}${internet.email()}`;
      },
      password: internet.password(),
    },
  };
}

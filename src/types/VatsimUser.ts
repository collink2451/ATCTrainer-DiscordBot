/* eslint-disable no-use-before-define */
export default interface VatsimUser {
  cid: string;
  personal: VatsimUserPersonalData;
}

interface VatsimUserPersonalData {
  name_full: string;
}

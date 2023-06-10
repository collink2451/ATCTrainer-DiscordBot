/* eslint-disable no-use-before-define */
export default interface VatusaUser {
  cid: string;
  fname: string;
  lname: string;
  facility: string;
  roles: VatusaUserRole[];
}

interface VatusaUserRole {
  facility: string;
  role: string;
}

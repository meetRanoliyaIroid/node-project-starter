import { baseUrl } from "../config/constant";

export default class UserAuthResource {
  constructor(data) {
    return (async () => {
      return {
        id: data.user.id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        phone_number: data.user.phone_number,
        profile: data.user.profile ? baseUrl(data.user.profile) : null,
        gender: data.user.gender,
        dob: data.user.dob ? +data.user.dob : null,
        is_otp_verified: data.user.is_otp_verified ? true : false,
        token: data.authenticate ?? null
      }
    })();
  }
}

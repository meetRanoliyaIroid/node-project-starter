import { baseUrl } from "../config/constant";

export default class UserListResource {
  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone_number = data.phone_number;
    this.profile = data.profile ? baseUrl(data.profile) : null;
  }
}

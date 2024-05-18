import {UserPhotoModel} from "./user-photo.model";

export interface UserProfileModel{
  id: string,
  userName: string;
  email : string;
  isAdmin: boolean;
  isBanned: boolean;
  firstName : string;
  lastName : string;
  photo?: UserPhotoModel | null
}

import { UserCountResponse } from './../types/user.types';
import { PageResponse } from "../types/error-response";
import { UserDTO } from "../types/user.types";
import client from "./client"
import { routes } from './routes';

export const userService = {

    listUser: async(): Promise<PageResponse<UserDTO>> => {
const response = await client.get(routes.users.base);
return response.data
    },

getCount : async(): Promise<UserCountResponse> => {
const response = await client.get(routes.users.count);
return response.data;
},

blockUser: async(userId: number): Promise<void> => {
    await client.put(`${routes.users.base}/${userId}/block`);
},

unblockUser: async(userId: number): Promise<void> => {
    await client.put(`${routes.users.base}/${userId}/unblock`);
},

delete:async(userId: number): Promise<void> => {
    await client.delete(`${routes.users.base}/${userId}`);
}
  }

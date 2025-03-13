

export interface UserDTO{
        id: number;
        username: string;
        lastName: string;
        email: string;
        registrationDate: string;
        isblocked: boolean;

}
export interface UserCountResponse{
    count:number ;
}
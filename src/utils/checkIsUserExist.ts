import { UserModel } from '../schema/user.schema';

export async function checkIfUserExist (UserName: string): Promise<boolean> {
    const user = await UserModel.findOne({ name: UserName });
    if (user) return true;
    else return false;
};
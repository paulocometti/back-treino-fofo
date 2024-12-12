import { z } from "zod";

export type UserProps = {
    id: string;
    name: string;
    role: 'USER' | 'ADMIN';
};

export const schemaUser = z.object({
    id: z.string().trim(),
    name: z.string().trim(),
    role: z.enum(['USER','ADMIN'])
});

export class User {
    private constructor(private props: UserProps){
        this.validate();
    };

    public static create(){
        
    };

    public static with(props: UserProps){
        return new User(props);
    };

    public get id(){
        return this.props.id;
    };

    public get name(){
        return this.props.name;
    };

    public get role(){
        return this.props.role;
    };

    private validate(){
        const isValidUser = schemaUser.safeParse(this.props);
        if(!isValidUser.success)
            throw new Error('O usuário não foi informado. Faça login novamente, por favor!');
    };
};
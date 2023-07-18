import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'users'
})
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email:string;
    
    @Column()
    password:string;

    @Column()
    role:string;

    validatePassword(password:string):boolean{
        return this.password === password;
    }
    getInfoToken(){
        return {
            id: this.id,
            email: this.email,
            role: this.role
        }
    }
}

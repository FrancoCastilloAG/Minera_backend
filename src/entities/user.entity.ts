import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'users'
})
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name:string;
    
    @Column()
    password:string;

    validatePassword(password:string):boolean{
        return this.password === password;
    }
    getInfoToken(){
        return {
            id: this.id,
            name: this.name
        }
    }
}

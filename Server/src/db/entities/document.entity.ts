import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
 } from "typeorm";


 @Entity("document")
 export class Document {
   @PrimaryGeneratedColumn('uuid')
   id!: string

   @Column()
   name!: string

   @Column()
   size!: number

   @Column()
   extension!: string

   @Column({default: "processed"})
   status!: "processed" | "processing" | "error"

   @CreateDateColumn()
   uploaded_at!: Date 
 }
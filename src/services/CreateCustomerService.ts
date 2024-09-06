import prismaClient from "../prisma";

interface CreateCustomerProps{
    name: string;
    email: string;
    phone: string
}

class CreateCustomerService {
    async execute({name,email,phone}:CreateCustomerProps){

       if(!name || !email|| !phone){
        throw new Error("Preencher todos os campos")
       }
       
        const customer = await prismaClient.customer.create({
        data:{
            name,
            email,
            phone,
            status: true
        }
       })

        return customer
    }    
}

export { CreateCustomerService};
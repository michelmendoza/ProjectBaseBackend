import prismaClient from "../prisma"

interface deleteCustomerProps{
    id:string
}


class DeleteCustomerService{
    async execute({ id }:deleteCustomerProps ){

    if (!id){
        throw new Error ( "Solicitação Incorreta" )
    }

    const findCustomers = await prismaClient.customer.findFirst({
        where:{
            id: id
        }
    })


    if(!findCustomers){
        throw new Error("Cliente não Existe!")
    }

    await prismaClient.customer.delete({
        where:{
            id: id
        }
    })

    return { message: "Deletado com sucesso!"};
    } 

}

export { DeleteCustomerService }

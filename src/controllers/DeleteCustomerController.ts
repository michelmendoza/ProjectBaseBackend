import { FastifyRequest,FastifyReply  } from "fastify";
import { DeleteCustomerService } from "../services/DeleteCustomerService";
 

class DeleteCustomerController {
    async handle(request: FastifyRequest, reply:FastifyReply){
        
        const {id} = request.query as {id:string}
        console.log(request.body)
 
        const deletecustomerService = new DeleteCustomerService()

        const customer = await deletecustomerService.execute({id})

        reply.send(customer)

    }

}

export { DeleteCustomerController }

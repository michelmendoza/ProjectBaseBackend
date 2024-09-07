import { FastifyRequest,FastifyReply  } from "fastify";
import { CreateCustomerService } from "../services/CreateCustomerService";

class CreateCustomerController {
    async handle(request: FastifyRequest, reply:FastifyReply){
        
        const {name,email,phone} = request.body as {name:string,email:string,phone:string}
        console.log(request.body)
 
        const customerService = new CreateCustomerService()

        const customer = await customerService.execute({name,email,phone})

        reply.send(customer)

    }

}

export { CreateCustomerController }

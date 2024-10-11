"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCustomerController = void 0;
const DeleteCustomerService_1 = require("../services/DeleteCustomerService");
class DeleteCustomerController {
    async handle(request, reply) {
        const { id } = request.query;
        console.log(request.body);
        const deletecustomerService = new DeleteCustomerService_1.DeleteCustomerService();
        const customer = await deletecustomerService.execute({ id });
        reply.send(customer);
    }
}
exports.DeleteCustomerController = DeleteCustomerController;

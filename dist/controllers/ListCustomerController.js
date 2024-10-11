"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCustomerController = void 0;
const ListCustomerService_1 = require("../services/ListCustomerService");
class ListCustomerController {
    async handle(request, reply) {
        const listCustomerService = new ListCustomerService_1.ListCustomerService();
        const customers = await listCustomerService.execute();
        reply.send(customers);
    }
}
exports.ListCustomerController = ListCustomerController;

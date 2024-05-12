"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const schema_1 = require("../../models/schema");
node_cron_1.default.schedule("0 0 * * *", async () => {
    const today = new Date();
    const users = await schema_1.User.find();
    users.forEach((user) => {
        user.projects.forEach((project) => {
            project.invoices.forEach(async (invoice) => {
                if (invoice.status !== schema_1.Status.paid) {
                    if (invoice.date !== null) {
                        if (today >= invoice.date) {
                            invoice.status = schema_1.Status.overDue;
                            const projectIndex = user.projects.findIndex((p) => p._id.toString() === project._id.toString());
                            if (projectIndex !== -1) {
                                user.projects[projectIndex] = project;
                                await user.save();
                                console.log(`user ${user.email} has 1 overDue invoice`);
                            }
                        }
                    }
                }
            });
        });
    });
});

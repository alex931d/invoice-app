import cron from "node-cron";
import {
  User,
  IUser,
  IInvoice,
  IProject,
  Status,
  Project,
} from "../../models/schema";
cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  const users = await User.find();
  users.forEach((user) => {
    user.projects.forEach((project: IProject) => {
      project.invoices.forEach(async (invoice: IInvoice) => {
        if (invoice.status !== Status.paid) {
          if (invoice.date !== null) {
            if (today >= invoice.date) {
              invoice.status = Status.overDue;
              const projectIndex = user.projects.findIndex(
                (p) => p._id.toString() === project._id.toString()
              );
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

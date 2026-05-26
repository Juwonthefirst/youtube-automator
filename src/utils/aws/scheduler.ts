import {
  DeleteScheduleCommand,
  DeleteScheduleGroupCommand,
  ListScheduleGroupsCommand,
  ListSchedulesCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler";

class Scheduler {
  private readonly scheduler: SchedulerClient;

  constructor() {
    this.scheduler = new SchedulerClient({ region: process.env.AWS_REGION });
  }

  listSchedules(groupName?: string) {
    return this.scheduler.send(
      new ListSchedulesCommand({ GroupName: groupName }),
    );
  }

  async listScheduleGroups() {
    const response = await this.scheduler.send(
      new ListScheduleGroupsCommand({}),
    );
    return response.ScheduleGroups || [];
  }

  deleteSchedule(name: string, group_name: string) {
    return this.scheduler.send(
      new DeleteScheduleCommand({ Name: name, GroupName: group_name }),
    );
  }

  deleteScheduleGroup(name: string) {
    return this.scheduler.send(new DeleteScheduleGroupCommand({ Name: name }));
  }
}

export const scheduler = new Scheduler();

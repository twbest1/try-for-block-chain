const TaskList = artifacts.require("./TaskList.sol");

contract('TaskList', (accounts) => {
    before(async () => {
        this.taskList = await TaskList.deployed();
    });

    it('deployed successfully', async () => {
        const address = await this.taskList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it('lists tasks', async () => {
        const taskCount = await this.taskList.taskCount();
        const task = await this.taskList.tasks(taskCount);
        assert.equal(taskCount.toNumber(), task.id.toNumber());
        assert.equal(task.content, "Check Wayne's first contract");
        assert.equal(task.completed, false);
        assert.equal(taskCount.toNumber(), 1);
    });

    it('creates tasks', async () => {
        const result = await this.taskList.createTask("Wayne's new task");
        const taskCount = await this.taskList.taskCount();
        assert.equal(taskCount, 2);
        console.log(result);
        const event = result.logs[0].args;
        console.log(event);
        assert.equal(event.id.toNumber(), 2);
        assert.equal(event.content, "Wayne's new task");
        assert.equal(event.completed, false);
    });

    it('task completed', async () => {
        const result = await this.taskList.completeTask(1);
        const task = await this.taskList.tasks(1);
        assert.equal(task.completed, true);
        console.log(result);
        const event = result.logs[0].args;
        console.log(event);
        assert.equal(event.id.toNumber(), 1);
        assert.equal(event.completed, true);
    });
});


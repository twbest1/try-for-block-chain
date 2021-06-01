const TaskList = artifacts.require("TaskList");

module.exports = function (deployer) {
    deployer.deploy(TaskList);
};

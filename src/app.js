App = {
    contracts: {},
    loading: false,

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    // 具体简单参考web3的使用(直接复制)，配合MetaMask
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            console.log(33333)
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            console.log(44444)
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    // 加载账户
    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        console.log(App.account);
    },

    // 加载合约
    loadContract: async () => {
        // 获取合约的Json
        const taskList = await $.getJSON('TaskList.json');
        App.contracts.TaskList = TruffleContract(taskList);
        App.contracts.TaskList.setProvider(App.web3Provider);

        // 获取链上合约并部署
        App.taskList = await App.contracts.TaskList.deployed()
    },

    render: async () => {
        // 防止double loading
        if (App.loading) {
            return;
        }

        App.setLoading(true);

        $('#account').html(App.account);

        await App.renderTasks();

        App.setLoading(false);
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');
        if (boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    },

    renderTasks: async () => {
        // 从链上读数据
        const taskCount = await App.taskList.taskCount();
        console.log(taskCount);

        // 获取模板渲染
        const $taskTemplate = $('.taskTemplate');

        for (let i = 1; i <= taskCount; i++) {
            const task = await App.taskList.tasks(i);
            console.log(task);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskContent);
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)
                .on('click', App.completeTask);

            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate);
            } else {
                $('#taskList').append($newTaskTemplate);
            }

            $newTaskTemplate.show();
        }
    },

    createTask: async () => {
        App.setLoading(true);
        const content = $('#newTask').val();
        await App.taskList.createTask(content);
        window.location.reload();
    },

    completeTask: async (e) => {
        App.setLoading(true);
        const taskId = e.target.name;
        await App.taskList.completeTask(taskId);
        window.location.reload();
    }

};

$(() => {
    $(window).load(() => {
        App.load();
    })
});
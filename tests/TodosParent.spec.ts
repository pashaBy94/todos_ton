import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TodosParent } from '../wrappers/TodosParent';
import { TodosChild } from '../wrappers/TodosChild';
import '@ton/test-utils';

describe('TodosParent', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todosParent: SandboxContract<TodosParent>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todosParent = blockchain.openContract(await TodosParent.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todosParent.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: todosParent.address,
            deploy: true,
            success: true,
        });
    });

    it('should new todo', async () => {
        const result = await todosParent.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'Todo',
                text: 'Go to sleep',
            },
        );
        let address = await todosParent.getTodoAddress(1n);
        let addressChild = blockchain.openContract(TodosChild.fromAddress(address));
        let details = await addressChild.getDetails();
        console.log(address, addressChild, details);
        await todosParent.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'CompleteTodo',
                number: 1n,
            },
        );
        let details2 = await addressChild.getDetails();
        console.log(details2);
    });
});

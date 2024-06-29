import { toNano } from '@ton/core';
import { TodosChild } from '../wrappers/TodosChild';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const todosChild = provider.open(await TodosChild.fromInit());

    await todosChild.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(todosChild.address);

    // run methods on `todosChild`
}

import { toNano } from '@ton/core';
import { TodosParent } from '../wrappers/TodosParent';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const todosParent = provider.open(await TodosParent.fromInit());

    await todosParent.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(todosParent.address);

    // run methods on `todosParent`
}

import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/todos_parent.tact',
    options: {
        debug: true,
    },
};

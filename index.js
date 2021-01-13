import MarkovChain from 'foswig';
import { dict } from './dictionary.js';

function rand(min, max) {
    if (max == undefined) {
        max = min;
        min = 0;
    } else {
        max += 1;
    }
    return Math.floor(Math.random() * (max - min) + min);
}

function genMarkovPass({
    count = 2,
    order = rand(3, 4),
    minLength = rand(4, 6),
    maxLength = rand(7, 9),
    maxAttempts = 100,
    allowDuplicates = false,
} = {}) {

    const constraints = {
        minLength: minLength,
        maxLength: maxLength,
        maxAttempts: maxAttempts,
        allowDuplicates: allowDuplicates,
    };
    const chain = new MarkovChain(order, dict['words']);
    let passwords = [];
    let password = null;
    let attempts = 0;

    for (let i = 0; i < count; ++i) {
        do {
            try {
                password = chain.generate(constraints);
                passwords.push(password);
            } catch(err) {
                // console.error('Constraints could not be met, trying again...');
                ++attempts;
            }
        } while (password == null && attempts < maxAttempts);
        password = null;
    }
    return {
        constraints: constraints,
        options: { count: count, order: order },
        result: passwords,
    };
}

export { genMarkovPass };

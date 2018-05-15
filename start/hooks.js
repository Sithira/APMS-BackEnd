const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersRegistered(() => {

    const Validator = use('Validator');

    const Database = use('Database');

    const existsFn = async (data, field, message, args, get) => {

        const value = get(data, field);

        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
             */
            return
        }

        const [table, column] = args;

        const row = await Database.collection(table).find(column, value);

        if (!row) {
            throw message
        }
    };

    const requiredWhenMultipleFn = async (data, field, message, args, get) => {

        return new Promise(((resolve, reject) => {

            const fieldValue = get(data, field);

            if (!fieldValue)
            {
                return;
            }

            if (fieldValue && !Array.isArray(fieldValue))
            {
                return reject(message);
            }

            resolve("Validation Passed");

        }));

    };

    Validator.extend('requiredWhenMultiple', requiredWhenMultipleFn);

    Validator.extend('exists', existsFn);


});
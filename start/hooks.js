const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersRegistered(() => {

    const Validator = use('Validator');

    const Database = use('Database');

    const ObjectID = use('mongodb').ObjectID;

    const existsFn = async (data, field, message, args, get) => {

        const db = await Database.connect();

        let value = get(data, field);

        if (!value) {
            /**
             * skip validation if value is not defined. `required` rule
             * should take care of it.
             */
            return
        }

        const [table, column] = args;

        let json = {};

        if (column === "_id")
        {
            value = new ObjectID(value);
        }

        json[column] = value;

        // console.log(json);

        let row = await db.collection(table).findOne(json);

        // console.log(`Table: ${table} Column: ${column} - Value: ${value}`);
        //
        // console.log(row);

        if (row === null)
        {
            throw message;
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
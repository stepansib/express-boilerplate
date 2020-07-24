exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('companies').del()
        .then(function () {
            // Inserts seed entries
            return knex('companies').insert([
                {id: 1, name: 'ClearScale'},
                {id: 2, name: 'Microsoft'},
                {id: 3, name: 'Pyaterochka'},
                {id: 4, name: 'Oracle'},
            ]);
        });
};

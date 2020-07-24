exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('persons').del()
        .then(function () {
            // Inserts seed entries
            return knex('persons').insert([
                {
                    id: 1,
                    firstName: 'Stepan',
                    lastName: 'Yudin',
                    email: 'stepan.sib@gmail.com',
                    companyId: 1,
                },
                {
                    id: 2,
                    firstName: 'Bill',
                    lastName: 'Gates',
                    email: 'bg@microsoft.com',
                    companyId: 2,
                },
                {
                    id: 3,
                    firstName: 'Alexey',
                    lastName: 'Korzhov',
                    email: 'alexey.korzhov@clearscale.net',
                    companyId: 1,
                },
                {
                    id: 4,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: null,
                    companyId: null,
                },
            ]);
        });
};

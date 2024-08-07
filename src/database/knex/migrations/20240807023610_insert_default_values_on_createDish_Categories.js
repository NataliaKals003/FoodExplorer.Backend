exports.up = async knex => {
    await knex("dish_categories").insert([
        { name: 'Refeições' },
        { name: 'Sobremesas' },
        { name: 'Bebidas' },
    ]);
};

exports.down = async knex => {
    return Promise.resolve();
};

exports.up = knex => knex.schema.table("dishes", table => {
    table.renameColumn("dishImg", "dish_image");
});

exports.down = knex => knex.schema.table("dishes", table => {
    table.renameColumn("dish_image", "dishImg");
});
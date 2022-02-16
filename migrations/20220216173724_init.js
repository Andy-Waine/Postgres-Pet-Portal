/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('serialno').notNullable();
      table.string('nameofpet').notNullable();
      table.string('sexofpet').notNullable();
      table.string('speciesofpet').notNullable();
      table.string('breedofpet').notNullable();
      table.string('colorofpet').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

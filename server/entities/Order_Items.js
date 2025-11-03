import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "OrderItem",
  tableName: "order_items",
  columns: {
    id: { type: Number, primary: true, generated: true },
    order_id: { type: Number, nullable: false },
    item_name: { type: String, length: 255, nullable: false },
    price: { type: "numeric", nullable: false },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: { name: "order_id", referencedColumnName: "id" },
    },
  },
});

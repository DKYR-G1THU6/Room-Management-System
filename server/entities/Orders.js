import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: { type: Number, primary: true, generated: true },
    room: { type: String, length: 50, nullable: false },
    status: { type: String, length: 50, nullable: false },
    timestamp: { type: "timestamp", nullable: false },
  },

  relations: {
    roomRef: {
      type: "many-to-one",
      target: "Room",
      joinColumn: { name: "room", referencedColumnName: "roomNo" },
    },
  },
});

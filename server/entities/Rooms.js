import { EntitySchema } from "typeorm";

// Room entity mapping to 'rooms' table
export default new EntitySchema({
  name: "Room",
  tableName: "rooms",
  columns: {
    id: { type: Number, primary: true, generated: true },
    roomNo: { name: "room_no", type: String, length: 50, unique: true },
    location: { type: String, length: 100 },
    description: { type: String, nullable: true },
    createdAt: { name: "created_at", type: "timestamp", createDate: true },
  },
});

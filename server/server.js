import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { In } from "typeorm";
import { AppDataSource } from "./data-source.js";
dotenv.config();


const typeDefs = `
  type Room {
    id: ID!
    RoomNo: Int!
    Location: String!
    Description: String!
  }

  type OrderItem {
    name: String!
    price: Float!
  }

 
  type Order {
    id: ID!
    room: String!
    items: [OrderItem!]!
    status: String!
    timestamp: String!
  }

  type Query {
    rooms: [Room!]!
    orders(search: String, sortBy: String, sortDirection: String): [Order!]!
  }

  type Mutation {
    addRoom(RoomNo: Int!, Location: String!, Description: String!): Room!
    updateRoom(id: ID!, RoomNo: Int!, Location: String!, Description: String!): Room!
    deleteRooms(ids: [ID!]!): Boolean
    
    updateOrderStatus(id: ID!, status: String!): Order!
    bulkUpdateStatus(ids: [ID!]!, status: String!): Boolean
  }
`;


const resolvers = {
  Query: {
    rooms: async () => {
      const repo = AppDataSource.getRepository("Room");
      const rows = await repo.find({ order: { id: "ASC" } });
      return rows.map(r => ({
        id: String(r.id),
        RoomNo: r.roomNo,
        Location: r.location,
        Description: r.description ?? "",
      }));
    },
    orders: async (_parent, { search, sortBy, sortDirection }) => {
      const orderRepo = AppDataSource.getRepository("Order");
      const itemRepo = AppDataSource.getRepository("OrderItem");

      const orders = await orderRepo.find();
      const orderIds = orders.map(o => o.id);
      const items = orderIds.length
        ? await itemRepo.find({ where: { order_id: In(orderIds) } })
        : [];

      // group items by order_id
      const itemsByOrder = new Map();
      for (const it of items) {
        const list = itemsByOrder.get(it.order_id) ?? [];
        list.push({ name: it.item_name, price: parseFloat(it.price) });
        itemsByOrder.set(it.order_id, list);
      }

      let result = orders.map(o => ({
        id: String(o.id),
        room: String(o.room ?? ""),
        items: itemsByOrder.get(o.id) ?? [],
        status: o.status,
        timestamp: o.timestamp instanceof Date ? o.timestamp.toISOString() : String(o.timestamp),
      }));

      if (search) {
        const s = String(search).toLowerCase();
        result = result.filter(ord =>
          String(ord.room).toLowerCase().includes(s) || ord.items.some(it => (it.name || "").toLowerCase().includes(s))
        );
      }

      if (sortBy) {
        result.sort((a, b) => {
          let cmp = 0;
          if (sortBy === "room") {
            const roomA = String(a.room ?? "");
            const roomB = String(b.room ?? "");
           
            cmp = roomA.localeCompare(roomB, undefined, { numeric: true, sensitivity: "base" });
          } else if (sortBy === "time") {
            cmp = new Date(a.timestamp) - new Date(b.timestamp);
          } else if (sortBy === "total") {
            const ta = a.items.reduce((sum, it) => sum + (it.price || 0), 0);
            const tb = b.items.reduce((sum, it) => sum + (it.price || 0), 0);
            cmp = ta - tb;
          }
          return sortDirection === "asc" ? cmp : -cmp;
        });
      }

      return result;
    },
  },

  Mutation: {
    addRoom: async (_p, { RoomNo, Location, Description }) => {
      const repo = AppDataSource.getRepository("Room");
      const entity = repo.create({ roomNo: String(RoomNo), location: Location, description: Description });
      const saved = await repo.save(entity);
      return { id: String(saved.id), RoomNo: saved.roomNo, Location: saved.location, Description: saved.description ?? "" };
    },

    updateRoom: async (_p, { id, RoomNo, Location, Description }) => {
      const repo = AppDataSource.getRepository("Room");
      const key = { id: Number(id) };
      await repo.update(key, { roomNo: String(RoomNo), location: Location, description: Description });
      const updated = await repo.findOne({ where: key });
      if (!updated) throw new Error("Room not found");
      return { id: String(updated.id), RoomNo: updated.roomNo, Location: updated.location, Description: updated.description ?? "" };
    },

    deleteRooms: async (_p, { ids }) => {
      const repo = AppDataSource.getRepository("Room");
      const numericIds = ids.map(i => Number(i));
      await repo.delete(numericIds);
      return true;
    },

    updateOrderStatus: async (_p, { id, status }) => {
      const orderRepo = AppDataSource.getRepository("Order");
      const itemRepo = AppDataSource.getRepository("OrderItem");
      const key = { id: Number(id) };
      await orderRepo.update(key, { status });
      const o = await orderRepo.findOne({ where: key });
      if (!o) throw new Error("Order not found");
      const its = await itemRepo.find({ where: { order_id: o.id } });
      return {
        id: String(o.id),
        room: o.room,
        status: o.status,
        timestamp: o.timestamp instanceof Date ? o.timestamp.toISOString() : String(o.timestamp),
        items: its.map(it => ({ name: it.item_name, price: parseFloat(it.price) })),
      };
    },

    bulkUpdateStatus: async (_p, { ids, status }) => {
      const orderRepo = AppDataSource.getRepository("Order");
      const numericIds = ids.map(i => Number(i));
      if (numericIds.length === 0) return true;
      await orderRepo.createQueryBuilder()
        .update()
        .set({ status })
        .whereInIds(numericIds)
        .execute();
      return true;
    },
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

try {
  await AppDataSource.initialize();
  console.log("✅ TypeORM connected to Postgres");

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
} catch (err) {
  console.error("❌ Failed to initialize DB or start server:", err);
  process.exit(1);
}

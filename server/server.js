import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

let rooms = [
    { id: "1", RoomNo: 101, Location: 'Level 1', Description: 'A nice room' },
    { id: "2", RoomNo: 102, Location: 'Level 1', Description: 'A luxurious room' },
    { id: "3", RoomNo: 301, Location: 'Level 3', Description: 'A cozy room' },
    { id: "4", RoomNo: 201, Location: 'Level 2', Description: 'A simple room' },
    { id: "5", RoomNo: 302, Location: 'Level 3', Description: 'A grand room' },
    { id: "6", RoomNo: 103, Location: 'Level 1', Description: 'A mysterious room' },
    { id: "7", RoomNo: 202, Location: 'Level 2', Description: 'A spacious room' },
    { id: "8", RoomNo: 104, Location: 'Level 1', Description: 'A cozy room' },
    { id: "9", RoomNo: 303, Location: 'Level 3', Description: 'A luxurious room' },
];

let orders = [
   {
    "id": "1",
    "room": "101",
    "items": [
      { "name": "Large Pepperoni Pizza", "price": 18.50 },
      { "name": "Coke Zero (Can)", "price": 3.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T10:30:00"
  },
  {
    "id": "2",
    "room": "201",
    "items": [
      { "name": "Spaghetti Carbonara", "price": 15.99 },
      { "name": "Caesar Salad (Side)", "price": 6.50 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T10:15:00"
  },
  {
    "id": "3",
    "room": "303",
    "items": [
      { "name": "Grilled Salmon", "price": 28.00 },
      { "name": "White Wine (Bottle)", "price": 45.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T10:45:00"
  },
  {
    "id": "4",
    "room": "110",
    "items": [
      { "name": "Espresso Shot", "price": 3.50 },
      { "name": "Blueberry Muffin", "price": 4.50 },
      { "name": "Orange Juice (Fresh)", "price": 6.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T10:50:00"
  },
  {
    "id": "5",
    "room": "408",
    "items": [
      { "name": "Club Sandwich", "price": 14.00 },
      { "name": "Fries (Side)", "price": 4.50 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T10:20:00"
  },
  {
    "id": "6",
    "room": "215",
    "items": [
      { "name": "Local Craft Beer (2)", "price": 15.00 },
      { "name": "Nachos Grande", "price": 12.50 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T09:40:00"
  },
  {
    "id": "7",
    "room": "502",
    "items": [
      { "name": "Chocolate Cake Slice", "price": 8.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:05:00"
  },
  {
    "id": "8",
    "room": "312",
    "items": [
      { "name": "Still Water (Large)", "price": 4.00 },
      { "name": "Mixed Nuts Platter", "price": 9.00 }
    ],
    "status": "cancelled",
    "timestamp": "2025-10-28T09:00:00"
  },
  {
    "id": "9",
    "room": "401",
    "items": [
      { "name": "Breakfast Burrito", "price": 11.50 },
      { "name": "Black Coffee", "price": 3.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:00:00"
  },
  {
    "id": "10",
    "room": "105",
    "items": [
      { "name": "Ice Cream (Vanilla)", "price": 6.50 },
      { "name": "Hot Tea (Green)", "price": 4.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:15:00"
  },
  {
    "id": "11",
    "room": "510",
    "items": [
      { "name": "Cheeseburger (Well Done)", "price": 16.50 },
      { "name": "Milkshake (Chocolate)", "price": 7.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:20:00"
  },
  {
    "id": "12",
    "room": "208",
    "items": [
      { "name": "Fruit Platter", "price": 18.00 }
    ],
    "status": "delivered",
    "timestamp": "2025-10-28T09:30:00"
  },
  {
    "id": "13",
    "room": "315",
    "items": [
      { "name": "Omelette (Cheese & Ham)", "price": 10.99 },
      { "name": "Toast (2 Slices)", "price": 2.00 }
    ],
    "status": "pending",
    "timestamp": "2025-10-28T11:35:00"
  },
  {
    "id": "14",
    "room": "405",
    "items": [
      { "name": "Sushi Set (Chef's Choice)", "price": 35.00 }
    ],
    "status": "cancelled",
    "timestamp": "2025-10-28T10:00:00"
  },
  {
    "id": "15",
    "room": "509",
    "items": [
      { "name": "Glass of Champagne", "price": 18.00 },
      { "name": "Strawberries (Side)", "price": 7.00 }
    ],
    "status": "preparing",
    "timestamp": "2025-10-28T11:40:00"
  }

];


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
    rooms: () => rooms,
    orders: (parent, { search, sortBy, sortDirection }) => {
      let result = [...orders];
      if (search) {
        const searchLower = search.toLowerCase();
        result = result.filter(order => 
          order.room.includes(search) || order.items.some(item => item.name.toLowerCase().includes(searchLower))
        );
      }

      if (sortBy) {
        result.sort((a, b) => {
          let comparison = 0;
          
          if (sortBy === 'room') {
            comparison = a.room.localeCompare(b.room);
          } else if (sortBy === 'time') {
            comparison = new Date(a.timestamp) - new Date(b.timestamp);
          } else if (sortBy === 'total') {
            const totalA = a.items.reduce((sum, item) => sum + item.price, 0);
            const totalB = b.items.reduce((sum, item) => sum + item.price, 0);
            comparison = totalA - totalB;
          }
          
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }

      return result;
      },
  },

  Mutation: {
    addRoom: (_, { RoomNo, Location, Description }) => {
      const newRoom = {
        id: rooms.length + 1,
        RoomNo,
        Location,
        Description,
      };
      rooms.push(newRoom);
      return newRoom;
    },

    updateRoom: (_, { id, RoomNo, Location, Description }) => {
      const index = rooms.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Room not found");
      const updated = { id, RoomNo, Location, Description };
      rooms[index] = updated;
      return updated;
    },

    deleteRooms: (_, { ids }) => {
      rooms = rooms.filter((r) => !ids.includes(r.id));
      return true;
    },

    updateOrderStatus: (_, { id, status }) => {
      const orderId = String(id);
      const orderIndex = orders.findIndex(o => o.id === orderId);
      
      if (orderIndex === -1) throw new Error("Order not found");
      
     
      orders[orderIndex] = { ...orders[orderIndex], status };
      return orders[orderIndex];
    },
    
    
    bulkUpdateStatus: (_, { ids, status }) => {
      orders = orders.map(order => {
        if (ids.includes(order.id)) {
          return { ...order, status };
        }
        return order;
      });
      return true;
    }
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);

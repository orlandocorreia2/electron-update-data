// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();

const getAuctionProperties = async () => {
  try {
    console.log(" adosid");
    // return await prisma.auctionProperty.findMany();
  } catch (error) {
    console.error("Error fetching auction properties:", error);
  }
};

module.exports = {
  getAuctionProperties,
};

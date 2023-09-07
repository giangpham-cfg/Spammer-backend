import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to the Spammer Server" });
});

//get request
app.get("/messages", async (req, res) => {
  const nestMessages = (messages, parentId = null) => {
    const nestedMessages = [];

    for (const message of messages) {
      if (message.parentId === parentId) {
        // Recursively nest child messages
        const children = nestMessages(messages, message.id);
        if (children.length > 0) {
          message.children = children;
        }
        nestedMessages.push(message);
      }
    }
    return nestedMessages;
  };

  const messages = await prisma.message.findMany({
    include: {
      children: true,
    },
  });
  // Use the recursive function to nest the messages properly
  const nestedMessages = nestMessages(messages);
  res.send({ success: true, messages: nestedMessages });
});

//delete request
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const message = await prisma.message.delete({
    where: {
      id: messageId,
    },
  });
  res.send({ success: true, message });
});

//post request
app.post("/messages", async (req, res) => {
  // const { text, parentId } = req.body;

  // if (!text)
  //   return res.send({
  //     success: false,
  //     error: "Text must be provided to create a message!",
  //   });

  // let message;

  // if (!parentId) {
  //   message = await prisma.message.create({
  //     data: {
  //       text,
  //       parentId,
  //     },
  //   });
  // } else {
  //   message = await prisma.children.create({
  //     data: {
  //       text,
  //       message: {
  //         connect: {
  //           id: parentId,
  //         },
  //       },
  //     },
  //   });
  // }

  const { text, parentId } = req.body;

  if (!text)
    return res.send({
      success: false,
      error: "Text must be provided to create a message!",
    });

  // Check if parentId is provided
  if (parentId) {
    // Create a child message
    const parentMessage = await prisma.message.findUnique({
      where: { id: parentId },
    });

    if (!parentMessage) {
      return res.send({ error: "The message not found." });
    }

    const childMessage = await prisma.message.create({
      data: {
        text,
        parentId,
      },
    });

    return res.send({ success: true, message: childMessage });
  } else {
    // Create a top-level message
    const message = await prisma.message.create({
      data: {
        text,
      },
    });

    return res.send({ success: true, message });
  }
});
// const { text, parentId } = req.body;

//   if (!text)
//     return res.send({
//       success: false,
//       error: "Text must be provided to create a message!",
//     });

//   let messageToCreate = {
//     text,
//   };

//   if (parentId) {
//     // If parentId is provided, we create a child message
//     messageToCreate = {
//       ...messageToCreate,
//       parentId,
//     };
//   }

//   const createdMessage = await prisma.message.create({
//     data: messageToCreate,
//   });
//   res.send({ success: true, message: createdMessage });
// });

//put request
app.put("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text, likes } = req.body;
  if (!text && !likes)
    return res.send({
      success: false,
      error: "Should provide text or likes to update a message!",
    });
  const message = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      text,
      likes,
    },
  });
  res.send({ success: true, message });
});

//handle error when client uses wrong route
app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

// express's built in error handling. need 4 paramaters to activate
app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

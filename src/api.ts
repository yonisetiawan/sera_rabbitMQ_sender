// src/api.ts
import express, { Request, Response } from 'express';
import amqp from "amqplib";

const router = express.Router();

router.post('/sender', (req: Request, res: Response) => {
  const queue = "antrian email";
  const text = { name: req.body.name, subject: req.body.subject, email: req.body.email, message: req.body.message};

  (async () => {
    let connection;
    try {
      connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)));
      res.send(text);
      await channel.close();
    } catch (err) {
      res.send(err);
    } finally {
      if (connection) await connection.close();
    }
  })();

  
});

export default router;
